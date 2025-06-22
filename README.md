# Nexa - On-Device AI Assistant v2.0

Nexa is a modular, voice-activated AI assistant built with FastAPI, OpenCV, MediaPipe, YOLOv8, faster-whisper, edge-tts, and a modern React HUD dashboard. It runs locally for privacy and ultra-low latency — bringing Siri and JARVIS capabilities into an extensible, open-source AI platform.

---

## 🌟 Key Features

- 🎙️ **Voice Recognition (STT)**: Powered by `faster-whisper` and Voice Activity Detection (VAD) for fast speech transcription.
- 🗣️ **Neural Speech (TTS)**: High-quality streaming voice synthesis via `edge-tts` (Microsoft Edge Neural Voices) with local fallbacks.
- 🤖 **LLM Tool-Calling Agent**: Connects to local Ollama (`qwen2.5` / `llama3.2`) or cloud LLM APIs to parse user intents dynamically and execute system tools.
- 👁️ **Vision Engine**: Real-time camera scanner with MediaPipe face & hand landmark tracking and YOLOv8 object detection.
- 💻 **OS System Controls**: Open/close applications, take screenshots, adjust volume, and monitor CPU/RAM/Battery metrics.
- 🎛️ **Modern React HUD**: Futuristic glassmorphic UI built with Vite, React, Tailwind CSS, Lucide icons, and an HTML5 canvas audio spectrum visualizer.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- (Optional) [Ollama](https://ollama.com/) running locally for offline LLM tool calling (`ollama run qwen2.5`)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Zakir176/Nexa.git
cd Nexa

# Install Python backend dependencies
pip install -r requirements.txt

# Install Frontend dependencies and build assets
cd frontend
npm install
npm run build
cd ..
```

### 2. Run the Nexa Server

```bash
python main.py
```

Then open your browser to **http://localhost:8000** to launch the Nexa HUD Dashboard.

---

## 📁 Project Architecture

```
Nexa/
├── backend/app/
│   ├── main.py                  # FastAPI initialization & static file serving
│   ├── core/
│   │   ├── config.py            # App settings (Pydantic configuration)
│   │   ├── event_bus.py         # Async event bus
│   │   └── state.py             # System status state manager (IDLE, LISTENING, SPEAKING)
│   ├── services/
│   │   ├── stt_service.py       # Speech-to-Text engine (faster-whisper)
│   │   ├── tts_service.py       # Text-to-Speech engine (edge-tts streaming)
│   │   ├── vision_service.py    # OpenCV + YOLOv8 + MediaPipe vision loop
│   │   ├── llm_service.py       # Ollama / LLM intent parser & tool calling
│   │   └── system_service.py    # OS application & hardware controls
│   ├── tools/                   # Pluggable Tool Registry
│   │   ├── registry.py          # Tool schema generator & execution router
│   │   ├── app_control.py       # App launching, volume, screenshot tools
│   │   ├── vision_scan.py       # Environment scanning tool
│   │   ├── weather.py           # Weather lookup tool
│   │   └── system_info.py       # Hardware metrics tool
│   └── api/
│       └── websocket.py         # Real-time WebSocket connection manager & router
├── frontend/                    # Vite + React + Tailwind CSS HUD Dashboard
│   ├── src/
│   │   ├── components/          # HUD Core button, AudioVisualizer, VisionOverlay, CommandPanel
│   │   ├── hooks/               # useNexaWebSocket custom hook
│   │   └── App.jsx
│   └── dist/                    # Compiled production assets
├── main.py                      # Root launcher script
└── requirements.txt             # Python dependencies
```

---

## 📜 License

MIT License © 2026 Nexa AI Project.