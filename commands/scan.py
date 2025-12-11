# commands/scan.py
from core.vision import scan_environment
from core.voice import speak


def handle():
    # Import Streamlit lazily so this module is safe to import under FastAPI
    try:
        import streamlit as st

        st.info("Scanning...")
        placeholder = st.empty()

        def update(frame):
            placeholder.image(frame, channels="BGR")
    except Exception:
        # Fallback: headless/no-UI mode — just no-op the frame updates
        def update(frame):
            pass

    scan_environment(update)
    speak("Scan complete")
    return "Scan complete"