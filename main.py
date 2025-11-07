# main.py
import streamlit as st
from core.voice import listen, speak
from commands import app_control, scan, nexamode, hologram
import time

# === PAGE CONFIG ===
st.set_page_config(page_title="NEXA", layout="centered", initial_sidebar_state="collapsed")

# === QUERY PARAM HANDLING ===
query_params = st.query_params
activate = query_params.get("activate") == ["true"]

# === FULL-SCREEN CINEMATIC UI ===
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');

html, body, .stApp {
    margin:0; padding:0;
    height:100%;
    background:#000;
    font-family:'Orbitron',sans-serif;
    overflow:hidden;
}

/* Hide default Streamlit chrome (but NOT app content) */
#MainMenu, header, footer {visibility:hidden;}
</style>
""", unsafe_allow_html=True)

# === CUSTOM HTML UI ===
html_ui = """
<div id="nexa-ui" style="width:100vw;height:100vh;position:relative;background:#000;overflow:hidden;display:flex;justify-content:center;align-items:center;">
    <!-- Background -->
    <div style="position:absolute;top:0;left:0;width:100%;height:100%;
        background:radial-gradient(ellipse at center,#001122 0%,#000 70%);
        z-index:0;"></div>

    <!-- Scan Lines -->
    <div style="position:absolute;top:0;left:0;width:100%;height:100%;
        background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,255,0.05) 2px,rgba(0,255,255,0.05) 4px);
        pointer-events:none;animation:scan 8s linear infinite;z-index:1;"></div>

    <!-- HUD Text -->
    <div style="position:absolute;top:20px;left:20px;color:#00ffff;font-size:0.8rem;opacity:0.6;text-shadow:0 0 10px #00ffff;z-index:2;">SYSTEM: ONLINE</div>
    <div style="position:absolute;top:20px;right:20px;color:#00ffff;font-size:0.8rem;opacity:0.6;text-shadow:0 0 10px #00ffff;z-index:2;">NEXA v1.0</div>
    <div style="position:absolute;bottom:20px;left:20px;color:#00ffff;font-size:0.8rem;opacity:0.6;text-shadow:0 0 10px #00ffff;z-index:2;">VOICE: READY</div>
    <div style="position:absolute;bottom:20px;right:20px;color:#00ffff;font-size:0.8rem;opacity:0.6;text-shadow:0 0 10px #00ffff;z-index:2;">CAM: STANDBY</div>

    <!-- Hologram -->
    <div id="hologram" style="width:400px;height:400px;position:relative;cursor:pointer;perspective:1000px;
        animation:float 6s ease-in-out infinite;z-index:3;">
        <div class="ring" style="position:absolute;width:100%;height:100%;border-radius:50%;
            border:3px solid #00ffff;box-shadow:0 0 30px #00ffff,0 0 60px #00ffff;
            opacity:0;animation:ring 3s infinite;transform:rotateX(75deg);"></div>
        <div class="ring" style="animation-delay:0.8s;"></div>
        <div class="ring" style="animation-delay:1.6s;"></div>

        <div style="position:absolute;top:50px;left:50px;width:300px;height:300px;
            background:radial-gradient(circle,#0a1a3d 0%,#000 70%);
            border-radius:50%;box-shadow:inset 0 0 80px #00ffff;
            display:flex;align-items:center;justify-content:center;z-index:4;"></div>

        <div style="color:#fff;font-size:3.5rem;font-weight:900;letter-spacing:10px;
            text-shadow:0 0 20px #00ffff,0 0 40px #00ffff,0 0 80px #00ffff;
            animation:glow 2s infinite alternate;z-index:5;">nexa</div>
    </div>

    <!-- Status -->
    <div id="status" style="position:absolute;bottom:40px;color:#00ffff;font-size:1.3rem;
        text-align:center;width:100%;text-shadow:0 0 15px #00ffff;z-index:6;">
        Tap to activate
    </div>

    <!-- Wave Template -->
    <div id="wave" style="position:absolute;width:450px;height:450px;border-radius:50%;
        border:4px solid #00ffff;opacity:0;animation:wave 1.5s forwards;display:none;"></div>
</div>

<style>
@keyframes float{0%,100%{transform:translateY(0) rotateX(0)}50%{transform:translateY(-20px) rotateX(5deg)}}
@keyframes ring{0%{transform:scale(0.8) rotateX(75deg);opacity:0.8}100%{transform:scale(1.8) rotateX(75deg);opacity:0}}
@keyframes glow{0%{text-shadow:0 0 20px #00ffff}100%{text-shadow:0 0 60px #00ffff,0 0 100px #00ffff}}
@keyframes wave{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2);opacity:0}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
#hologram:hover{transform:scale(1.03)}
</style>

<script>
let listening = false;
const hologram = document.getElementById('hologram');
const status = document.getElementById('status');
const waveTemplate = document.getElementById('wave');

hologram.onclick = () => {
    if (listening) return;
    listening = true;
    status.innerHTML = 'INITIALIZING...';
    setTimeout(() => status.innerHTML = 'LISTENING...', 1200);

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const w = waveTemplate.cloneNode(true);
            w.id = ''; w.style.display = 'block'; w.style.animationDelay = `${i*0.4}s`;
            hologram.parentNode.appendChild(w);
            setTimeout(() => w.remove(), 1500);
        }, i * 400);
    }

    const url = new URL(window.location);
    url.searchParams.set('activate', 'true');
    window.location = url;
};
</script>
"""

import streamlit.components.v1 as components
components.html(html_ui, height=800, width=1000, scrolling=False)

# === VOICE HANDLER ===
if activate:
    # Clear URL param so it doesn’t loop
    st.query_params.clear()

    # Update UI text via JS
    st.markdown(
        '<script>document.getElementById("status").innerHTML = "PROCESSING...";</script>',
        unsafe_allow_html=True
    )

    cmd = listen()
    if cmd:
        st.markdown(
            f'<script>document.getElementById("status").innerHTML = "HEARD: <strong>{cmd}</strong>";</script>',
            unsafe_allow_html=True
        )
        time.sleep(1)

        COMMANDS = {
            "open": app_control, "close": app_control, "volume": app_control,
            "scan": scan, "hologram": hologram,
            "weather": nexamode, "joke": nexamode, "calculate": nexamode, "math": nexamode
        }

        executed = False
        for key, handler in COMMANDS.items():
            if key in cmd.lower():
                try:
                    result = handler(cmd) if key in ["open", "close", "volume"] else handler()
                    st.markdown(
                        f'<script>document.getElementById("status").innerHTML = "DONE: {result or "Complete"}";</script>',
                        unsafe_allow_html=True
                    )
                except Exception as e:
                    st.markdown(
                        f'<script>document.getElementById("status").innerHTML = "ERROR: {e}";</script>',
                        unsafe_allow_html=True
                    )
                executed = True
                break

        if not executed:
            st.markdown(
                '<script>document.getElementById("status").innerHTML = "UNKNOWN COMMAND";</script>',
                unsafe_allow_html=True
            )
            speak("Try again.")
    else:
        st.markdown(
            '<script>document.getElementById("status").innerHTML = "NO VOICE";</script>',
            unsafe_allow_html=True
        )

    # Reset back to idle after short delay
    time.sleep(2)
    st.markdown(
        '<script>document.getElementById("status").innerHTML = "Tap to activate";window.location.search="";</script>',
        unsafe_allow_html=True
    )
    st.rerun()
