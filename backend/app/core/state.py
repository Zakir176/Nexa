# backend/app/core/state.py
from enum import Enum
from typing import Callable, List, Optional
import asyncio

class SystemState(str, Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    PROCESSING = "PROCESSING"
    EXECUTING = "EXECUTING"
    SPEAKING = "SPEAKING"
    ERROR = "ERROR"

class StateManager:
    """Centralized thread-safe system state manager with listener callbacks."""
    def __init__(self):
        self._state: SystemState = SystemState.IDLE
        self._message: str = "System Ready"
        self._listeners: List[Callable[[SystemState, str], None]] = []

    @property
    def current_state(self) -> SystemState:
        return self._state

    @property
    def current_message(self) -> str:
        return self._message

    def add_listener(self, callback: Callable[[SystemState, str], None]):
        if callback not in self._listeners:
            self._listeners.append(callback)

    def remove_listener(self, callback: Callable[[SystemState, str], None]):
        if callback in self._listeners:
            self._listeners.remove(callback)

    def set_state(self, state: SystemState, message: Optional[str] = None):
        self._state = state
        if message is not None:
            self._message = message
        elif state == SystemState.IDLE:
            self._message = "System Ready"
        elif state == SystemState.LISTENING:
            self._message = "Listening..."
        elif state == SystemState.PROCESSING:
            self._message = "Processing input..."
        elif state == SystemState.EXECUTING:
            self._message = "Executing command..."
        elif state == SystemState.SPEAKING:
            self._message = "Speaking response..."
        
        for listener in self._listeners:
            try:
                if asyncio.iscoroutinefunction(listener):
                    asyncio.create_task(listener(self._state, self._message))
                else:
                    listener(self._state, self._message)
            except Exception as e:
                print(f"[StateManager] Error invoking state listener: {e}")

state_manager = StateManager()
