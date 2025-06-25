# backend/app/tools/app_control.py
from backend.app.tools.registry import tool_registry
from backend.app.services.system_service import system_service

@tool_registry.register(
    name="open_application",
    description="Launch or open an application on the user's computer (e.g. notepad, browser, chrome, spotify, calculator).",
    parameters={
        "type": "object",
        "properties": {
            "app_name": {
                "type": "string",
                "description": "Name of the application to open."
            }
        },
        "required": ["app_name"]
    }
)
async def open_application_tool(app_name: str) -> str:
    return system_service.open_application(app_name)

@tool_registry.register(
    name="close_application",
    description="Close or terminate a running application on the user's computer.",
    parameters={
        "type": "object",
        "properties": {
            "app_name": {
                "type": "string",
                "description": "Name of the application to close."
            }
        },
        "required": ["app_name"]
    }
)
async def close_application_tool(app_name: str) -> str:
    return system_service.close_application(app_name)

@tool_registry.register(
    name="adjust_volume",
    description="Adjust the system audio volume (up, down, or mute).",
    parameters={
        "type": "object",
        "properties": {
            "direction": {
                "type": "string",
                "enum": ["up", "down", "mute"],
                "description": "Direction to adjust volume."
            },
            "steps": {
                "type": "integer",
                "description": "Number of volume adjustment steps (default: 3)."
            }
        },
        "required": ["direction"]
    }
)
async def adjust_volume_tool(direction: str, steps: int = 3) -> str:
    return system_service.set_volume(direction, steps)

@tool_registry.register(
    name="take_screenshot",
    description="Take a screenshot of the user's current screen and display it on the HUD.",
    parameters={
        "type": "object",
        "properties": {},
        "required": []
    }
)
async def take_screenshot_tool() -> str:
    path = system_service.take_screenshot()
    return f"Screenshot captured successfully and saved to static location ({path})."
