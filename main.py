# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from core.voice import listen, speak
from commands import app_control, scan, nexamode, hologram
import asyncio
import json
import threading

app = FastAPI()

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
                await asyncio.sleep(1)
                await websocket.send_json({"status": "LISTENING..."})
                
                # Create a task to run voice processing
                async def run_voice_async():
                    try:
                        # Run blocking listen() in executor
                        loop = asyncio.get_event_loop()
                        cmd = await loop.run_in_executor(None, listen)
                        
                        if cmd:
                            await websocket.send_json({"status": f"HEARD: {cmd}"})
                            # Run blocking route_command in executor
                            result = await loop.run_in_executor(None, route_command, cmd)
                            await asyncio.sleep(1)
                            await websocket.send_json({"status": f"DONE: {result or 'Complete'}"})
                        else:
                            await websocket.send_json({"status": "NO VOICE DETECTED"})
                        
                        await asyncio.sleep(2)
                        await websocket.send_json({"status": "System Ready"})
                    except Exception as e:
                        print(f"Error in voice processing: {e}")
                        await websocket.send_json({"status": f"ERROR: {str(e)}"})
                
                # Start the async task
                asyncio.create_task(run_voice_async())
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