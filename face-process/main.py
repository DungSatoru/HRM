#  python main.py --ip 192.168.137.252 --user admin --password L23F65D3
import argparse
from src.face_recognition.face_recognizer import FaceRecognizer
from src.attendance.attendance_tracker import AttendanceTracker
from src.video.video_module import VideoProcessor
from src.utils.utils import create_directory


def main():
    parser = argparse.ArgumentParser(description="Face Recognition Attendance System")
    parser.add_argument('--ip', required=False, help="Camera IP address (e.g., 192.168.137.252)")
    parser.add_argument('--user', required=False, help="Camera username")
    parser.add_argument('--password', required=False, help="Camera password")
    args = parser.parse_args()
    
    encoding_file = r"data\encodings.txt"
    yolo_model_path = r"data\yolov8n-face.pt"
    checkin_folder = r"src\attendance\checkin"
    frame_resize_width = 640
    recognition_interval = 25
    check_in_cooldown = 600  # 10 phút (600 giây)

    create_directory(checkin_folder)

    face_recognizer = FaceRecognizer(encoding_file, yolo_model_path)
    attendance_tracker = AttendanceTracker(checkin_folder, check_in_cooldown)
    
    if args.ip and args.user and args.password:
        rtsp_url = f"rtsp://{args.user}:{args.password}@{args.ip}:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif"
        video_source = rtsp_url
    else:
        print("[INFO] Không có IP hoặc thông tin đăng nhập, dùng webcam.")
        video_source = 0 
    
    video_processor = VideoProcessor(
        rtsp_url=video_source,
        face_recognizer=face_recognizer,
        attendance_tracker=attendance_tracker,
        frame_resize_width=frame_resize_width,
        recognition_interval=recognition_interval
    )

    try:
        video_processor.start()
    except KeyboardInterrupt:
        print("Application terminated by user")
    finally:
        video_processor.stop()
        print("Application closed successfully")

if __name__ == "__main__":
    main()