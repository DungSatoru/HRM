# face_detector.py
from ultralytics import YOLO

class FaceDetector:
    def __init__(self, yolo_model_path):
        self.model = YOLO(yolo_model_path)

    def detect_faces(self, frame):
        results = self.model(frame)
        faces = []
        
        for r in results:
            for box in r.boxes.xyxy:
                x1, y1, x2, y2 = map(int, box)
                faces.append((y1, x2, y2, x1))  
        
        return faces
