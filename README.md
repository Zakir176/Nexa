# 1. Create folders
mkdir Nexa Nexa/config Nexa/core Nexa/commands Nexa/assets Nexa/.streamlit

# 2. Save all files above
# 3. Add sound files to assets/
# 4. Create .streamlit/secrets.toml
echo 'REPLICATE_API = "r8_YourToken"' > Nexa/.streamlit/secrets.toml

# 5. Install
pip install streamlit opencv-python mediapipe pyautogui replicate pillow playsound speechrecognition pyaudio

# 6. Run
cd Nexa
python -m streamlit run main.py


# 7. Simple commands 
"Meet Nexa—my private AI agent, runs on-device, no cloud drama.
Nexa, scan the room! [Faces light up green]
Nexa, open browser. [Chrome pops open]
Nexa, tell a joke. [AI quips]
Nexa, hologram! [Screen glows blue]
Boom—faster than Siri, cooler than JARVIS. Who's next?"