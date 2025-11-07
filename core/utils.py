# core/utils.py
import random
# import requests  # Uncomment if you add OpenWeatherMap key

def get_weather(city="London"):
    # Placeholder — replace with real API if you have a key
    return f"Weather in {city}: Sunny, 22°C (get free key at openweathermap.org for real data)"

def tell_joke():
    jokes = [
        "Why did the AI go to therapy? It had too many unresolved issues!",
        "What do you call an AI that sings? A neural network!",
        "Why don't AIs play hide and seek? Because good luck hiding when they have all the data!"
    ]
    return random.choice(jokes)