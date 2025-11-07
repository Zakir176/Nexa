\# Nexa - On-Device AI Assistant

\[!\[GitHub Repo stars\](https://img.shields.io/github/stars/Zakir176/Nexa?style=social)\](https://github.com/Zakir176/Nexa) \[!\[License: MIT\](https://img.shields.io/badge/License-MIT-yellow.svg)\](https://opensource.org/licenses/MIT) \[!\[Python 3.8+\](https://img.shields.io/badge/Python-3.8+-blue.svg)\](https://www.python.org/downloads/)

Nexa is a \*\*modular, voice-activated AI assistant\*\* inspired by cutting-edge on-device AI like \[Nexa AI's Octopus models\](https://nexa.ai/). It runs locally on your device for \*\*privacy, speed, and zero cloud dependency\*\*—think Siri meets JARVIS, but open-source and extensible.

Built with Python and Streamlit, Nexa handles voice commands for \*\*app control\*\*, \*\*environment scanning\*\* (faces, hands, objects), \*\*quick utils\*\* (weather, jokes, math), and \*\*futuristic holograms\*\*. Perfect for demos, personal projects, or as a base for your own AI sidekick.

\## 🚀 Features

\- \*\*Voice Control\*\*: Wake Nexa with speech—say "open browser" or "scan room" and watch it respond.

\- \*\*Environment Scanning\*\*: Real-time detection of humans, hands, and 80+ objects (phones, laptops, cups, pets) using MediaPipe + YOLOv8.

\- \*\*System Integration\*\*: Open/close apps (Notepad, Chrome, Spotify), adjust volume, take screenshots.

\- \*\*Smart Utils\*\*:

\- Weather forecasts (via OpenWeatherMap API).

\- Tell jokes or solve quick math (e.g., "calculate 2 + 2 \* 3").

\- \*\*Hologram Mode\*\*: Full-screen sci-fi HUD for that immersive "whoa" factor.

\- \*\*Modular Design\*\*: Add new commands in 1 line—plug in ML models, APIs, or gestures easily.

\- \*\*On-Device Focus\*\*: No external servers needed (except optional APIs); runs on CPU/GPU.

| Command Example | What Happens |

|-----------------|--------------|

| "Nexa, scan room" | Live camera feed with labeled detections (e.g., "Human 1", "cell phone 0.92") |

| "Open Notepad" | Launches Notepad + voice confirmation |

| "Weather in Paris" | Speaks/Shows: "Partly cloudy, 18°C" |

| "Tell a joke" | Delivers a pun like "Why did the AI go to therapy? Too many unresolved issues!" |

| "Hologram" | Screen pulses with cyan "NEXA ONLINE" glow |

\## 📋 Prerequisites

\- Python 3.8+ (tested on 3.12)

\- Microphone and webcam access (for voice/scanning)

\- Optional: OpenWeatherMap API key for weather (free at \[openweathermap.org\](https://openweathermap.org/api))

\## 🛠️ Quick Start

\### 1. Clone the Repo

\`\`\`bash

git clone https://github.com/Zakir176/Nexa.git

cd Nexa

\`\`\`

\### 2. Set Up Virtual Environment (Recommended)

\`\`\`bash

python -m venv venv

\# Windows

venv\\Scripts\\activate

\# macOS/Linux

source venv/bin/activate

\`\`\`

\### 3. Install Dependencies

\`\`\`bash

pip install -r requirements.txt

\`\`\`

\*(See \`requirements.txt\` below for the full list.)\*

\### 4. Configure (Optional)

\- For weather: Add your API key to \`config/settings.py\`:

\`\`\`python

WEATHER\_API\_KEY = "your\_free\_key\_here"

\`\`\`

\- Add sound effects to \`assets/\` (free WAVs from \[Freesound.org\](https://freesound.org)):

\- \`activate.wav\`: Sci-fi beep

\- \`deactivate.wav\`: Power-down hum

\- \`nexachime.wav\`: Activation chime

\### 5. Run Nexa

\`\`\`bash

streamlit run main.py

\`\`\`

\- Opens in your browser: \`http://localhost:8501\`

\- Click \*\*"Wake Nexa (Voice Mode)"\*\* and start commanding!

\### Example Demo Script

\> "Meet \*\*Nexa\*\*—my private AI agent, runs on-device, no cloud drama.

\> \*\*Nexa, scan the room!\*\* \*\[Faces and objects light up\]\*

\> \*\*Nexa, open browser.\*\* \*\[Chrome launches\]\*

\> \*\*Nexa, tell a joke.\*\* \*\[AI quips\]\*

\> \*\*Nexa, hologram!\*\* \*\[Screen glows blue\]\*

\> Boom—faster than Siri, cooler than JARVIS. Who's next?"

\## 📁 Project Structure

\`\`\`

Nexa/

├── main.py # Entry point: UI + voice command loop

├── config/

│ └── settings.py # App configs (API keys, thresholds)

├── core/ # Core engines

│ ├── voice.py # Speech recognition + TTS

│ ├── vision.py # Camera scanning (MediaPipe + YOLO)

│ ├── system.py # OS integrations (apps, volume)

│ └── utils.py # Helpers (weather, jokes)

├── commands/ # Pluggable command modules

│ ├── \_\_init\_\_.py

│ ├── app\_control.py # Open/close apps, volume

│ ├── scan.py # Room scanning

│ ├── nexamode.py # Utils (weather, math, jokes)

│ └── hologram.py # Sci-fi UI effects

├── assets/ # Sounds and resources

│ ├── activate.wav

│ ├── deactivate.wav

│ └── nexachime.wav

└── requirements.txt # Dependencies

\`\`\`

\## 🔧 Extending Nexa

Nexa's modular—add features without breaking anything!

\### Adding a New Command

1\. Create \`commands/new\_feature.py\`:

\`\`\`python

from core.voice import speak

def handle(command):

\# Your logic here

speak("Feature activated!")

return "New feature executed"

\`\`\`

2\. Update \`main.py\` in the \`COMMANDS\` dict:

\`\`\`python

"new command": lambda c: new\_feature.handle(c),

\`\`\`

3\. Restart and test: Say "new command"!

\### Ideas for Extensions

\- \*\*Gesture Control\*\*: Wave hands to swipe tabs (extend \`vision.py\`).

\- \*\*Offline Math Solver\*\*: Integrate SymPy for complex equations.

\- \*\*Music Player\*\*: Voice-queue Spotify tracks.

\- \*\*Smart Home\*\*: Philips Hue lights via API.

\## 📦 Requirements

Create \`requirements.txt\` with:

\`\`\`

streamlit==1.38.0

opencv-python==4.10.0.84

mediapipe==0.10.14

ultralytics==8.3.0 # For YOLO object detection

pyautogui==0.9.54

speechrecognition==3.10.0

pyttsx3==2.91 # TTS

pyaudio==0.2.11

requests==2.32.3

pygame==2.6.0 # For better audio (optional)

\`\`\`

Install with \`pip install -r requirements.txt\`.

\## 🤝 Contributing

We love contributions! Whether it's bug fixes, new commands, or docs—help make Nexa even more awesome.

\### How to Contribute

1\. \*\*Fork\*\* the repo and clone your fork.

2\. \*\*Create a branch\*\*: \`git checkout -b feature/amazing-idea\`.

3\. \*\*Make changes\*\*: Code, test, and commit with clear messages (e.g., "Add gesture swipe command").

4\. \*\*Push\*\*: \`git push origin feature/amazing-idea\`.

5\. \*\*Pull Request\*\*: Open a PR to \`main\`. Describe what you added/fixed and why.

6\. \*\*Test\*\*: Ensure it runs on Python 3.8+ and add tests if possible.

\### Guidelines

\- \*\*Code Style\*\*: Follow PEP 8—use black formatter: \`pip install black && black .\`.

\- \*\*Commits\*\*: Use conventional commits (e.g., "feat: add weather command", "fix: resolve voice timeout").

\- \*\*Docs\*\*: Update README or add examples for new features.

\- \*\*Tests\*\*: Add simple unit tests in a new \`tests/\` folder (using pytest).

\- \*\*Issues\*\*: Report bugs or suggest features via GitHub Issues. Tag with \`bug\` or \`enhancement\`.

Before submitting:

\- Run \`black .\` for formatting.

\- Test on your OS (Windows/macOS/Linux).

\- Ensure no breaking changes to core commands.

Thanks for contributing! 🎉

\## 📄 License

This project is licensed under the MIT License - see the \[LICENSE\](LICENSE) file for details.

\## 🙏 Acknowledgments

\- Inspired by \[Nexa AI\](https://nexa.ai/) for on-device magic.

\- Built on awesome open-source: Streamlit, MediaPipe, YOLOv8, and SpeechRecognition.

\- Sound effects from \[Freesound.org\](https://freesound.org) (CC0 licensed).

\## ⭐ Star & Fork

If Nexa sparks joy, star the repo and share your builds! Questions? Open an issue or ping @Zakir176.

\---

\*Built with ❤️ by Zakir176. Last updated: November 07, 2025.\*