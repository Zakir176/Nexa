# config/settings.py
import os

class Config:
    REPLICATE_TOKEN = os.getenv("REPLICATE_API") or "YOUR_TOKEN_HERE"
    CAMERA_ID = 0
    CONFIDENCE_FACE = 0.6
    CONFIDENCE_HAND = 0.7