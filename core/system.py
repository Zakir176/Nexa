# core/system.py
import pyautogui
import subprocess
import os
import webbrowser

def open_app(app_name):
    apps = {
        "notepad": lambda: subprocess.Popen(["notepad"]),
        "browser": lambda: webbrowser.open("https://google.com"),
        "spotify": lambda: os.startfile("spotify:") if os.name == "nt" else subprocess.run(["open", "-a", "Spotify"])
    }
    apps.get(app_name, lambda: None)()

def close_app(app_name):
    kill = {"notepad": "notepad.exe", "browser": "chrome.exe"}
    cmd = f"taskkill /f /im {kill.get(app_name, '')}"
    os.system(cmd)

def volume_up(): pyautogui.press("volumeup", presses=3)
def volume_down(): pyautogui.press("volumedown", presses=3)
def screenshot():
    img = pyautogui.screenshot()
    path = "Nexa_screenshot.png"
    img.save(path)
    return path