# backend/app/main.py
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from backend.app.core.config import settings
import backend.app.tools  # Ensure all tools are registered
from backend.app.api.websocket import router as websocket_router

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include WebSocket Router
app.include_router(websocket_router)

# Serve static directory for screenshots and resources
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve Vite built assets if present
if os.path.exists("frontend/dist/assets"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="frontend_assets")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "whisper_model": settings.WHISPER_MODEL,
        "llm_model": settings.DEFAULT_LLM_MODEL
    }

@app.get("/")
async def root():
    if os.path.exists("frontend/dist/index.html"):
        return FileResponse("frontend/dist/index.html")
    elif os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return HTMLResponse("<h2>Nexa Backend Active</h2><p>Connect over WebSocket at /ws</p>")

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
