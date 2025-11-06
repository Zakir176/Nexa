# commands/scan.py
from core.vision import scan_environment
import streamlit as st

def handle():
    placeholder = st.empty()
    def update(frame):
        placeholder.image(frame, channels="BGR")
    scan_environment(update)
    return "Scan complete"