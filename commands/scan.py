# commands/scan.py
from core.vision import scan_environment
from core.voice import speak
import base64
import cv2
import asyncio
import threading

# Global WebSocket reference and event loop (set by main.py)
_websocket = None
_event_loop = None
_scan_active = False
_stop_flag = None

def set_websocket(ws, loop=None):
    """Set the WebSocket connection and event loop for sending scan frames"""
    global _websocket, _event_loop
    _websocket = ws
    _event_loop = loop

def stop_scan():
    """Stop the current scan operation"""
    global _stop_flag
    if _stop_flag:
        _stop_flag.set()

def handle():
    """Handle scan command - sends frames via WebSocket if available"""
    global _scan_active, _stop_flag
    _scan_active = True
    _stop_flag = threading.Event()
    
    def update(frame):
        # If WebSocket is available, send frame as base64
        if _websocket and _scan_active and _event_loop and not _stop_flag.is_set():
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
        scan_environment(update, duration=30, stop_flag=_stop_flag)
    except Exception as e:
        error_msg = f"Scan failed: {str(e)}"
        print(error_msg)
        if _websocket and _event_loop:
            try:
                asyncio.run_coroutine_threadsafe(
                    _websocket.send_json({"status": error_msg}),
                    _event_loop
                )
            except:
                pass
        return error_msg
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