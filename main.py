# main.py
import uvicorn

if __name__ == "__main__":
    print("Starting Nexa AI Assistant...")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)