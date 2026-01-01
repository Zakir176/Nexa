
# Nexa - On-Device AI Assistant

Nexa is a modular, voice-activated AI assistant that runs locally for privacy and low latency — think Siri meets JARVIS, but open-source and extensible. It serves a local web UI via FastAPI at http://localhost:8000 and communicates in real-time over a WebSocket at /ws.
Built with Python and FastAPI, Nexa handles voice commands for app control, environment scanning (faces, hands, objects), quick utils (weather, jokes, math), and a hologram-style HUD. Perfect for demos, personal projects, or as a base for your own AI sidekick.

## Features

- Voice control: Transcribes microphone audio using Whisper and routes commands like "open browser", "scan room", "activate hologram".
- Environment scanning: Real-time detection of faces and hands via MediaPipe, plus 80+ objects via YOLOv8 (using the included yolov8n.pt).
- System integration: Open/close apps (Notepad, default browser, Spotify on supported OS), adjust volume, take screenshots.
- Smart utils:
  - Weather (via utils hook; provide your own API key if implemented).
  - Jokes and quick math (e.g., "calculate 2 + 2 * 3").
- Hologram mode: Full-screen sci‑fi HUD served from /static for an immersive effect.
- Modular design: Add new command modules under commands/, and route in main.py if needed.
- On-device focus: Runs locally; optional APIs may be used for utilities.
## Prerequisites

- Python 3.12 (tested)
- Windows recommended (current app controls are Windows-centric); macOS/Linux partially supported for some features
- Microphone and webcam access (for voice/scanning)
- Optional: OpenWeatherMap API key for weather (if you wire utils to it)
- Optional: GPU/CUDA for faster YOLO/Whisper inference
## Installation

1. Clone the repo

```bash
git clone https://github.com/Zakir176/Nexa.git
cd Nexa
```

2. Set up a virtual environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Configure (optional)

- Whisper model: set an environment variable to adjust accuracy/speed tradeoff
  - Windows (cmd):
    ```bash
    set WHISPER_MODEL=base
    ```
  - PowerShell:
    ```bash
    $env:WHISPER_MODEL="base"
    ```
  - Unix shells:
    ```bash
    export WHISPER_MODEL=base
    ```
- Weather API: if you implement weather via utils, prefer environment variables or a secrets file instead of hardcoding in config/settings.py.
- Camera: adjust CAMERA_ID in config/settings.py if your default camera is not index 0.

5. Run the program

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Then open your browser to http://localhost:8000

Quick usage:
- Click the Activate control in the web UI to start listening, then say commands like "open browser", "scan room", or "activate hologram".
- The backend supports a "stop_scan" message over WebSocket to stop an ongoing scan.
## Badges


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


## Project Structure

```bash
Nexa/
├── main.py                  # FastAPI app + WebSocket + command routing
├── static/                  # Frontend UI served at /
│   ├── index.html
│   ├── script.js
│   └── style.css
├── config/
│   └── settings.py          # App configs (model selection, thresholds, camera ID)
├── core/                    # Core engines
│   ├── voice.py             # Speech recognition (Whisper) + TTS
│   ├── vision.py            # Camera scanning (MediaPipe + YOLOv8)
│   ├── system.py            # OS integrations (apps, volume, screenshot)
│   └── utils.py             # Helpers (weather, jokes) — optional
├── commands/                # Pluggable command modules
│   ├── __init__.py
│   ├── app_control.py       # Open/close apps, volume
│   ├── scan.py              # Room scanning
│   ├── nexamode.py          # Utils (weather, math, jokes)
│   └── hologram.py          # Sci‑fi UI effects
├── assets/                  # Sounds and resources
│   ├── activate.wav
│   └── deactivate.wav
├── yolov8n.pt               # YOLOv8 model (nano)
└── requirements.txt         # Dependencies
```
## 🤝 Contributing

Contributions are welcome — bug fixes, new commands, or docs.

- Fork the repo and clone your fork.
- Create a branch: `git checkout -b feature/amazing-idea`.
- Make changes, test locally, and commit with clear messages (e.g., "Add gesture swipe command").
- Push: `git push origin feature/amazing-idea`.
- Open a PR to main with a description of changes and rationale.
- Ensure it runs on supported Python versions (tested on 3.12) and include tests if applicable.