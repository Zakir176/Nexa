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

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Nexa AI Assistant"}

# WebSocket for real-time communication (voice, status updates)
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            if data == "stop_scan":
                # Stop current scan operation
                scan.stop_scan()
                await websocket.send_json({"status": "Scan stopped"})
            elif data == "activate":
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
                            try:
                                # Send hologram activation if needed
                                if "hologram" in cmd.lower():
                                    await websocket.send_json({"type": "hologram", "active": True})
                                # Set websocket and event loop for scan command
                                if "scan" in cmd.lower():
                                    scan.set_websocket(websocket, loop)
                                # Run blocking route_command in executor with websocket context
                                result = await loop.run_in_executor(None, route_command, cmd, websocket)
                                await asyncio.sleep(1)
                                await websocket.send_json({"status": f"DONE: {result or 'Complete'}"})
                                # Deactivate hologram after command completes
                                if "hologram" in cmd.lower():
                                    await asyncio.sleep(2)
                                    await websocket.send_json({"type": "hologram", "active": False})
                            except Exception as e:
                                error_msg = f"Command execution failed: {str(e)}"
                                print(error_msg)
                                import traceback
                                traceback.print_exc()
                                await websocket.send_json({"status": error_msg, "type": "error"})
                        else:
                            await websocket.send_json({"status": "NO VOICE DETECTED"})
                        
                        await asyncio.sleep(2)
                        await websocket.send_json({"status": "System Ready"})
                    except Exception as e:
                        error_msg = f"ERROR: {str(e)}"
                        print(f"Error in voice processing: {e}")
                        import traceback
                        traceback.print_exc()
                        await websocket.send_json({"status": error_msg, "type": "error"})
                
                # Start the async task
                asyncio.create_task(run_voice_async())
    except WebSocketDisconnect:
        print("WebSocket disconnected")

def route_command(cmd: str, websocket=None):
    cmd = cmd.lower()
    if "open" in cmd or "close" in cmd or "volume" in cmd:
        return app_control.handle(cmd)
    if "scan" in cmd:
        # Websocket is set in the async context above
        return scan.handle()
    if "hologram" in cmd:
        # Hologram activation message is sent in the async context above
        # We'll send it from the async function instead
        return hologram.handle()
    return nexamode.handle(cmd)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)