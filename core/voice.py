# core/voice.py
import speech_recognition as sr
from playsound import playsound
import threading

recognizer = sr.Recognizer()

def listen(timeout=3, phrase_time=5):
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time)
    try:
        return recognizer.recognize_google(audio).lower()
    except:
        return ""

def speak_async(file):
    threading.Thread(target=playsound, args=(file,), daemon=True).start()