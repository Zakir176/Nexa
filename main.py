# main.py
import streamlit as st
from core.voice import listen, speak
from commands import app_control, scan, nexamode, hologram

st.set_page_config(page_title="Nexa AI", layout="wide")
st.title("Nexa – Your On-Device AI Agent")
st.markdown("*Fast, private, and ready to assist—like Octopus on steroids.*")

status = st.empty()
log   = st.empty()

# ----------------------------------------------------------------------
# Helper: call a handler that may or may not need the command string
def safe_call(handler, cmd=""):
    if callable(handler):
        # If the handler signature expects one argument → pass cmd
        try:
            return handler(cmd)
        except TypeError:
            # Fallback: try without argument
            return handler()
    return handler  # already a result string
# ----------------------------------------------------------------------


COMMANDS = {
    # app_control needs the whole command (open/close/volume)
    "open":   lambda c: app_control.handle(c),
    "close":  lambda c: app_control.handle(c),
    "volume": lambda c: app_control.handle(c),

    # scan & hologram take no args
    "scan":     lambda _: safe_call(scan.handle),
    "hologram": lambda _: safe_call(hologram.handle),

    # nexamode handles weather/joke/math
    "weather":   lambda c: nexamode.handle(c),
    "joke":      lambda c: nexamode.handle(c),
    "calculate": lambda c: nexamode.handle(c),
    "math":      lambda c: nexamode.handle(c),

    # friendly wake-up phrase
    "nexa mode": lambda _: (speak("Nexa mode engaged—what's your command?"), "Ready")[1],
}

# ----------------------------------------------------------------------
if st.button("Wake Nexa (Voice Mode)"):
    status.info("Listening… Speak now!")
    cmd = listen()
    log.info(f"Heard: **{cmd or '—'}**")

    if cmd:
        handled = False
        for key, func in COMMANDS.items():
            if key in cmd.lower():
                result = safe_call(func, cmd)
                status.success(result or "Done")
                handled = True
                break

        if not handled:
            status.warning("Nexa: Command unclear. Try 'open notepad' or 'scan'.")
            speak("Sorry, try again.")
    else:
        status.warning("No audio detected.")
        speak("I didn’t catch that.")
else:
    st.info(
        "Click to activate Nexa. Examples:\n"
        "- **open notepad**\n"
        "- **scan room**\n"
        "- **weather in Paris**\n"
        "- **tell a joke**\n"
        "- **calculate 12 * 7**\n"
        "- **hologram**"
    )

st.caption("Built with love for demos—expand modules as needed!")