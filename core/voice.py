# core/voice.py
import os
import threading
import numpy as np
import sounddevice as sd
import whisper  # OpenAI's Whisper
from typing import Optional
from difflib import SequenceMatcher

# Command dictionary for fuzzy matching
COMMAND_WORDS = {
    # System commands
    "open": ["open", "launch", "start"],
    "close": ["close", "exit", "quit", "stop"],
    "volume": ["volume", "sound", "audio"],
    "up": ["up", "increase", "raise", "higher"],
    "down": ["down", "decrease", "lower", "reduce"],
    
    # Environment commands
    "scan": ["scan", "scun", "scam", "scann", "scanning"],
    "hologram": ["hologram", "hologramm", "hologra", "holo"],
    
    # Utility commands
    "weather": ["weather", "wether", "whether", "climate"],
    "joke": ["joke", "jokes", "funny", "humor"],
    "calculate": ["calculate", "calc", "math", "compute"],
    "math": ["math", "mathematics", "calculate"]
}

# Load Whisper model - using "base" for better accuracy (can upgrade to "small" for even better)
# Options: tiny (fastest, least accurate), base (balanced), small (slower, more accurate)
_model = None

def _get_model():
    """Lazy load Whisper model"""
    global _model
    if _model is None:
        # Try to load from config, default to "base"
        try:
            from config.settings import Config
            model_size = getattr(Config, 'WHISPER_MODEL', 'base')
        except:
            model_size = 'base'
        
        print(f"Loading Whisper model: {model_size} (this may take a moment on first run)...")
        _model = whisper.load_model(model_size)
        print(f"✓ Whisper model loaded: {model_size}")
    return _model

SAMPLE_RATE = 16000
DURATION = 5

def _similarity(a: str, b: str) -> float:
    """Calculate similarity between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def _fuzzy_match_command(text: str) -> str:
    """Use fuzzy matching to correct common misrecognitions"""
    text = text.strip().lower()
    
    # Direct match first
    for correct_word, variations in COMMAND_WORDS.items():
        if correct_word in text or any(var in text for var in variations):
            # Replace variations with correct word
            for var in variations:
                if var in text:
                    text = text.replace(var, correct_word)
            break
    
    # Fuzzy match individual words
    words = text.split()
    corrected_words = []
    
    for word in words:
        best_match = word
        best_similarity = 0.7  # Threshold
        
        for correct_word, variations in COMMAND_WORDS.items():
            # Check against correct word
            sim = _similarity(word, correct_word)
            if sim > best_similarity:
                best_similarity = sim
                best_match = correct_word
            
            # Check against variations
            for var in variations:
                sim = _similarity(word, var)
                if sim > best_similarity:
                    best_similarity = sim
                    best_match = correct_word
        
        corrected_words.append(best_match)
    
    corrected = " ".join(corrected_words)
    
    # Log correction if changed
    if corrected != text:
        print(f"Corrected: '{text}' -> '{corrected}'")
    
    return corrected

def listen(timeout: Optional[int] = None) -> str:
    """Listen for voice input and return transcribed text"""
    print("Listening... (speak now)")
    
    try:
        # Record audio
        audio = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype=np.float32)
        sd.wait()
        audio = audio.flatten()
        
        # Normalize audio
        if np.max(np.abs(audio)) > 0:
            audio = audio / np.max(np.abs(audio))
        
        # Get model and transcribe
        model = _get_model()
        result = model.transcribe(
            audio, 
            language="en", 
            fp16=False,
            task="transcribe",
            # Add prompt to help with command recognition
            initial_prompt="This is a voice command system. Common commands include: scan, open, close, volume, weather, joke, calculate, hologram."
        )
        
        text = result["text"].strip().lower()
        print(f"Raw transcription: '{text}'")
        
        # Apply fuzzy matching to correct common errors
        corrected_text = _fuzzy_match_command(text)
        print(f"Final command: '{corrected_text}'")
        
        return corrected_text
        
    except Exception as e:
        print(f"Whisper error: {e}")
        import traceback
        traceback.print_exc()
        return ""

# === TTS ===
try:
    import pyttsx3
    engine = pyttsx3.init()
    _tts_available = True
except ImportError:
    _tts_available = False
    print("TTS not available — pip install pyttsx3")

def speak(text: str):
    if not _tts_available:
        print(f"Nexa: {text}")
        return
    engine.say(text)
    engine.runAndWait()

def speak_async(text: str):
    """Async version of speak (runs in thread)"""
    if not _tts_available:
        print(f"Nexa: {text}")
        return
    def _speak():
        engine.say(text)
        engine.runAndWait()
    threading.Thread(target=_speak, daemon=True).start()

# === Sound Effects ===
def play_sound(file_path: str):
    if os.path.exists(file_path):
        cmd = f'start "" "{file_path}"' if os.name == "nt" else f"afplay '{file_path}'"
        threading.Thread(target=os.system, args=(cmd,), daemon=True).start()