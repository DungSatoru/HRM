# face_recognition_module.py - Face detection and recognition functionality
import face_recognition
import numpy as np
import cv2
from ultralytics import YOLO

class FaceRecognizer:
    def __init__(self, encoding_file, yolo_model_path):
        """
        Initialize the face recognition system
        
        Args:
            encoding_file (str): Path to the file containing face encodings
            yolo_model_path (str): Path to the YOLOv8 face detection model
        """
        self.names, self.encodings = self._load_encoding_file(encoding_file)
        self.model = YOLO(yolo_model_path)
        print(f"Loaded {len(self.names)} face profiles")
    
    def _load_encoding_file(self, file_path):
        """
        Load face encodings from a text file
        
        Args:
            file_path (str): Path to the encoding file
            
        Returns:
            tuple: (list of names, list of encodings)
        """
        names = []
        encodings = []

        with open(file_path, 'r') as file:
            lines = file.readlines()

        current_name = None
        current_encoding = []

        for line in lines:
            parts = line.strip().split(': ')

            if len(parts) == 2:
                if current_name is not None:
                    names.append(current_name)
                    encodings.append(current_encoding)

                current_name = parts[0]
                current_encoding = [float(value) for value in parts[1][1:-1].replace(']', '').split()]
            elif current_name is not None:
                current_encoding.extend([float(value) for value in line.strip().replace(']', '').split()])

        if current_name is not None:
            names.append(current_name)
            encodings.append(current_encoding)

        return names, encodings
    
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
    
    def recognize_faces(self, frame):
        """
        Recognize faces in a frame
        
        Args:
            frame (numpy.ndarray): The frame to process
            
        Returns:
            list: List of tuples (name, face_location)
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = self.detect_faces(frame)
        
        if not face_locations:
            return []
            
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        recognized_faces = []
        
        for face_location, face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(self.encodings, face_encoding)
            name = "Unknown"
            
            if True in matches:
                best_match_index = np.argmin(face_recognition.face_distance(self.encodings, face_encoding))
                name = self.names[best_match_index]
            
            recognized_faces.append((name, face_location))
        
        return recognized_faces