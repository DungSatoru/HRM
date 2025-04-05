# main.py - Main application file
import os, sys
import time
import cv2
from src.face_recognition.face_recognizer import FaceRecognizer
from src.attendance.attendance_tracker import AttendanceTracker
from src.video.video_module import VideoProcessor
from src.utils.utils import create_directory

# Thêm thư mục gốc của project vào sys.path

def main():
    # Configuration parameters
    encoding_file = r"data\encodings.txt"
    rtsp_url = "rtsp://admin:L23F65D3@192.168.2.109:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif"
    yolo_model_path = r"data\yolov8n-face.pt"
    checkin_folder = r"src\attendance\checkin"
    frame_resize_width = 640
    recognition_interval = 25  # Process every 25 frames
    check_in_cooldown = 600  # 10 minutes in seconds
    
    # Create required directories
    create_directory(checkin_folder)
    
    # Initialize modules
    face_recognizer = FaceRecognizer(encoding_file, yolo_model_path)
    attendance_tracker = AttendanceTracker(checkin_folder, check_in_cooldown)
    video_processor = VideoProcessor(
        rtsp_url=rtsp_url,
        face_recognizer=face_recognizer,
        attendance_tracker=attendance_tracker,
        frame_resize_width=frame_resize_width,
        recognition_interval=recognition_interval
    )
    
    # Start video processing
    try:
        video_processor.start()
    except KeyboardInterrupt:
        print("Application terminated by user")
    finally:
        video_processor.stop()
        print("Application closed successfully")

if __name__ == "__main__":
    main()