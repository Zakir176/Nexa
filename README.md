
# Nexa - On-Device AI Assistant

Nexa is a modular, voice-activated AI assistant inspired by cutting-edge on-device AI like Nexa AI's Octopus models. It runs locally on your device for privacy, speed, and zero cloud dependency think Siri meets JARVIS, but open-source and extensible.
Built with Python and Streamlit, Nexa handles voice commands for app control, environment scanning (faces, hands, objects), quick utils (weather, jokes, math), and futuristic holograms. Perfect for demos, personal projects, or as a base for your own AI sidekick.

## Features

- Voice Control: Wake Nexa with speech—say "open browser" or "scan room" and watch it respond.
- Environment Scanning: Real-time detection of humans, hands, and 80+ objects (phones, laptops, cups, pets) using MediaPipe + YOLOv8.
- System Integration: Open/close apps (Notepad, Chrome, Spotify), adjust volume, take screenshots.
- Smart Utils:
   - Weather forecasts (via OpenWeatherMap API).
   - Tell jokes or solve quick math (e.g., "calculate 2 + 2 * 3").
- Hologram Mode: Full-screen sci-fi HUD for that immersive "whoa" factor.
- Modular Design: Add new commands in 1 line—plug in ML models, APIs, or gestures easily.
- On-Device Focus: No external servers needed (except optional APIs); runs on CPU/GPU.
## Prerequisites

- Python 3.8+ (tested on 3.12)
- Microphone and webcam access (for voice/scanning)
- Optional: OpenWeatherMap API key for weather (free at openweathermap.org)
## Installation

1. clone my repo

```bash
git clone https://github.com/Zakir176/Nexa.git
cd Nexa
```

2. Setup virtual environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. install dependenies

```bash
pip install -r requirements.txt
```

4. Configure (Optional)

For weather: Add your API key to config/settings.py:
python

```bash
WEATHER_API_KEY = "your_free_key_here"
```

5. Run the program

```bash
python -m streamlit run main.py
```
## Badges


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Project Structure

```bash
Nexa/
├── main.py                  # Entry point: UI + voice command loop
├── config/
│   └── settings.py          # App configs (API keys, thresholds)
├── core/                    # Core engines
│   ├── voice.py             # Speech recognition + TTS
│   ├── vision.py            # Camera scanning (MediaPipe + YOLO)
│   ├── system.py            # OS integrations (apps, volume)
│   └── utils.py             # Helpers (weather, jokes)
├── commands/                # Pluggable command modules
│   ├── __init__.py
│   ├── app_control.py       # Open/close apps, volume
│   ├── scan.py              # Room scanning
│   ├── nexamode.py          # Utils (weather, math, jokes)
│   └── hologram.py          # Sci-fi UI effects
├── assets/                  # Sounds and resources
│   ├── activate.wav
│   ├── deactivate.wav
│   └── nexachime.wav
└── requirements.txt         # Dependenciespy
```
## 🤝 Contributing

 We love contributions! Whether it's bug fixes, new commands, or docs—help make Nexa even more awesome.
- How to Contribute

    - Fork the repo and clone your fork.
    - Create a branch: git checkout -b feature/amazing-idea.
    - Make changes: Code, test, and commit with clear messages (e.g., "Add gesture swipe command").
    - Push: git push origin feature/amazing-idea.
    - Pull Request: Open a PR to main. Describe what you added/fixed and why.
    - Test: Ensure it runs on Python 3.8+ and add tests if possible.