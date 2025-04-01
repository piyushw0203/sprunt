import discord
from discord.ext import commands
import speech_recognition as sr
import asyncio
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import json
from datetime import datetime
import wave
import io
import numpy as np
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Initialize Discord bot
intents = discord.Intents.default()
intents.message_content = True
intents.voice_states = True
bot = commands.Bot(command_prefix='!', intents=intents)

# Voice state storage
voice_states = {}

class VoiceState:
    def __init__(self):
        self.recording = False
        self.audio_data = []
        self.start_time = None
        self.transcript = ""
        self.tasks = []
        self.summary = ""
        self.recognizer = sr.Recognizer()
        self.audio_queue = asyncio.Queue()

    async def process_audio(self):
        while self.recording:
            try:
                audio_data = await self.audio_queue.get()
                # Convert audio data to WAV format
                wav_data = self.convert_to_wav(audio_data)
                
                # Use speech recognition to get text
                with sr.AudioFile(wav_data) as source:
                    audio = self.recognizer.record(source)
                    try:
                        text = self.recognizer.recognize_google(audio)
                        self.transcript += text + " "
                    except sr.UnknownValueError:
                        print("Could not understand audio")
                    except sr.RequestError as e:
                        print(f"Could not request results; {e}")
            except Exception as e:
                print(f"Error processing audio: {e}")

    def convert_to_wav(self, audio_data):
        # Convert raw audio data to WAV format
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(1)  # Mono
            wav_file.setsampwidth(2)  # 16-bit
            wav_file.setframerate(48000)  # Discord's sample rate
            wav_file.writeframes(audio_data)
        wav_buffer.seek(0)
        return wav_buffer

    async def process_with_ai(self):
        # Use Groq to analyze the transcript
        prompt = f"""
        Analyze the following conversation transcript and:
        1. Extract key tasks and action items
        2. Provide a concise summary
        
        Transcript: {self.transcript}
        
        Format the response as JSON with the following structure:
        {{
            "tasks": ["task1", "task2", ...],
            "summary": "brief summary"
        }}
        """
        
        try:
            completion = groq_client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that analyzes conversations and extracts tasks and summaries."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            response = json.loads(completion.choices[0].message.content)
            self.tasks = response["tasks"]
            self.summary = response["summary"]
        except Exception as e:
            print(f"Error processing with AI: {e}")
            self.tasks = ["Error processing tasks"]
            self.summary = "Error generating summary"

@bot.event
async def on_ready():
    print(f'Bot is ready! Logged in as {bot.user.name}')

@bot.command(name='join')
async def join(ctx):
    """Join the user's voice channel"""
    if ctx.author.voice:
        channel = ctx.author.voice.channel
        await channel.connect()
        await ctx.send(f'Joined {channel.name}')
    else:
        await ctx.send('You need to be in a voice channel first!')

@bot.command(name='record')
async def record(ctx):
    """Start recording the voice channel"""
    if not ctx.voice_client:
        await ctx.send('I need to be in a voice channel first!')
        return
    
    voice_state = VoiceState()
    voice_state.recording = True
    voice_state.start_time = datetime.now()
    voice_states[ctx.guild.id] = voice_state
    
    # Start audio processing task
    asyncio.create_task(voice_state.process_audio())
    
    await ctx.send('Started recording! Use !stop to stop recording.')

@bot.event
async def on_voice_state_update(member, before, after):
    """Handle voice state updates to capture audio"""
    if member.bot:
        return
        
    for guild_id, voice_state in voice_states.items():
        if voice_state.recording and after.channel:
            # Get the audio data from the voice channel
            if after.channel.guild.voice_client:
                audio_data = after.channel.guild.voice_client.source.read()
                await voice_state.audio_queue.put(audio_data)

@bot.command(name='stop')
async def stop(ctx):
    """Stop recording and process the audio"""
    if not ctx.voice_client or ctx.guild.id not in voice_states:
        await ctx.send('No active recording session!')
        return
    
    voice_state = voice_states[ctx.guild.id]
    voice_state.recording = False
    
    # Wait for audio processing to complete
    await asyncio.sleep(1)
    
    # Process with AI
    await voice_state.process_with_ai()
    
    # Store in Supabase
    try:
        data = {
            "guild_id": str(ctx.guild.id),
            "channel_id": str(ctx.channel.id),
            "transcript": voice_state.transcript,
            "tasks": json.dumps(voice_state.tasks),
            "summary": voice_state.summary,
            "created_at": datetime.now().isoformat()
        }
        
        result = supabase.table('voice_sessions').insert(data).execute()
        await ctx.send('Recording stopped and saved to database!')
        
        # Send a formatted message with the results
        embed = discord.Embed(title="Voice Session Results", color=discord.Color.blue())
        embed.add_field(name="Summary", value=voice_state.summary, inline=False)
        embed.add_field(name="Tasks", value="\n".join(voice_state.tasks), inline=False)
        await ctx.send(embed=embed)
        
    except Exception as e:
        await ctx.send(f'Error saving to database: {str(e)}')
    
    # Clean up
    del voice_states[ctx.guild.id]

@bot.command(name='leave')
async def leave(ctx):
    """Leave the voice channel"""
    if ctx.voice_client:
        await ctx.voice_client.disconnect()
        await ctx.send('Left the voice channel')
    else:
        await ctx.send('I am not in a voice channel!')

# Run the bot
bot.run(os.getenv("DISCORD_BOT_TOKEN")) 