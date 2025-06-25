# backend/app/services/tts_service.py
import asyncio
import base64
import io
import logging
from typing import Optional
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class TTSService:
    def __init__(self):
        self._default_voice = settings.DEFAULT_TTS_VOICE

    async def generate_speech_audio_b64(self, text: str, voice: Optional[str] = None) -> Optional[str]:
        if not text or not text.strip():
            return None

        target_voice = voice or self._default_voice
        try:
            import edge_tts
            logger.info(f"Generating Edge-TTS neural speech for: '{text}' ({target_voice})")
            communicate = edge_tts.Communicate(text, target_voice)
            audio_stream = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_stream.write(chunk["data"])
            
            audio_bytes = audio_stream.getvalue()
            if audio_bytes:
                b64_data = base64.b64encode(audio_bytes).decode('utf-8')
                return b64_data
        except ImportError:
            logger.warning("edge-tts package not found. Install edge-tts for neural speech.")
        except Exception as e:
            logger.error(f"Edge-TTS generation failed: {e}")

        return None

    def speak_local_fallback(self, text: str):
        try:
            import pyttsx3
            engine = pyttsx3.init()
            engine.say(text)
            engine.runAndWait()
        except Exception as e:
            logger.error(f"Local pyttsx3 fallback failed: {e}")

tts_service = TTSService()
