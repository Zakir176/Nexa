# backend/app/core/config.py
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "Nexa AI Assistant"
    DEBUG: bool = True
    
    # Vision & Camera
    CAMERA_ID: int = 0
    CONFIDENCE_FACE: float = 0.6
    CONFIDENCE_HAND: float = 0.7
    
    # Voice STT / TTS
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "base")
    RECORDING_DURATION: int = 5
    SAMPLE_RATE: int = 16000
    DEFAULT_TTS_VOICE: str = "en-US-ChristopherNeural"
    
    # LLM Settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    DEFAULT_LLM_MODEL: str = os.getenv("LLM_MODEL", "qwen2.5:latest")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    REPLICATE_API_TOKEN: Optional[str] = os.getenv("REPLICATE_API_TOKEN", None)
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
