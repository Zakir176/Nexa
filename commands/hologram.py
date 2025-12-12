# commands/hologram.py
import time
from core.voice import speak


def handle():
    # Hologram activation is handled via WebSocket message in main.py
    # This function just provides voice feedback
    speak("Hologram projected")
    return "Hologram activated"