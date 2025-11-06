# 1. Create folders
mkdir jarvis jarvis/config jarvis/core jarvis/commands jarvis/assets jarvis/.streamlit

# 2. Save all files above
# 3. Add sound files to assets/
# 4. Create .streamlit/secrets.toml
echo 'REPLICATE_API = "r8_YourToken"' > jarvis/.streamlit/secrets.toml

# 5. Install
pip install streamlit opencv-python mediapipe pyautogui replicate pillow playsound speechrecognition pyaudio

# 6. Run
cd jarvis
python -m streamlit run main.py
