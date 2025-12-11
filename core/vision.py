# core/vision.py
import cv2
import mediapipe as mp
from ultralytics import YOLO
from config.settings import Config

# MediaPipe: faces + hands
mp_face = mp.solutions.face_detection
mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils


# Lazy-loaded YOLO model to avoid heavy imports at module import time
_yolo_model = None

def _get_yolo_model():
    global _yolo_model
    if _yolo_model is not None:
        return _yolo_model

    # Try to use Streamlit's cache_resource when available, but import
    # streamlit lazily so importing this module doesn't initialize Streamlit.
    try:
        import streamlit as st

        @st.cache_resource
        def _load():
            return YOLO("yolov8n.pt")

        _yolo_model = _load()
    except Exception:
        _yolo_model = YOLO("yolov8n.pt")

    return _yolo_model


def scan_environment(callback):
    cap = cv2.VideoCapture(Config.CAMERA_ID)
    with mp_face.FaceDetection(min_detection_confidence=Config.CONFIDENCE) as face_det, mp_hands.Hands(
        min_detection_confidence=Config.CONFIDENCE, max_num_hands=2
    ) as hands:

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            h, w, _ = frame.shape

            # === 1. Face Detection ===
            faces = face_det.process(rgb)
            if faces.detections:
                for idx, d in enumerate(faces.detections):
                    mp_draw.draw_detection(frame, d)
                    bbox = d.location_data.relative_bounding_box
                    x = int(bbox.xmin * w)
                    y = int(bbox.ymin * h)
                    cv2.putText(frame, f"Human {idx+1}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            # === 2. Hand Detection ===
            hand_results = hands.process(rgb)
            if hand_results.multi_hand_landmarks:
                for hand in hand_results.multi_hand_landmarks:
                    mp_draw.draw_landmarks(frame, hand, mp_hands.HAND_CONNECTIONS)
                cv2.putText(frame, "Gesture Ready", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

            # === 3. YOLO Object Detection ===
            yolo_model = _get_yolo_model()
            results = yolo_model(frame, stream=True)
            for r in results:
                boxes = r.boxes
                for box in boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    conf = box.conf[0]
                    cls = int(box.cls[0])
                    label = f"{yolo_model.names[cls]} {conf:.2f}"
                    color = (0, 255, 255)  # Yellow
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            # === Show frame ===
            callback(frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    cap.release()
