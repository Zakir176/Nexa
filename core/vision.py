# core/vision.py
import cv2
import mediapipe as mp
from config.settings import Config

mp_face = mp.solutions.face_detection
mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils

def scan_environment(callback):
    cap = cv2.VideoCapture(Config.CAMERA_ID)
    with mp_face.FaceDetection(min_detection_confidence=Config.CONFIDENCE_FACE) as face_det, \
         mp_hands.Hands(min_detection_confidence=Config.CONFIDENCE_HAND) as hands:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: break
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Faces
            faces = face_det.process(rgb)
            if faces.detections:
                for idx, d in enumerate(faces.detections):
                    mp_draw.draw_detection(frame, d)
                    bbox = d.location_data.relative_bounding_box
                    h, w, _ = frame.shape
                    x, y = int(bbox.xmin * w), int(bbox.ymin * h)
                    cv2.putText(frame, f"Human {idx+1}", (x, y-10),
                                cv2.FONT_HERSHEY_TRIPLEX, 0.8, (0,255,255), 2)

            # Hands
            hands_res = hands.process(rgb)
            if hands_res.multi_hand_landmarks:
                for hand in hands_res.multi_hand_landmarks:
                    mp_draw.draw_landmarks(frame, hand, mp_hands.HAND_CONNECTIONS)
                cv2.putText(frame, "Gesture Detected", (50, 50),
                            cv2.FONT_HERSHEY_TRIPLEX, 1, (0,0,255), 2)

            callback(frame)
            if cv2.waitKey(1) == 27: break
    cap.release()