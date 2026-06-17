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

import re

def handle(command):
    command = command.lower().strip()
    if "weather" in command:
        # Extract city robustly
        city_input = command
        for prefix in ["weather in", "weather for", "weather of", "weather"]:
            if prefix in city_input:
                city_input = city_input.split(prefix, 1)[1]
                break
        city = city_input.strip()
        # Strip common leading prefix words
        for helper in ["like in", "like", "in", "for", "of", "the", "at"]:
            if city.startswith(helper + " "):
                city = city[len(helper):].strip()
        
        city = city or "your location"
        weather = get_weather(city)
        speak(weather)
        return weather
    elif "joke" in command or "tell a joke" in command:
        joke = tell_joke()
        speak(joke)
        return joke
    elif "math" in command or "calculate" in command:
        expr = command.replace("calculate", "").replace("math", "").strip()
        
        # Security check: Allow only numbers, basic arithmetic operators, parentheses, and spaces.
        # This prevents execution of functions, builtins, imports, or attributes.
        if not re.match(r'^[0-9+\-*/().\s%]+$', expr):
            return "Safety warning: Math expression contains invalid or dangerous characters."
            
        try:
            # Safe eval because only digits and operators are allowed, preventing code execution.
            result = eval(expr, {"__builtins__": None}, {})
            speak(f"The answer is {result}")
            return f"{expr} = {result}"
        except ZeroDivisionError:
            return "Math error: Division by zero."
        except OverflowError:
            return "Math error: Calculation result is too large."
        except Exception as e:
            return f"Math error: Invalid expression ({str(e)})"
    return None