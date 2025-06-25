# backend/app/services/stt_service.py
import numpy as np
import logging
from typing import Optional
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class STTService:
    def __init__(self):
        self._model = None
        self._engine_type = None

    def _load_model(self):
        if self._model is not None:
            return

        # Attempt to load faster-whisper first for 4x performance gain
        try:
            from faster_whisper import WhisperModel
            logger.info(f"Loading faster-whisper model '{settings.WHISPER_MODEL}'...")
            self._model = WhisperModel(settings.WHISPER_MODEL, device="cpu", compute_type="int8")
            self._engine_type = "faster_whisper"
            logger.info("✓ faster-whisper model loaded successfully.")
            return
        except ImportError:
            logger.info("faster-whisper not installed; falling back to standard openai-whisper.")

        # Fallback to standard OpenAI whisper
        try:
            import whisper
            logger.info(f"Loading OpenAI Whisper model '{settings.WHISPER_MODEL}'...")
            self._model = whisper.load_model(settings.WHISPER_MODEL)
            self._engine_type = "openai_whisper"
            logger.info("✓ OpenAI Whisper model loaded successfully.")
            return
        except Exception as e:
            logger.error(f"Failed to load Whisper models: {e}")
            raise RuntimeError("No STT engine available. Install whisper or faster-whisper.")

    def transcribe_audio_bytes(self, audio_data: np.ndarray) -> str:
        self._load_model()
        if audio_data is None or len(audio_data) == 0:
            return ""

        # Normalize audio array
        audio_data = audio_data.astype(np.float32)
        max_val = np.max(np.abs(audio_data))
        if max_val > 0:
            audio_data = audio_data / max_val

        try:
            if self._engine_type == "faster_whisper":
                segments, _ = self._model.transcribe(
                    audio_data, 
                    language="en", 
                    beam_size=5,
                    initial_prompt="This is a voice command system. Common commands: scan, open, close, volume, weather, status."
                )
                text = " ".join([segment.text for segment in segments]).strip()
            else:
                result = self._model.transcribe(
                    audio_data, 
                    language="en", 
                    fp16=False,
                    initial_prompt="This is a voice command system."
                )
                text = result["text"].strip()
            
            logger.info(f"STT Transcribed: '{text}'")
            return text
        except Exception as e:
            logger.error(f"STT transcription error: {e}", exc_info=True)
            return ""

    def record_and_transcribe(self, duration: Optional[int] = None) -> str:
        dur = duration or settings.RECORDING_DURATION
        sample_rate = settings.SAMPLE_RATE
        logger.info(f"Listening for {dur} seconds...")
        
        try:
            import sounddevice as sd
            recording = sd.rec(int(dur * sample_rate), samplerate=sample_rate, channels=1, dtype=np.float32)
            sd.wait()
            audio_flat = recording.flatten()
            return self.transcribe_audio_bytes(audio_flat)
        except Exception as e:
            logger.error(f"Audio recording failed: {e}")
            return ""

stt_service = STTService()
