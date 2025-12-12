# commands/scan.py
from core.vision import scan_environment
from core.voice import speak
import base64
import cv2
import asyncio

# Global WebSocket reference and event loop (set by main.py)
_websocket = None
_event_loop = None
_scan_active = False

def set_websocket(ws, loop=None):
    """Set the WebSocket connection and event loop for sending scan frames"""
    global _websocket, _event_loop
    _websocket = ws
    _event_loop = loop

def handle():
    """Handle scan command - sends frames via WebSocket if available"""
    global _scan_active
    _scan_active = True
    
    def update(frame):
        # If WebSocket is available, send frame as base64
        if _websocket and _scan_active and _event_loop:
            try:
                # Encode frame as JPEG
                _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
                frame_base64 = base64.b64encode(buffer).decode('utf-8')
                # Use run_coroutine_threadsafe to send from blocking thread
                asyncio.run_coroutine_threadsafe(
                    _websocket.send_json({
                        "type": "scan_frame",
                        "frame": frame_base64
                    }),
                    _event_loop
                )
            except Exception as e:
                print(f"Error sending scan frame: {e}")
    
    try:
        scan_environment(update)
    finally:
        _scan_active = False
        # Send scan complete message
        if _websocket and _event_loop:
            try:
                asyncio.run_coroutine_threadsafe(
                    _websocket.send_json({"type": "scan_complete"}),
                    _event_loop
                )
            except:
                pass
    
    speak("Scan complete")
    return "Scan complete"