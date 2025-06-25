# backend/app/tools/__init__.py
from backend.app.tools.registry import tool_registry
import backend.app.tools.app_control
import backend.app.tools.vision_scan
import backend.app.tools.weather
import backend.app.tools.system_info

__all__ = ["tool_registry"]
