# backend/app/services/system_service.py
import os
import subprocess
import webbrowser
import pyautogui
import psutil
from typing import Dict, Any

class SystemService:
    @staticmethod
    def open_application(app_name: str) -> str:
        app_clean = app_name.lower().strip()
        apps_map = {
            "notepad": lambda: subprocess.Popen(["notepad"]),
            "browser": lambda: webbrowser.open("https://google.com"),
            "chrome": lambda: webbrowser.open("https://google.com"),
            "spotify": lambda: (
                os.startfile("spotify:") if os.name == "nt" else subprocess.run(["open", "-a", "Spotify"])
            ),
            "calculator": lambda: subprocess.Popen(["calc"]) if os.name == "nt" else None
        }

        if app_clean in apps_map and apps_map[app_clean]:
            try:
                apps_map[app_clean]()
                return f"Successfully opened {app_name}."
            except Exception as e:
                return f"Failed to open {app_name}: {str(e)}"
        
        # Generic launch fallback
        if os.name == "nt":
            try:
                subprocess.Popen([app_clean], shell=True)
                return f"Launched {app_name}."
            except Exception as e:
                return f"Could not launch application '{app_name}'. Exception: {str(e)}"
        return f"Opening '{app_name}' is not supported on this platform."

    @staticmethod
    def close_application(app_name: str) -> str:
        app_clean = app_name.lower().strip()
        kill_map = {
            "notepad": "notepad.exe",
            "browser": "chrome.exe",
            "chrome": "chrome.exe",
            "edge": "msedge.exe",
            "spotify": "Spotify.exe",
            "calculator": "CalculatorApp.exe"
        }
        proc_name = kill_map.get(app_clean, f"{app_clean}.exe")
        if os.name == "nt":
            res = os.system(f"taskkill /f /im {proc_name} >nul 2>&1")
            if res == 0:
                return f"Closed {app_name}."
            return f"Could not close {app_name}. Make sure it is currently running."
        return f"Closing applications is not supported on this platform."

    @staticmethod
    def set_volume(direction: str, steps: int = 3) -> str:
        if direction.lower() in ["up", "increase", "raise"]:
            pyautogui.press("volumeup", presses=steps)
            return f"Increased volume by {steps} steps."
        elif direction.lower() in ["down", "decrease", "lower"]:
            pyautogui.press("volumedown", presses=steps)
            return f"Decreased volume by {steps} steps."
        elif direction.lower() in ["mute", "toggle"]:
            pyautogui.press("volumemute")
            return "Toggled volume mute."
        return f"Unknown volume direction: {direction}"

    @staticmethod
    def take_screenshot(save_dir: str = "static") -> str:
        os.makedirs(save_dir, exist_ok=True)
        file_path = os.path.join(save_dir, "screenshot.png")
        img = pyautogui.screenshot()
        img.save(file_path)
        return file_path

    @staticmethod
    def get_system_stats() -> Dict[str, Any]:
        cpu_usage = psutil.cpu_percent(interval=0.5)
        memory = psutil.virtual_memory()
        battery = psutil.sensors_battery()
        
        battery_pct = battery.percent if battery else None
        is_plugged = battery.power_plugged if battery else None

        return {
            "cpu_usage_pct": cpu_usage,
            "memory_usage_pct": memory.percent,
            "memory_available_gb": round(memory.available / (1024 ** 3), 2),
            "battery_pct": battery_pct,
            "is_plugged": is_plugged
        }

system_service = SystemService()
