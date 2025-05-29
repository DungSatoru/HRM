#  python main.py --ip 192.168.0.117 --user admin --password L23F65D3
# main.py - Main application file
import os, sys
import time
import cv2
import argparse
from src.face_recognition.face_recognizer import FaceRecognizer
from src.attendance.attendance_tracker import AttendanceTracker
from src.video.video_module import VideoProcessor
from src.utils.utils import create_directory

# Thêm thư mục gốc của project vào sys.path

def main():
    parser = argparse.ArgumentParser(description="Face Recognition Attendance System")
    parser.add_argument('--ip', required=True, help="Camera IP address (e.g., 192.168.0.108)")
    parser.add_argument('--user', required=True, help="Camera username")
    parser.add_argument('--password', required=True, help="Camera password")
    args = parser.parse_args()
    
    # Configuration parameters
    rtsp_url = f"rtsp://{args.user}:{args.password}@{args.ip}:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif"

    # rtsp_url = "rtsp://admin:L23F65D3@192.168.0.108:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif"
    encoding_file = r"data\encodings.txt"
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