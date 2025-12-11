# commands/suit_up.py
import cv2
from core.ai import generate_iron_man_face
from core.voice import speak_async


def handle():
    speak_async("assets/suitup.mp3")
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()
    if ret:
        cv2.imwrite("temp_selfie.jpg", frame)
        result = generate_iron_man_face("temp_selfie.jpg")
        try:
            import streamlit as st

            st.image(result, caption="Suit Up Complete")
        except Exception:
            # In non-UI mode, save the result to disk so user can inspect it
            cv2.imwrite("suitup_result.jpg", result)
        return "Iron Man mode activated"
    return "Camera error"
