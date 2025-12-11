# commands/hologram.py
import time
from core.voice import speak


def handle():
    try:
        import streamlit as st

        st.markdown(
            """
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:9999;display:flex;align-items:center;justify-content:center;color:#00ffff;font-size:3em;text-shadow:0 0 20px #00ffff;">
        NEXA HOLOGRAM ACTIVATED
    </div>
    """,
            unsafe_allow_html=True,
        )
        time.sleep(2)
        try:
            st.experimental_rerun()
        except Exception:
            # If experimental_rerun isn't available or fails, ignore
            pass
    except Exception:
        # Non-UI fallback: simple delay to simulate hologram
        time.sleep(2)

    speak("Hologram projected")
    return "Hologram activated"