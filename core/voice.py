# core/voice.py
import os
import threading
import numpy as np
import sounddevice as sd
import whisper  # OpenAI's Whisper
from typing import Optional

# Load Whisper model
model = whisper.load_model("tiny")  # or "base" for better accuracy

SAMPLE_RATE = 16000
DURATION = 5

def listen(timeout: Optional[int] = None) -> str:
    print("Listening... (speak now)")
    audio = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype=np.float32)
    sd.wait()
    audio = audio.flatten()
    try:
        result = model.transcribe(audio, language="en", fp16=False)
        text = result["text"].strip().lower()
        print(f"You said: '{text}'")
        return text
    except Exception as e:
        print(f"Whisper error: {e}")
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