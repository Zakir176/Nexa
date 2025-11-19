# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn
from core.voice import listen, speak
from commands import app_control, scan, nexamode, hologram
import time
import json
import threading

app = FastAPI()

# Serve static files (index.html, style.css, script.js)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    with open("static/index.html") as f:
        return HTMLResponse(f.read())

# WebSocket for real-time communication (voice, status updates)
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            if data == "activate":
                await websocket.send_json({"status": "INITIALIZING..."})
                time.sleep(1)
                await websocket.send_json({"status": "LISTENING..."})
                
                def run_voice():
                    cmd = listen()
                    if cmd:
                        result = route_command(cmd)
                        websocket.send_json({"status": f"HEARD: {cmd}"})
                        time.sleep(1)
                        websocket.send_json({"status": f"DONE: {result or 'Complete'}"})
                    else:
                        websocket.send_json({"status": "NO VOICE DETECTED"})
                    time.sleep(2)
                    websocket.send_json({"status": "System Ready"})
                
                threading.Thread(target=run_voice, daemon=True).start()
    except WebSocketDisconnect:
        print("WebSocket disconnected")

def route_command(cmd: str):
    cmd = cmd.lower()
    if "open" in cmd or "close" in cmd or "volume" in cmd:
        return app_control.handle(cmd)
    if "scan" in cmd:
        return scan.handle()
    if "hologram" in cmd:
        return hologram.handle()
    return nexamode.handle(cmd)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)