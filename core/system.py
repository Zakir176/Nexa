# core/system.py
import pyautogui
import subprocess
import os
import webbrowser


def open_app(app_name):
    apps = {
        "notepad": lambda: subprocess.Popen(["notepad"]),
        "browser": lambda: webbrowser.open("https://google.com"),
        "chrome": lambda: webbrowser.open("https://google.com"),
        "spotify": lambda: (
            os.startfile("spotify:")
            if os.name == "nt"
            else subprocess.run(["open", "-a", "Spotify"])
        ),
    }
    action = apps.get(app_name)
    if action:
        try:
            action()
            return True
        except:
            return False
    else:
        # Try generic execution
        if os.name == "nt":
            try:
                subprocess.Popen([app_name], shell=True)
                return True
            except:
                return False
        return False


def close_app(app_name):
    kill = {
        "notepad": "notepad.exe",
        "browser": "chrome.exe",
        "chrome": "chrome.exe",
        "edge": "msedge.exe",
        "spotify": "Spotify.exe"
    }
    proc_name = kill.get(app_name, f"{app_name}.exe")
    cmd = f"taskkill /f /im {proc_name} >nul 2>&1"
    res = os.system(cmd)
    return res == 0


def volume_up():
    pyautogui.press("volumeup", presses=3)


def volume_down():
    pyautogui.press("volumedown", presses=3)


def screenshot():
    import time
    # Save inside static folder if we want to display it on UI, or in root
    # Putting it in static/screenshot.png makes it easy to load in the browser!
    os.makedirs("static", exist_ok=True)
    path = os.path.join("static", "screenshot.png")
    
    # Hide window or wait a tiny bit if needed, then take screenshot
    img = pyautogui.screenshot()
    img.save(path)
    return path

