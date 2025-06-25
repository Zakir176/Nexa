# backend/app/services/vision_service.py
import cv2
import time
import base64
import asyncio
import threading
import logging
from typing import Callable, Optional, Dict, Any, List
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class VisionService:
    def __init__(self):
        self._yolo_model = None
        self._is_scanning: bool = False
        self._stop_event = threading.Event()
        self._scan_thread: Optional[threading.Thread] = None

    def _get_yolo(self):
        if self._yolo_model is None:
            try:
                from ultralytics import YOLO
                logger.info("Loading YOLOv8 model (yolov8n.pt)...")
                self._yolo_model = YOLO("yolov8n.pt")
            except Exception as e:
                logger.error(f"YOLOv8 loading failed: {e}")
                return None
        return self._yolo_model

    def start_scan(self, frame_callback: Callable[[str, Dict[str, Any]], None], duration: int = 30):
        if self._is_scanning:
            self.stop_scan()
        
        self._is_scanning = True
        self._stop_event.clear()
        
        def run():
            start_time = time.time()
            cap = cv2.VideoCapture(settings.CAMERA_ID)
            if not cap.isOpened():
                logger.error(f"Cannot open camera index {settings.CAMERA_ID}")
                self._is_scanning = False
                return

            try:
                import mediapipe as mp
                mp_face = mp.solutions.face_detection
                mp_hands = mp.solutions.hands
                mp_draw = mp.solutions.drawing_utils

                yolo = self._get_yolo()
                with mp_face.FaceDetection(min_detection_confidence=settings.CONFIDENCE_FACE) as face_det, \
                     mp_hands.Hands(min_detection_confidence=settings.CONFIDENCE_HAND, max_num_hands=2) as hands_det:
                    
                    while cap.isOpened() and self._is_scanning and not self._stop_event.is_set():
                        if time.time() - start_time > duration:
                            break

                        ret, frame = cap.read()
                        if not ret:
                            break

                        h, w, _ = frame.shape
                        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                        detections_summary: List[str] = []

                        # 1. Face Detection
                        face_results = face_det.process(rgb)
                        if face_results.detections:
                            for idx, d in enumerate(face_results.detections):
                                mp_draw.draw_detection(frame, d)
                                detections_summary.append(f"Human Face #{idx+1}")

                        # 2. Hand Detection
                        hand_results = hands_det.process(rgb)
                        if hand_results.multi_hand_landmarks:
                            for hand in hand_results.multi_hand_landmarks:
                                mp_draw.draw_landmarks(frame, hand, mp_hands.HAND_CONNECTIONS)
                            detections_summary.append("Hand Gesture")

                        # 3. YOLO Object Detection
                        if yolo:
                            yolo_results = yolo(frame, stream=True, verbose=False)
                            for r in yolo_results:
                                for box in r.boxes:
                                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                                    conf = float(box.conf[0])
                                    cls_id = int(box.cls[0])
                                    label_name = yolo.names[cls_id]
                                    label_str = f"{label_name} {conf:.2f}"
                                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 255), 2)
                                    cv2.putText(frame, label_str, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
                                    detections_summary.append(label_name)

                        # Encode frame as JPEG base64
                        _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 75])
                        frame_b64 = base64.b64encode(buffer).decode('utf-8')
                        
                        metadata = {
                            "detected_items": list(set(detections_summary)),
                            "count": len(detections_summary),
                            "timestamp": time.time()
                        }

                        frame_callback(frame_b64, metadata)
                        time.sleep(0.03) # ~30fps throttle
            except Exception as e:
                logger.error(f"Vision scan execution error: {e}", exc_info=True)
            finally:
                cap.release()
                self._is_scanning = False

        self._scan_thread = threading.Thread(target=run, daemon=True)
        self._scan_thread.start()

    def stop_scan(self):
        self._stop_event.set()
        self._is_scanning = False

vision_service = VisionService()
