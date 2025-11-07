# commands/scan.py
from core.vision import scan_environment
import streamlit as st
from core.voice import speak

def handle():
    st.info("Scanning...")
    placeholder = st.empty()
    def update(frame):
        placeholder.image(frame, channels="BGR")
    scan_environment(update)
    speak("Scan complete")
    return "Scan complete"