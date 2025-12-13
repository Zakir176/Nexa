# config/settings.py
import os


class Config:
    REPLICATE_TOKEN = os.getenv("REPLICATE_API") or "YOUR_TOKEN_HERE"
    CAMERA_ID = 0
    CONFIDENCE_FACE = 0.6
    CONFIDENCE_HAND = 0.7
    # Whisper model size: "tiny" (fastest), "base" (balanced), "small" (more accurate), "medium", "large" (most accurate)
    WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")  # Change to "small" for better accuracy if you have more RAM
    # Whisper model size: "tiny" (fastest), "base" (balanced), "small" (more accurate), "medium", "large" (most accurate)
    WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")  # Change to "small" for better accuracy if you have more RAM
