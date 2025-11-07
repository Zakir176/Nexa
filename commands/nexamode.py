# commands/nexamode.py
from core.voice import speak

# Safe import for utils
try:
    from core.utils import get_weather, tell_joke
    _utils_available = True
except ImportError:
    _utils_available = False
    print("[Nexa] Utils not available — create core/utils.py for weather/jokes")
    def get_weather(city): return f"Weather in {city}: Check manually (utils missing)"
    def tell_joke(): return "Why did the AI go to therapy? Utils module missing!"

def handle(command):
    if "weather" in command:
        city = command.replace("weather in", "").strip() or "your location"
        weather = get_weather(city)
        speak(weather)
        return weather
    elif "joke" in command or "tell a joke" in command:
        joke = tell_joke()
        speak(joke)
        return joke
    elif "math" in command or "calculate" in command:
        expr = command.replace("calculate", "").replace("math", "").strip()
        try:
            result = eval(expr)
            speak(f"The answer is {result}")
            return f"{expr} = {result}"
        except:
            return "Math error—try simpler like '2 + 2'"
    return None