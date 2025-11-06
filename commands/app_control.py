# commands/app_control.py
from core.system import open_app, close_app
from core.voice import speak_async

def handle(command):
    if "open" in command:
        app = command.split("open")[-1].strip()
        open_app(app)
        speak_async("assets/activate.mp3")
        return f"Opening {app}"
    if "close" in command:
        app = command.split("close")[-1].strip()
        close_app(app)
        speak_async("assets/deactivate.mp3")
        return f"Closed {app}"
    return None