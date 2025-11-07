# core/ai.py
import replicate
from config.settings import Config
import cv2

client = replicate.Client(api_token=Config.REPLICATE_TOKEN)


def generate_iron_man_face(image_path):
    model = client.models.get("fofr/face-to-sticker")
    output = model.predict(
        image=open(image_path, "rb"),
        prompt="Robert Downey Jr as Iron Man, glowing arc reactor, cinematic, 8k, dramatic lighting",
    )
    return output
