# face_detector.py
from ultralytics import YOLO

class FaceDetector:
    def __init__(self, yolo_model_path):
        """
        Initialize the face detection model
        
        Args:
            yolo_model_path (str): Path to the YOLOv8 face detection model
        """
        self.model = YOLO(yolo_model_path)

    def detect_faces(self, frame):
        """
        Detect faces in a frame using YOLOv8
        
        Args:
            frame (numpy.ndarray): The frame to process
            
        Returns:
            list: List of face locations in (top, right, bottom, left) format
        """
        results = self.model(frame)
        faces = []
        
        for r in results:
            for box in r.boxes.xyxy:
                x1, y1, x2, y2 = map(int, box)
                faces.append((y1, x2, y2, x1))  # Convert to format compatible with face_recognition
        
        return faces
