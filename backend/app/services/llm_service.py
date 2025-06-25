# backend/app/services/llm_service.py
import json
import logging
import httpx
from typing import Dict, Any, List, Optional
from backend.app.core.config import settings
from backend.app.tools.registry import tool_registry

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Nexa, an advanced sci-fi AI assistant running locally on the user's system.
You are smart, concise, and helpful (think Siri meets JARVIS).
When the user asks you to perform system actions, check weather, open applications, adjust volume, or scan the environment, ALWAYS invoke the appropriate tool function.
Keep your conversational responses clear and suitable for text-to-speech output (avoid overly long Markdown formatting or complex ASCII characters)."""

class LLMService:
    def __init__(self):
        self.ollama_url = settings.OLLAMA_BASE_URL
        self.model = settings.DEFAULT_LLM_MODEL
        self.gemini_key = settings.GEMINI_API_KEY

    async def process_user_intent(self, user_text: str) -> Dict[str, Any]:
        """
        Process user spoken text.
        Returns dict containing:
        - "response": conversational spoken response string
        - "tool_calls": optional list of tools to execute [{"name": ..., "args": ...}]
        """
        user_text = user_text.strip()
        if not user_text:
            return {"response": "I didn't hear anything.", "tool_calls": []}

        # 1. Try Ollama local endpoint if available
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                tools_schema = tool_registry.list_schemas()
                payload = {
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_text}
                    ],
                    "tools": tools_schema,
                    "stream": False
                }
                
                resp = await client.post(f"{self.ollama_url}/api/chat", json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    msg = data.get("message", {})
                    content = msg.get("content", "")
                    tool_calls = msg.get("tool_calls", [])
                    
                    parsed_calls = []
                    for call in tool_calls:
                        fn = call.get("function", {})
                        parsed_calls.append({
                            "name": fn.get("name"),
                            "args": fn.get("arguments", {})
                        })
                    
                    return {
                        "response": content or "Processing your command.",
                        "tool_calls": parsed_calls
                    }
        except Exception as e:
            logger.info(f"Ollama local LLM unavailable or failed: {e}. Falling back to Rule/Tool router.")

        # 2. Rule-based / Keyword fallback router if LLM is offline
        clean_text = user_text.lower()
        
        if "weather" in clean_text:
            # extract city keyword
            words = clean_text.split()
            city = "London"
            if "in" in words:
                idx = words.index("in")
                if idx + 1 < len(words):
                    city = words[idx + 1]
            elif "for" in words:
                idx = words.index("for")
                if idx + 1 < len(words):
                    city = words[idx + 1]
            return {
                "response": f"Checking weather for {city}.",
                "tool_calls": [{"name": "get_weather", "args": {"city": city}}]
            }
            
        elif "scan" in clean_text:
            return {
                "response": "Initializing environment scan...",
                "tool_calls": [{"name": "scan_environment", "args": {"duration": 15}}]
            }
            
        elif "screenshot" in clean_text or "screen shot" in clean_text:
            return {
                "response": "Taking screenshot...",
                "tool_calls": [{"name": "take_screenshot", "args": {}}]
            }
            
        elif "open" in clean_text:
            app_name = clean_text.replace("open", "").replace("please", "").strip()
            return {
                "response": f"Opening {app_name}...",
                "tool_calls": [{"name": "open_application", "args": {"app_name": app_name}}]
            }
            
        elif "close" in clean_text:
            app_name = clean_text.replace("close", "").replace("please", "").strip()
            return {
                "response": f"Closing {app_name}...",
                "tool_calls": [{"name": "close_application", "args": {"app_name": app_name}}]
            }
            
        elif "volume up" in clean_text or "increase volume" in clean_text:
            return {
                "response": "Increasing volume.",
                "tool_calls": [{"name": "adjust_volume", "args": {"direction": "up", "steps": 3}}]
            }
            
        elif "volume down" in clean_text or "lower volume" in clean_text:
            return {
                "response": "Lowering volume.",
                "tool_calls": [{"name": "adjust_volume", "args": {"direction": "down", "steps": 3}}]
            }
            
        elif "status" in clean_text or "system" in clean_text or "battery" in clean_text or "cpu" in clean_text:
            return {
                "response": "Fetching system status metrics.",
                "tool_calls": [{"name": "get_system_status", "args": {}}]
            }

        # Default conversational response
        return {
            "response": f"I heard: '{user_text}'. All systems operational.",
            "tool_calls": []
        }

llm_service = LLMService()
