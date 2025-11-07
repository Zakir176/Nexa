# commands/app_control.py
from core.system import open_app, close_app, volume_up, volume_down
from core.voice import speak  # or speak_async if you prefer

def handle(command):
    if "open" in command:
        app = command.replace("open", "").strip()
        open_app(app)
        speak(f"Opening {app}")
        return f"Opened {app}"
    elif "close" in command:
        app = command.replace("close", "").strip()
        close_app(app)
        speak(f"Closing {app}")
        return f"Closed {app}"
    elif "volume up" in command:
        volume_up()
        speak("Volume up")
        return "Volume increased"
    elif "volume down" in command:
        volume_down()
        speak("Volume down")
        return "Volume decreased"
    return None