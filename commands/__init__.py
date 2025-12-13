# commands/__init__.py
import importlib

def _safe_import_module(module_name):
    """Import the module itself, not just the handle function"""
    try:
        module = importlib.import_module(f".{module_name}", package="commands")
        return module
    except ImportError as e:
        print(f"[Nexa] Failed to import {module_name}: {e}")
        return None

# Import modules (not just handle functions) so we can access all their methods
app_control = _safe_import_module("app_control")
scan = _safe_import_module("scan")
nexamode = _safe_import_module("nexamode")
hologram = _safe_import_module("hologram")

# Fallback if missing
if not app_control:
    class _FallbackAppControl:
        def handle(self, cmd): return "App control not found—create commands/app_control.py"
    app_control = _FallbackAppControl()
    
if not scan:
    class _FallbackScan:
        def handle(self): return "Scan not found—create commands/scan.py"
        def set_websocket(self, ws, loop): pass
        def stop_scan(self): pass
    scan = _FallbackScan()
    
if not nexamode:
    class _FallbackNexamode:
        def handle(self, cmd): return "Utils not found—create commands/nexamode.py"
    nexamode = _FallbackNexamode()
    
if not hologram:
    class _FallbackHologram:
        def handle(self): return "Hologram not found—create commands/hologram.py"
    hologram = _FallbackHologram()