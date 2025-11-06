# commands/hologram.py
import streamlit as st
import time

def handle():
    st.markdown("""
    <div style='position:fixed;top:0;left:0;width:100vw;height:100vh;
                background:rgba(0,0,0,0.95);z-index:9999;display:flex;
                align-items:center;justify-content:center;color:#00ffff;
                font-family:Orbitron;font-size:3em;text-shadow:0 0 20px #0ff;'>
        <div>PROJECTING HOLOGRAM</div>
    </div>
    """, unsafe_allow_html=True)
    time.sleep(2)
    st.experimental_rerun()