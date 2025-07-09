# face_recognizer.py
import cv2
from .face_detector import FaceDetector
from .encoding_loader import EncodingLoader, EncodingHelper
import face_recognition
import numpy as np
# EncodingHelper.save_face_encoding("john", vector, db_config)
# names, encodings = EncodingHelper.load_face_encodings(db_config)


# db_config = {
#     'host': 'localhost',
#     'user': 'root',
#     'password': '',
#     'database': 'hr_management',
#     'port': 3306
# }
db_config = {
    'host': '192.168.0.103',
    'user': 'dunghq',
    'password': '123456',
    'database': 'hr_management',
    'port': 3306
}

class FaceRecognizer:
    def __init__(self, encoding_file, yolo_model_path):
        # self.face_ids, self.encodings = EncodingLoader.load_encoding_file(encoding_file)
        self.face_ids, self.encodings = EncodingHelper.load_face_encodings(db_config)
        self.face_detector = FaceDetector(yolo_model_path)
        self.tolerance = 0.35 
        print(f"Loaded {len(self.face_ids)} face profiles")
    
    def calculate_confidence(self, face_distance):
        """
        Tính độ tin cậy từ khoảng cách khuôn mặt
        Trả về giá trị từ 0-100 (percentage)
        """
        if face_distance > 1.0:
            return 0.0
        
        confidence = max(0.0, (1.0 - face_distance) * 100)
        return round(confidence, 1)
    
    def recognize_faces(self, frame):
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = self.face_detector.detect_faces(frame) # Sử dụng model YOLO để phát hiện khuôn mặt
        # face_locations = face_recognition.face_locations(frame) # Sử dụng face_recognition để phát hiện khuôn mặt 
        
        if not face_locations:
            return []
        
        # Kiểm tra nếu không có encodings để so sánh
        if len(self.encodings) == 0:
            return [("Unknown", face_location, 0.0) for face_location in face_locations]
            
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        recognized_faces = []
        
        for face_location, face_encoding in zip(face_locations, face_encodings):
            # Tính khoảng cách với tất cả encodings đã biết
            distances = face_recognition.face_distance(self.encodings, face_encoding)
            
            # Tìm khoảng cách nhỏ nhất
            best_match_index = np.argmin(distances)
            best_distance = distances[best_match_index]
            
            # Tính độ tin cậy
            confidence = self.calculate_confidence(best_distance)
            
            # Xác định tên dựa trên tolerance
            face_id = "Unknown"
            if best_distance <= self.tolerance:
                face_id = self.face_ids[best_match_index]
                
            recognized_faces.append((face_id, face_location, confidence))
        
        return recognized_faces