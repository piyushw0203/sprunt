# -*- coding: utf-8 -*-

from __future__ import annotations

import logging

from typing import TYPE_CHECKING, Final

from .buffer import HeapJitterBuffer as JitterBuffer
from .rtp import FakePacket

from discord.opus import Decoder

if TYPE_CHECKING:
    from typing import Optional, Tuple, Dict, Callable, Any
    from .rtp import RTPPacket, AudioPacket
    from .sinks import AudioSink
    from .router import PacketRouter
    from .voice_client import VoiceRecvClient
    from .types import MemberOrUser as User

    EventCB = Callable[..., Any]
    EventData = Tuple[str, Tuple[Any, ...], Dict[str, Any]]

log = logging.getLogger(__name__)

__all__ = [
    'VoiceData',
]

BUFFER_TIMEOUT: Final = 0.05


class VoiceData:
    """Container object for audio data and source user."""

    __slots__ = ('packet', 'source', 'pcm')

    def __init__(self, packet: AudioPacket, source: Optional[User], *, pcm: Optional[bytes] = None):
        self.packet: AudioPacket = packet
        self.source: Optional[User] = source
        self.pcm: bytes = pcm if pcm else b''

    @property
    def opus(self) -> Optional[bytes]:
        return self.packet.decrypted_data


class PacketDecoder:
    def __init__(self, router: PacketRouter, ssrc: int):
        self.router: PacketRouter = router
        self.ssrc: int = ssrc

        self._decoder: Optional[Decoder] = None if self.sink.wants_opus() else Decoder()
        self._buffer: JitterBuffer = JitterBuffer()
        self._cached_id: Optional[int] = None

        self._last_ts: int = 0
        self._last_seq: int = 0

    @property
    def sink(self) -> AudioSink:
        return self.router.sink

    def _get_user(self, user_id: int) -> Optional[User]:
        vc: VoiceRecvClient = self.sink.voice_client  # type: ignore
        return vc.guild.get_member(user_id) or vc.client.get_user(user_id)

    def _get_cached_member(self) -> Optional[User]:
        return self._get_user(self._cached_id) if self._cached_id else None

    def push_packet(self, packet: RTPPacket) -> None:
        self._buffer.push(packet)

    def pop_data(self, *, timeout: float = BUFFER_TIMEOUT) -> Optional[VoiceData]:
        packet = self._get_next_packet(timeout)
        if packet is None:
            return

        return self._process_packet(packet)

    def set_user_id(self, user_id: int) -> None:
        self._cached_id = user_id

    def reset(self) -> None:
        self._buffer.reset()
        self._decoder = None if self.sink.wants_opus() else Decoder()
        self._last_seq = self._last_ts = 0

    def destroy(self) -> None:
        self._buffer.reset()
        self._decoder = None

    def _get_next_packet(self, timeout: float) -> Optional[AudioPacket]:
        packet = self._buffer.pop(timeout=timeout)

        if packet is None:
            # Gets the last (buffered) packet out (i think)
            # TODO: revist this, might be an issue
            if self._buffer:
                packets = self._buffer.flush()
                if any(packets[1:]):
                    log.warning("%s packets were lost being flushed in decoder-%s", len(packets) - 1, self.ssrc)
                return packets[0]
            return
        elif not packet:
            packet = self._make_fakepacket()

        return packet

    def _make_fakepacket(self) -> FakePacket:
        seq = self._last_seq + 1
        ts = self._last_ts + Decoder.SAMPLES_PER_FRAME
        return FakePacket(self.ssrc, seq, ts)

    def _process_packet(self, packet: AudioPacket) -> VoiceData:
        pcm = None
        if not self.sink.wants_opus():
            packet, pcm = self._decode_packet(packet)

        member = self._get_cached_member()

        if member is None:
            self._cached_id = self.sink.voice_client._get_id_from_ssrc(self.ssrc)  # type: ignore
            member = self._get_cached_member()

        data = VoiceData(packet, member, pcm=pcm)
        self._last_seq = packet.sequence
        self._last_ts = packet.timestamp

        return data

    def _decode_packet(self, packet: AudioPacket) -> Tuple[AudioPacket, bytes]:
        assert self._decoder is not None

        # Decode as per usual
        if packet:
            pcm = self._decoder.decode(packet.decrypted_data, fec=False)
            return packet, pcm

        # Fake packet, need to check next one to use fec
        next_packet = self._buffer.peek_next()

        if next_packet is not None:
            nextdata: bytes = next_packet.decrypted_data  # type: ignore

            log.debug(
                "Generating fec packet: fake=%s, fec=%s",
                packet.sequence,
                next_packet.sequence,
            )
            pcm = self._decoder.decode(nextdata, fec=True)

        # Need to drop a packet
        else:
            pcm = self._decoder.decode(None, fec=False)

        return packet, pcm
