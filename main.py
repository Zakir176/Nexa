# main.py
import streamlit as st
from core.voice import listen, speak_async
from commands import app_control, scan, suit_up, hologram
from core.system import volume_up, volume_down, screenshot

st.set_page_config(page_title="J.A.R.V.I.S. 3.0", layout="centered")
st.markdown("<h1 style='text-align:center;color:#ff3b30;'>J.A.R.V.I.S. 3.0</h1>", unsafe_allow_html=True)

status = st.empty()
log = st.empty()

COMMANDS = {
    "open": app_control.handle,
    "close": app_control.handle,
    "scan": lambda: scan.handle(),
    "suit up": lambda: suit_up.handle(),
    "iron man": lambda: suit_up.handle(),
    "hologram": lambda: hologram.handle(),
    "volume up": lambda: (volume_up(), "Volume ↑")[1],
    "volume down": lambda: (volume_down(), "Volume ↓")[1],
    "screenshot": lambda: st.image(screenshot(), caption="Captured"),
}

if st.button("Activate Voice Control"):
    status.info("Listening...")
    cmd = listen()
    log.info(f"Command: **{cmd or 'None'}**")
    
    if cmd:
        executed = False
        for key, func in COMMANDS.items():
            if key in cmd:
                result = func() if callable(func) else func(cmd)
                status.success(result or "Done")
                executed = True
                break
        if not executed:
            status.warning("Unknown command")
    else:
        status.warning("No voice detected")
else:
    st.info("Click to activate JARVIS")