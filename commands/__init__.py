# commands/__init__.py
import importlib

def _safe_import(module_name):
    try:
        module = importlib.import_module(f".{module_name}", package="commands")
        return getattr(module, 'handle', None)
    except ImportError as e:
        print(f"[Nexa] Failed to import {module_name}: {e}")
        return None

# Import handlers
app_control = _safe_import("app_control")
scan = _safe_import("scan")
nexamode = _safe_import("nexamode")
hologram = _safe_import("hologram")

# Fallback if missing
if not app_control:
    def app_control(cmd): return "App control not found—create commands/app_control.py"
if not scan:
    def scan(): return "Scan not found—create commands/scan.py"
if not nexamode:
    def nexamode(cmd): return "Utils not found—create commands/nexamode.py"
if not hologram:
    def hologram(): return "Hologram not found—create commands/hologram.py"