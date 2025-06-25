# backend/app/tools/system_info.py
from backend.app.tools.registry import tool_registry
from backend.app.services.system_service import system_service

@tool_registry.register(
    name="get_system_status",
    description="Check current computer hardware metrics including CPU usage, available RAM, and battery level.",
    parameters={
        "type": "object",
        "properties": {},
        "required": []
    }
)
async def get_system_status_tool() -> str:
    stats = system_service.get_system_stats()
    res = f"System Stats: CPU Usage is {stats['cpu_usage_pct']}%, Memory Usage is {stats['memory_usage_pct']}% ({stats['memory_available_gb']} GB RAM available)."
    if stats['battery_pct'] is not None:
        charging_str = "Plugged in" if stats['is_plugged'] else "Discharging"
        res += f" Battery level is {stats['battery_pct']}% ({charging_str})."
    return res
