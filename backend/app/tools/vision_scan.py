# backend/app/tools/vision_scan.py
from backend.app.tools.registry import tool_registry

@tool_registry.register(
    name="scan_environment",
    description="Scan the room or webcam environment to detect faces, hands, gestures, and objects in real-time.",
    parameters={
        "type": "object",
        "properties": {
            "duration": {
                "type": "integer",
                "description": "Duration in seconds to run vision scanning (default 15s)."
            }
        },
        "required": []
    }
)
async def scan_environment_tool(duration: int = 15) -> str:
    # Triggering scan is handled via WebSocket connection streaming in websocket.py
    return f"Environment scan initiated for {duration} seconds."
