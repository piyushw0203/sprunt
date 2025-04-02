import os
import discord
from discord.ext import commands, tasks
from discord.ext.voice_recv import VoiceRecvClient, AudioSink, WaveSink
from dotenv import load_dotenv
import asyncio
import wave
import io
import tempfile
from datetime import datetime
import numpy as np
from collections import deque
import time
import copy
import pathlib
import groq
import base64
import json
from supabase import create_client, Client
from urllib.parse import urlencode
import aiohttp

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_ANON_KEY')
)

# Initialize Groq client
groq_client = groq.Groq(api_key=os.getenv('GROQ_API_KEY'))

# Discord OAuth2 settings
DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')

# Create recordings directory
RECORDINGS_DIR = pathlib.Path("audio_recordings")
RECORDINGS_DIR.mkdir(exist_ok=True)

# Bot setup
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

# Voice client setup
bot.voice_client_class = VoiceRecvClient

# Store active connections
active_connections = {}

# Status emojis
LISTENING_EMOJI = "👂"
PROCESSING_EMOJI = "🎙️"
IDLE_EMOJI = "⏸️"
SPEAKING_EMOJI = "🗣️"

# Update interval in seconds (increased to avoid rate limiting)
UPDATE_INTERVAL = 2.0

class VoiceTranscriptionSink(AudioSink):
    def __init__(self, guild_id: int):
        super().__init__()
        self.guild_id = guild_id
        self.speaking_users = set()
        self.last_status_update = {}  # Track last status update per user
        self.audio_buffer = []  # Buffer for raw audio data
        self.is_recording = True  # Flag to track recording state
        
    def wants_opus(self) -> bool:
        """We want PCM data for calculating audio levels"""
        return False
        
    def write(self, user: discord.User, data):
        """Handle incoming audio data"""
        if self.guild_id in active_connections and self.is_recording:
            conn = active_connections[self.guild_id]
            try:
                # Store raw audio data
                conn['audio_data'].append(data.pcm)
                conn['last_audio_time'] = datetime.now()
                
                # Calculate audio level from the PCM data
                audio_array = np.frombuffer(data.pcm, dtype=np.int16)
                audio_level = np.abs(audio_array).mean() / 32768.0  # Normalize to 0-1
                conn['audio_buffer'].append(audio_level)
                
                # Keep track of the last audio time
                conn['last_audio_time'] = datetime.now()
            except Exception as e:
                print(f"Error in write method: {e}")

    def stop_recording(self):
        """Stop recording audio"""
        self.is_recording = False

    @AudioSink.listener()
    def on_voice_member_speaking_start(self, member):
        """Called when a member starts speaking"""
        if self.guild_id in active_connections:
            current_time = time.time()
            # Only update if we haven't recently updated for this user
            if member.id not in self.last_status_update or \
               current_time - self.last_status_update.get(member.id, 0) > 1.0:
                self.speaking_users.add(member.id)
                active_connections[self.guild_id]['speaking_users'] = self.speaking_users.copy()
                self.last_status_update[member.id] = current_time
    
    @AudioSink.listener()
    def on_voice_member_speaking_stop(self, member):
        """Called when a member stops speaking"""
        if self.guild_id in active_connections:
            current_time = time.time()
            # Only update if we haven't recently updated for this user
            if member.id not in self.last_status_update or \
               current_time - self.last_status_update.get(member.id, 0) > 1.0:
                self.speaking_users.discard(member.id)
                active_connections[self.guild_id]['speaking_users'] = self.speaking_users.copy()
                self.last_status_update[member.id] = current_time
    
    @AudioSink.listener()
    def on_voice_member_disconnect(self, member, ssrc):
        """Called when a member disconnects from voice"""
        if self.guild_id in active_connections:
            self.speaking_users.discard(member.id)
            active_connections[self.guild_id]['speaking_users'] = self.speaking_users.copy()
            self.last_status_update.pop(member.id, None)
    
    def cleanup(self):
        """Clean up resources"""
        self.speaking_users.clear()
        self.last_status_update.clear()

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')
    await bot.change_presence(activity=discord.Game(name="!join to start recording"))
    update_status_loop.start()

@bot.command(name='join')
async def join(ctx):
    """Join the user's voice channel"""
    if not ctx.author.voice:
        await ctx.send("You are not connected to a voice channel!")
        return
    
    channel = ctx.author.voice.channel
    if ctx.voice_client:
        await ctx.voice_client.move_to(channel)
    else:
        vc = await channel.connect(cls=VoiceRecvClient)
        active_connections[ctx.guild.id] = {
            'vc': vc,
            'audio_data': [],
            'start_time': datetime.now(),
            'last_audio_time': datetime.now(),
            'status_message': None,
            'audio_buffer': deque(maxlen=50),  # Buffer for audio levels
            'last_update': 0,  # Last update timestamp
            'current_level': 0,  # Current smoothed audio level
            'speaking_users': set(),  # Set of currently speaking users
            'last_status_text': ""  # Track last status text to avoid unnecessary updates
        }
        
        # Create and set up the audio sink
        sink = VoiceTranscriptionSink(ctx.guild.id)
        vc.listen(sink)
        
        await ctx.send(f"{LISTENING_EMOJI} Joined {channel.name} and started listening!")
        # Create and pin a status message
        status_msg = await ctx.send(f"{LISTENING_EMOJI} Listening... (Audio levels: 0%)\nNo one is speaking")
        await status_msg.pin()
        active_connections[ctx.guild.id]['status_message'] = status_msg

@tasks.loop(seconds=UPDATE_INTERVAL)
async def update_status_loop():
    """Background task to update status messages"""
    current_time = time.time()
    
    # Create a copy of the keys to avoid RuntimeError
    guild_ids = list(active_connections.keys())
    
    for guild_id in guild_ids:
        if guild_id not in active_connections:
            continue
            
        conn = active_connections[guild_id]
        
        # Check if status message exists and is valid
        if not conn['status_message']:
            try:
                # Get the channel from the voice client
                channel = conn['vc'].channel
                if channel:
                    # Create new status message
                    status_msg = await channel.send(f"{LISTENING_EMOJI} Listening... (Audio levels: 0%)\nNo one is speaking")
                    await status_msg.pin()
                    conn['status_message'] = status_msg
            except Exception as e:
                print(f"Error creating new status message: {e}")
                continue
        
        # Only update if we have new audio data and enough time has passed
        if conn['audio_buffer'] and current_time - conn['last_update'] >= UPDATE_INTERVAL:
            try:
                # Calculate smoothed audio level
                audio_level = sum(conn['audio_buffer']) / len(conn['audio_buffer'])
                conn['current_level'] = audio_level
                
                # Create visual bar
                bar_length = 20
                filled = int(audio_level * bar_length)
                bar = "█" * filled + "░" * (bar_length - filled)
                
                # Get speaking users
                speaking_users = conn['speaking_users']
                speaking_text = "No one is speaking"
                if speaking_users:
                    # Get member objects for each speaking user
                    guild = bot.get_guild(guild_id)
                    speaking_members = []
                    for user_id in speaking_users:
                        member = guild.get_member(user_id)
                        if member:
                            speaking_members.append(member.display_name)
                    speaking_text = f"{SPEAKING_EMOJI} Speaking: {', '.join(speaking_members)}"
                
                # Create new status text
                status_text = f"{LISTENING_EMOJI} Listening... (Audio levels: {audio_level:.1%})\n{bar}\n{speaking_text}"
                
                # Only update if the text has changed
                if status_text != conn['last_status_text']:
                    try:
                        await conn['status_message'].edit(content=status_text)
                        conn['last_status_text'] = status_text
                    except discord.NotFound:
                        # Message was deleted, create a new one
                        channel = conn['vc'].channel
                        if channel:
                            status_msg = await channel.send(status_text)
                            await status_msg.pin()
                            conn['status_message'] = status_msg
                            conn['last_status_text'] = status_text
                    except discord.HTTPException as e:
                        if e.code == 429:  # Rate limit error
                            print(f"Rate limited, waiting {e.retry_after} seconds")
                            await asyncio.sleep(e.retry_after)
                        else:
                            print(f"Error updating status message: {e}")
                
                # Clear buffer and update timestamp
                conn['audio_buffer'].clear()
                conn['last_update'] = current_time
            except Exception as e:
                print(f"Error updating status: {e}")
                # If there's an error, try to recreate the status message
                try:
                    channel = conn['vc'].channel
                    if channel:
                        status_msg = await channel.send(f"{LISTENING_EMOJI} Listening... (Audio levels: 0%)\nNo one is speaking")
                        await status_msg.pin()
                        conn['status_message'] = status_msg
                except Exception as e2:
                    print(f"Error recreating status message: {e2}")

@bot.command(name='transcript')
async def transcript(ctx):
    """Save the current recording without transcription"""
    if ctx.guild.id not in active_connections:
        await ctx.send("No active recording session!")
        return
    
    await ctx.send(f"{PROCESSING_EMOJI} Saving recording...")
    await save_audio(ctx)
    await ctx.send("Recording saved!")

@bot.command(name='leave')
async def leave(ctx):
    """Leave the voice channel and generate transcript"""
    if ctx.voice_client:
        if ctx.guild.id in active_connections:
            conn = active_connections[ctx.guild.id]
            # Stop recording before processing
            if hasattr(conn['vc'].sink, 'stop_recording'):
                conn['vc'].sink.stop_recording()
            
            if conn['status_message']:
                try:
                    await conn['status_message'].unpin()
                    await conn['status_message'].delete()
                except:
                    pass
            
            # Save the recording and generate transcript before leaving
            await save_transcript(ctx)
            del active_connections[ctx.guild.id]
        await ctx.voice_client.disconnect()
        await ctx.send("Left the voice channel")
    else:
        await ctx.send("I'm not in a voice channel!")

async def save_audio(ctx):
    """Save the recorded audio without transcription"""
    if ctx.guild.id not in active_connections:
        return
    
    conn = active_connections[ctx.guild.id]
    audio_data = conn['audio_data']
    
    if not audio_data:
        return
    
    # Create guild-specific directory
    guild_dir = RECORDINGS_DIR / str(ctx.guild.id)
    guild_dir.mkdir(exist_ok=True)
    
    # Generate filename with timestamp and guild name
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_guild_name = "".join(c for c in ctx.guild.name if c.isalnum() or c in (' ', '-', '_')).strip()
    filename = f"{timestamp}_{safe_guild_name}.wav"
    filepath = guild_dir / filename
    
    # Create a WAV file from the audio data
    with wave.open(str(filepath), 'wb') as wav_file:
        wav_file.setnchannels(2)  # Stereo
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(48000)  # Discord's sample rate
        
        for audio in audio_data:
            wav_file.writeframes(audio)
    
    # Create metadata file with recording information
    metadata = {
        'guild_name': ctx.guild.name,
        'guild_id': ctx.guild.id,
        'channel_name': ctx.voice_client.channel.name,
        'start_time': conn['start_time'].isoformat(),
        'end_time': datetime.now().isoformat(),
        'duration': str(datetime.now() - conn['start_time']),
        'file_path': str(filepath)
    }
    
    metadata_file = guild_dir / f"{timestamp}_{safe_guild_name}_metadata.txt"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        # Write metadata
        for key, value in metadata.items():
            f.write(f"{key}: {value}\n")
    
    print(f"Saved audio to {filepath}")
    print(f"Saved metadata to {metadata_file}")
    
    return filepath, metadata_file

async def store_transcription_in_supabase(guild_id: int, guild_name: str, channel_name: str, 
                                        start_time: datetime, end_time: datetime, 
                                        transcription: str, audio_file_path: str,
                                        user_id: int, user_name: str):
    """Store transcription data in Supabase"""
    try:
        # Convert file to base64
        with open(audio_file_path, 'rb') as file:
            audio_base64 = base64.b64encode(file.read()).decode('utf-8')
        
        # Prepare data for Supabase
        data = {
            'guild_id': str(guild_id),
            'guild_name': guild_name,
            'channel_name': channel_name,
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat(),
            'transcription': transcription,
            'audio_data': audio_base64,
            'created_at': datetime.now().isoformat(),
            'user_id': str(user_id),
            'user_name': user_name
        }
        
        # Insert data into Supabase
        result = supabase.table('transcriptions').insert(data).execute()
        return result.data[0] if result.data else None
        
    except Exception as e:
        print(f"Error storing transcription in Supabase: {e}")
        return None

async def save_transcript(ctx):
    """Save the recorded audio and generate transcript"""
    if ctx.guild.id not in active_connections:
        return
    
    conn = active_connections[ctx.guild.id]
    audio_data = conn['audio_data']
    
    if not audio_data:
        await ctx.send("No audio data to transcribe!")
        return
    
    await ctx.send(f"{PROCESSING_EMOJI} Processing audio...")
    
    # Create guild-specific directory
    guild_dir = RECORDINGS_DIR / str(ctx.guild.id)
    guild_dir.mkdir(exist_ok=True)
    
    # Generate filename with timestamp and guild name
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_guild_name = "".join(c for c in ctx.guild.name if c.isalnum() or c in (' ', '-', '_')).strip()
    filename = f"{timestamp}_{safe_guild_name}.wav"
    filepath = guild_dir / filename
    
    try:
        # Create a WAV file from the audio data
        with wave.open(str(filepath), 'wb') as wav_file:
            wav_file.setnchannels(2)  # Stereo
            wav_file.setsampwidth(2)  # 16-bit
            wav_file.setframerate(48000)  # Discord's sample rate
            
            # Write all audio data
            for audio in audio_data:
                wav_file.writeframes(audio)
        
        # Print file size for debugging
        file_size = os.path.getsize(filepath)
        print(f"Audio file size: {file_size / 1024:.2f} KB")
        
        await ctx.send(f"{PROCESSING_EMOJI} Transcribing audio...")
        
        # Transcribe the audio using the generated WAV file
        transcription = await transcribe_audio(str(filepath))
        
        if not transcription:
            await ctx.send("❌ Failed to transcribe audio!")
            return
        
        # Store in Supabase
        stored_data = await store_transcription_in_supabase(
            guild_id=ctx.guild.id,
            guild_name=ctx.guild.name,
            channel_name=ctx.voice_client.channel.name,
            start_time=conn['start_time'],
            end_time=datetime.now(),
            transcription=transcription,
            audio_file_path=str(filepath),
            user_id=ctx.author.id,
            user_name=ctx.author.name
        )
        
        if stored_data:
            # Generate OAuth2 URL for redirect
            oauth_url = f"https://discord.com/api/oauth2/authorize?client_id={DISCORD_CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=identify"
            await ctx.send(f"✅ Transcription saved! View it here: {oauth_url}")
        else:
            await ctx.send("⚠️ Failed to save transcription to database.")
        
        # Create metadata file with recording information
        metadata = {
            'guild_name': ctx.guild.name,
            'guild_id': ctx.guild.id,
            'channel_name': ctx.voice_client.channel.name,
            'start_time': conn['start_time'].isoformat(),
            'end_time': datetime.now().isoformat(),
            'duration': str(datetime.now() - conn['start_time']),
            'file_path': str(filepath),
            'file_size': f"{file_size / 1024:.2f} KB",
            'user_id': ctx.author.id,
            'user_name': ctx.author.name
        }
        
        metadata_file = guild_dir / f"{timestamp}_{safe_guild_name}_metadata.txt"
        with open(metadata_file, 'w', encoding='utf-8') as f:
            # Write metadata
            for key, value in metadata.items():
                f.write(f"{key}: {value}\n")
            
            # Write transcription
            f.write(f"\n{transcription}\n")
        
        print(f"Saved audio to {filepath}")
        print(f"Saved metadata to {metadata_file}")
        
        # Return the file paths and transcription for potential further processing
        return filepath, metadata_file, transcription
        
    except Exception as e:
        print(f"Error in save_transcript: {e}")
        await ctx.send(f"❌ Error saving transcript: {str(e)}")
        return None

async def transcribe_audio(filepath):
    """Transcribe audio using Groq's Whisper model with detailed timestamps"""
    try:
        # Convert to absolute path
        absolute_path = os.path.abspath(filepath)
        print(f"Transcribing audio file: {absolute_path}")
        
        # Open the audio file
        with open(absolute_path, "rb") as file:
            # Create a transcription of the audio file
            transcription = groq_client.audio.transcriptions.create(
                file=(absolute_path, file.read()),
                model="whisper-large-v3-turbo",
                response_format="verbose_json"
            )
            
            # Convert the transcription to a formatted string
            formatted_transcript = "=== TRANSCRIPTION ===\n\n"
            
            # Add the full text if available
            if hasattr(transcription, 'text'):
                formatted_transcript += f"Full Text:\n{transcription.text}\n\n"
            
            # Add segments with timestamps if available
            if hasattr(transcription, 'segments'):
                formatted_transcript += "Segments:\n"
                for segment in transcription.segments:
                    if hasattr(segment, 'start') and hasattr(segment, 'end') and hasattr(segment, 'text'):
                        start_time = segment.start
                        end_time = segment.end
                        text = segment.text
                        formatted_transcript += f"[{start_time:.2f}s - {end_time:.2f}s] {text}\n"
            
            # Add word-level timestamps if available
            if hasattr(transcription, 'words'):
                formatted_transcript += "\nWord-level Timestamps:\n"
                for word in transcription.words:
                    if hasattr(word, 'start') and hasattr(word, 'end') and hasattr(word, 'text'):
                        start_time = word.start
                        end_time = word.end
                        text = word.text
                        formatted_transcript += f"[{start_time:.2f}s - {end_time:.2f}s] {text}\n"
            
            return formatted_transcript
            
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None

# Run the bot
bot.run(os.getenv('DISCORD_TOKEN')) 