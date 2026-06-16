# commands/suit_up.py
import cv2
import os
import asyncio
from core.ai import generate_iron_man_face
from core.voice import speak, play_sound
from config.settings import Config

_websocket = None
_event_loop = None

def set_websocket(ws, loop=None):
    global _websocket, _event_loop
    _websocket = ws
    _event_loop = loop

def handle():
    play_sound("assets/activate.wav")
    speak("Suiting up. Accessing camera system.")
    
    if _websocket and _event_loop:
        asyncio.run_coroutine_threadsafe(
            _websocket.send_json({"status": "CAMERA ACTIVE. CAPTURING..."}),
            _event_loop
        )
        
    cap = cv2.VideoCapture(Config.CAMERA_ID)
    ret, frame = cap.read()
    cap.release()
    
    if not ret:
        speak("Camera failed to initialize.")
        if _websocket and _event_loop:
            asyncio.run_coroutine_threadsafe(
                _websocket.send_json({"status": "CAMERA ERROR", "type": "error"}),
                _event_loop
            )
        return "Camera error"
        
    # Save captured frame
    temp_path = "temp_selfie.jpg"
    cv2.imwrite(temp_path, frame)
    
    if _websocket and _event_loop:
        asyncio.run_coroutine_threadsafe(
            _websocket.send_json({"status": "GENERATING HUD OVERLAY..."}),
            _event_loop
        )
        
    speak("Stark systems active. Calibrating HUD.")
    result = generate_iron_man_face(temp_path)
    
    # Clean up temp file
    if os.path.exists(temp_path):
        try:
            os.remove(temp_path)
        except:
            pass
            
    if _websocket and _event_loop:
        asyncio.run_coroutine_threadsafe(
            _websocket.send_json({
                "type": "suit_up_result",
                "image_url": result
            }),
            _event_loop
        )
        
    speak("Suit up complete. Systems online.")
    return "Iron Man mode activated"
