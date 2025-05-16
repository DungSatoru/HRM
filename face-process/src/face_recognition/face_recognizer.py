# face_recognizer.py
import cv2
from .face_detector import FaceDetector
from .encoding_loader import EncodingLoader
import face_recognition
import numpy as np

class FaceRecognizer:
    def __init__(self, encoding_file, yolo_model_path):
        """
        Initialize the face recognition system
        
        Args:
            encoding_file (str): Path to the file containing face encodings
            yolo_model_path (str): Path to the YOLOv8 face detection model
        """
        self.names, self.encodings = EncodingLoader.load_encoding_file(encoding_file)
        self.face_detector = FaceDetector(yolo_model_path)
        print(f"Loaded {len(self.names)} face profiles")
    
    def recognize_faces(self, frame):
        """
        Recognize faces in a frame
        
        Args:
            frame (numpy.ndarray): The frame to process
            
        Returns:
            list: List of tuples (name, face_location)
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        # face_locations = self.face_detector.detect_faces(frame)
        face_locations = face_recognition.face_locations(frame)
        
        if not face_locations:
            return []
            
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        recognized_faces = []
        
        for face_location, face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(self.encodings, face_encoding, tolerance=0.45)
            name = "Unknown"
            
            if True in matches:
                best_match_index = np.argmin(face_recognition.face_distance(self.encodings, face_encoding))
                name = self.names[best_match_index]
            
            recognized_faces.append((name, face_location))
        
        return recognized_faces
