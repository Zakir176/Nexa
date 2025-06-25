# backend/app/core/event_bus.py
import asyncio
from typing import Callable, Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class EventBus:
    """Async event bus for decouple messaging across Nexa modules."""
    def __init__(self):
        self._subscribers: Dict[str, List[Callable[..., Any]]] = {}

    def subscribe(self, event_type: str, callback: Callable[..., Any]):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        if callback not in self._subscribers[event_type]:
            self._subscribers[event_type].append(callback)

    def unsubscribe(self, event_type: str, callback: Callable[..., Any]):
        if event_type in self._subscribers and callback in self._subscribers[event_type]:
            self._subscribers[event_type].remove(callback)

    async def publish(self, event_type: str, **kwargs):
        if event_type not in self._subscribers:
            return
        
        for callback in self._subscribers[event_type]:
            try:
                if asyncio.iscoroutinefunction(callback):
                    await callback(**kwargs)
                else:
                    callback(**kwargs)
            except Exception as e:
                logger.error(f"Error handling event {event_type}: {e}", exc_info=True)

event_bus = EventBus()
