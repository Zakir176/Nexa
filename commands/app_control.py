from core.system import open_app, close_app, volume_up, volume_down, screenshot as take_screenshot
from core.voice import speak
import asyncio

def clean_app_name(command, prefix):
    app = command.replace(prefix, "").strip()
    app = app.strip(".,?!")
    words = app.split()
    fillers = {"please", "now", "app", "application", "the", "program", "for", "me", "open", "close"}
    cleaned = [w for w in words if w not in fillers]
    return " ".join(cleaned)

def handle(command, websocket=None, loop=None):
    if "screenshot" in command or "screen shot" in command:
        path = take_screenshot()
        speak("Screenshot captured")
        if websocket and loop:
            asyncio.run_coroutine_threadsafe(
                websocket.send_json({
                    "type": "screenshot",
                    "path": "/static/screenshot.png"
                }),
                loop
            )
        return "Screenshot captured"
        
    elif "open" in command:
        app = clean_app_name(command, "open")
        if not app:
            speak("Which application would you like me to open?")
            return "Application name not specified"
            
        success = open_app(app)
        if success:
            speak(f"Opening {app}")
            return f"Opened {app}"
        else:
            speak(f"I couldn't open {app}. Please check if it is installed.")
            return f"Failed to open {app}"
            
    elif "close" in command:
        app = clean_app_name(command, "close")
        if not app:
            speak("Which application would you like me to close?")
            return "Application name not specified"
            
        success = close_app(app)
        if success:
            speak(f"Closing {app}")
            return f"Closed {app}"
        else:
            speak(f"I couldn't close {app}. Make sure it is currently running.")
            return f"Failed to close {app}"
            
    elif "volume up" in command or "increase volume" in command or "raise volume" in command:
        volume_up()
        speak("Volume up")
        return "Volume increased"
        
    elif "volume down" in command or "decrease volume" in command or "lower volume" in command:
        volume_down()
        speak("Volume down")
        return "Volume decreased"
        
    return None