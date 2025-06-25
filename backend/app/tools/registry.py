# backend/app/tools/registry.py
from typing import Dict, Any, Callable, List, Optional
import inspect

class Tool:
    def __init__(self, name: str, description: str, handler: Callable, parameters: Optional[Dict[str, Any]] = None):
        self.name = name
        self.description = description
        self.handler = handler
        self.parameters = parameters or {
            "type": "object",
            "properties": {},
            "required": []
        }

    def to_openai_schema(self) -> Dict[str, Any]:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters
            }
        }

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, Tool] = {}

    def register(self, name: str, description: str, parameters: Optional[Dict[str, Any]] = None):
        def decorator(func: Callable):
            tool = Tool(name=name, description=description, handler=func, parameters=parameters)
            self._tools[name] = tool
            return func
        return decorator

    def get_tool(self, name: str) -> Optional[Tool]:
        return self._tools.get(name)

    def list_schemas(self) -> List[Dict[str, Any]]:
        return [tool.to_openai_schema() for tool in self._tools.values()]

    async def execute(self, name: str, **kwargs) -> Any:
        tool = self.get_tool(name)
        if not tool:
            raise ValueError(f"Tool '{name}' is not registered.")
        
        if inspect.iscoroutinefunction(tool.handler):
            return await tool.handler(**kwargs)
        else:
            return tool.handler(**kwargs)

tool_registry = ToolRegistry()
