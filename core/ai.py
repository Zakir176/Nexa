# core/ai.py
import replicate
from config.settings import Config
import cv2
import os
import math

# Lazy-loaded client to avoid crashing on import if token is placeholder
_client = None

def _get_client():
    global _client
    if _client is None:
        token = Config.REPLICATE_TOKEN
        if not token or token == "YOUR_TOKEN_HERE":
            raise ValueError("Replicate API token is not configured")
        _client = replicate.Client(api_token=token)
    return _client

def generate_iron_man_face(image_path):
    try:
        client = _get_client()
        model = client.models.get("fofr/face-to-sticker")
        output = model.predict(
            image=open(image_path, "rb"),
            prompt="Robert Downey Jr as Iron Man, glowing arc reactor, cinematic, 8k, dramatic lighting",
        )
        if isinstance(output, list) and len(output) > 0:
            return output[0]
        return output
    except Exception as e:
        print(f"Replicate error, falling back to local OpenCV HUD overlay: {e}")
        return draw_iron_man_overlay(image_path)

def draw_iron_man_overlay(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None
    
    h, w, _ = img.shape
    color_cyan = (255, 238, 0)  # BGR Cyan-ish
    color_gold = (0, 215, 255)  # BGR Gold
    
    # Draw arc reactor in bottom center
    rx, ry = w // 2, int(h * 0.82)
    cv2.circle(img, (rx, ry), 55, color_cyan, 2)
    cv2.circle(img, (rx, ry), 35, (255, 255, 255), -1)  # white core
    
    # Draw reactor fins
    for i in range(10):
        angle = i * (2 * math.pi / 10)
        x1 = int(rx + 42 * math.cos(angle))
        y1 = int(ry + 42 * math.sin(angle))
        x2 = int(rx + 52 * math.cos(angle))
        y2 = int(ry + 52 * math.sin(angle))
        cv2.line(img, (x1, y1), (x2, y2), color_cyan, 2)
        
    # Draw sci-fi brackets
    margin = 30
    cv2.line(img, (margin, margin), (margin + 40, margin), color_cyan, 2)
    cv2.line(img, (margin, margin), (margin, margin + 40), color_cyan, 2)
    
    cv2.line(img, (w - margin, margin), (w - margin - 40, margin), color_cyan, 2)
    cv2.line(img, (w - margin, margin), (w - margin, margin + 40), color_cyan, 2)
    
    cv2.line(img, (margin, h - margin), (margin + 40, h - margin), color_cyan, 2)
    cv2.line(img, (margin, h - margin), (margin, h - margin - 40), color_cyan, 2)
    
    cv2.line(img, (w - margin, h - margin), (w - margin - 40, h - margin), color_cyan, 2)
    cv2.line(img, (w - margin, h - margin), (w - margin, h - margin - 40), color_cyan, 2)
    
    # High tech HUD labels
    cv2.putText(img, "NEXA HUD // STARK INTEGRATION", (margin + 20, margin + 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color_cyan, 1)
    cv2.putText(img, "SYSTEMS: ACTIVE", (margin + 20, margin + 50), cv2.FONT_HERSHEY_SIMPLEX, 0.4, color_gold, 1)
    cv2.putText(img, "POWER LEVEL: 100%", (margin + 20, margin + 70), cv2.FONT_HERSHEY_SIMPLEX, 0.4, color_gold, 1)
    
    # Save and return static file path
    os.makedirs("static", exist_ok=True)
    fallback_path = os.path.join("static", "suitup_result.jpg")
    cv2.imwrite(fallback_path, img)
    return "/static/suitup_result.jpg"
