# backend/app/api/websocket.py
import json
import asyncio
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.core.state import state_manager, SystemState
from backend.app.services.stt_service import stt_service
from backend.app.services.tts_service import tts_service
from backend.app.services.llm_service import llm_service
from backend.app.services.vision_service import vision_service
from backend.app.tools.registry import tool_registry

logger = logging.getLogger(__name__)

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info("Client connected to Nexa WebSocket.")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info("Client disconnected from Nexa WebSocket.")

    async def send_json(self, websocket: WebSocket, data: dict):
        try:
            await websocket.send_json(data)
        except Exception as e:
            logger.error(f"Failed to send JSON to websocket: {e}")

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    # State listener to push state updates to connected frontend
    async def state_listener(state: SystemState, message: str):
        await manager.send_json(websocket, {
            "type": "state_change",
            "state": state.value,
            "message": message
        })

    state_manager.add_listener(state_listener)

    try:
        # Send initial config data
        await manager.send_json(websocket, {
            "type": "config",
            "status": "System Ready",
            "available_tools": [t["function"]["name"] for t in tool_registry.list_schemas()]
        })

        while True:
            raw_data = await websocket.receive_text()
            try:
                msg = json.loads(raw_data) if raw_data.startswith("{") else {"action": raw_data}
            except Exception:
                msg = {"action": raw_data}

            action = msg.get("action")

            if action == "activate" or action == "listen":
                # Start voice recognition pipeline
                state_manager.set_state(SystemState.LISTENING, "Listening for voice input...")
                
                # Execute recording in thread pool
                loop = asyncio.get_event_loop()
                transcription = await loop.run_in_executor(None, stt_service.record_and_transcribe)

                if transcription:
                    state_manager.set_state(SystemState.PROCESSING, f"Heard: '{transcription}'")
                    await manager.send_json(websocket, {
                        "type": "transcription",
                        "text": transcription
                    })

                    # Process transcript through LLM / intent service
                    intent_res = await llm_service.process_user_intent(transcription)
                    speech_text = intent_res.get("response", "")
                    tool_calls = intent_res.get("tool_calls", [])

                    # Execute any requested tools
                    if tool_calls:
                        state_manager.set_state(SystemState.EXECUTING, "Executing system tool...")
                        for call in tool_calls:
                            tool_name = call.get("name")
                            args = call.get("args", {})
                            try:
                                tool_result = await tool_registry.execute(tool_name, **args)
                                await manager.send_json(websocket, {
                                    "type": "tool_result",
                                    "tool": tool_name,
                                    "result": str(tool_result)
                                })
                                speech_text += f" {tool_result}"
                            except Exception as te:
                                logger.error(f"Error executing tool '{tool_name}': {te}")

                    # Generate neural speech audio response
                    state_manager.set_state(SystemState.SPEAKING, "Speaking response...")
                    audio_b64 = await tts_service.generate_speech_audio_b64(speech_text)

                    await manager.send_json(websocket, {
                        "type": "response",
                        "text": speech_text,
                        "audio_b64": audio_b64
                    })

                    state_manager.set_state(SystemState.IDLE, "System Ready")
                else:
                    state_manager.set_state(SystemState.ERROR, "No voice input detected")
                    await asyncio.sleep(2)
                    state_manager.set_state(SystemState.IDLE, "System Ready")

            elif action == "start_scan" or action == "scan":
                state_manager.set_state(SystemState.EXECUTING, "Scanning environment...")
                
                def on_scan_frame(frame_b64: str, metadata: dict):
                    asyncio.run_coroutine_threadsafe(
                        manager.send_json(websocket, {
                            "type": "scan_frame",
                            "frame": frame_b64,
                            "metadata": metadata
                        }),
                        asyncio.get_event_loop()
                    )

                vision_service.start_scan(frame_callback=on_scan_frame, duration=30)

            elif action == "stop_scan":
                vision_service.stop_scan()
                state_manager.set_state(SystemState.IDLE, "Scan stopped. System Ready.")
                await manager.send_json(websocket, {"type": "scan_complete"})

            elif action == "text_command":
                user_text = msg.get("text", "")
                if user_text:
                    state_manager.set_state(SystemState.PROCESSING, f"Processing: '{user_text}'")
                    intent_res = await llm_service.process_user_intent(user_text)
                    speech_text = intent_res.get("response", "")
                    tool_calls = intent_res.get("tool_calls", [])

                    if tool_calls:
                        state_manager.set_state(SystemState.EXECUTING, "Executing system tool...")
                        for call in tool_calls:
                            tool_name = call.get("name")
                            args = call.get("args", {})
                            try:
                                tool_result = await tool_registry.execute(tool_name, **args)
                                await manager.send_json(websocket, {
                                    "type": "tool_result",
                                    "tool": tool_name,
                                    "result": str(tool_result)
                                })
                                speech_text += f" {tool_result}"
                            except Exception as te:
                                logger.error(f"Error executing tool '{tool_name}': {te}")

                    state_manager.set_state(SystemState.SPEAKING, "Speaking response...")
                    audio_b64 = await tts_service.generate_speech_audio_b64(speech_text)

                    await manager.send_json(websocket, {
                        "type": "response",
                        "text": speech_text,
                        "audio_b64": audio_b64
                    })

                    state_manager.set_state(SystemState.IDLE, "System Ready")

    except WebSocketDisconnect:
        state_manager.remove_listener(state_listener)
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket endpoint error: {e}", exc_info=True)
        state_manager.remove_listener(state_listener)
        manager.disconnect(websocket)
