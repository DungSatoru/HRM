# # video_module.py - Video processing functionality
# import cv2
# import time

# class VideoProcessor:
#     def __init__(self, rtsp_url, face_recognizer, attendance_tracker, 
#                  frame_resize_width=640, recognition_interval=25):
#         """
#         Initialize the video processor
        
#         Args:
#             rtsp_url (str): RTSP URL for video stream
#             face_recognizer (FaceRecognizer): Face recognition module
#             attendance_tracker (AttendanceTracker): Attendance tracking module
#             frame_resize_width (int): Width to resize frames to
#             recognition_interval (int): Process every N frames
#         """
#         self.rtsp_url = rtsp_url
#         self.face_recognizer = face_recognizer
#         self.attendance_tracker = attendance_tracker
#         self.frame_resize_width = frame_resize_width
#         self.recognition_interval = recognition_interval
#         self.cap = None
#         self.running = False
#         self.frame_count = 0
    
#     def _initialize_capture(self):
#         """Initialize or reinitialize the video capture"""
#         if self.cap is not None:
#             self.cap.release()
            
#         self.cap = cv2.VideoCapture(self.rtsp_url)
#         self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
#         if not self.cap.isOpened():
#             print("Error: Could not open RTSP stream.")
#             return False
#         return True
    
#     def _process_frame(self, frame):
#         """
#         Process a single frame
        
#         Args:
#             frame (numpy.ndarray): The frame to process
            
#         Returns:
#             numpy.ndarray: The processed frame
#         """
#         self.frame_count += 1
        
#         # Only process every Nth frame for efficiency
#         if self.frame_count % self.recognition_interval == 0:
#             recognized_faces = self.face_recognizer.recognize_faces(frame)
            
#             for name, face_location in recognized_faces:
#                 # Record attendance if person is recognized
#                 if name != "Unknown":
#                     self.attendance_tracker.record_attendance(name)
                
#                 # Draw bounding box and name on frame
#                 top, right, bottom, left = face_location
#                 cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
#                 cv2.putText(frame, name, (left, top - 10), 
#                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
#         return frame
    
#     def start(self):
#         """Start video processing"""
#         self.running = True
#         self._initialize_capture()
        
#         while self.running:
#             ret, frame = self.cap.read()
            
#             if not ret:
#                 print("Failed to grab frame. Reconnecting...")
#                 time.sleep(0.5)
#                 if not self._initialize_capture():
#                     continue
#                 continue
            
#             # Resize frame to improve performance
#             height, width = frame.shape[:2]
#             new_height = int(self.frame_resize_width * height / width)
#             frame = cv2.resize(frame, (self.frame_resize_width, new_height))
            
#             # Process the frame
#             processed_frame = self._process_frame(frame)
            
#             # Display the frame
#             cv2.imshow('Live Recognition', processed_frame)
            
#             # Check for exit key
#             if cv2.waitKey(1) & 0xFF == ord('q'):
#                 self.stop()
#                 break
    
#     def stop(self):
#         """Stop video processing and release resources"""
#         self.running = False
#         if self.cap is not None:
#             self.cap.release()
#         cv2.destroyAllWindows()
#         print("Video processing stopped.")

import cv2
import time

class VideoProcessor:
    def __init__(self, rtsp_url, face_recognizer, attendance_tracker, 
                 frame_resize_width=640, recognition_interval=25):
        """
        Khởi tạo bộ xử lý video
        
        Tham số:
            rtsp_url (str): URL RTSP của luồng video
            face_recognizer (FaceRecognizer): Module nhận diện khuôn mặt
            attendance_tracker (AttendanceTracker): Bộ theo dõi điểm danh
            frame_resize_width (int): Độ rộng để thay đổi kích thước khung hình
            recognition_interval (int): Xử lý mỗi N khung hình
        """
        self.rtsp_url = rtsp_url
        self.face_recognizer = face_recognizer
        self.attendance_tracker = attendance_tracker
        self.frame_resize_width = frame_resize_width
        self.recognition_interval = recognition_interval
        self.cap = None
        self.running = False
        self.frame_count = 0
        self.recent_names = []  # Danh sách tên nhận diện gần đây

    def _initialize_capture(self):
        """Khởi tạo hoặc tái khởi tạo bộ bắt video"""
        if self.cap is not None:
            self.cap.release()
            
        self.cap = cv2.VideoCapture(self.rtsp_url)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        if not self.cap.isOpened():
            print("Lỗi: Không thể mở luồng RTSP.")
            return False
        return True
    
    def _process_frame(self, frame):
        """
        Xử lý một khung hình
        
        Tham số:
            frame (numpy.ndarray): Khung hình cần xử lý
            
        Trả về:
            numpy.ndarray: Khung hình đã xử lý
        """
        self.frame_count += 1
        
        # Chỉ xử lý mỗi N khung hình để tiết kiệm tài nguyên
        if self.frame_count % self.recognition_interval == 0:
            recognized_faces = self.face_recognizer.recognize_faces(frame)
            
            for name, face_location in recognized_faces:
                # Ghi nhận điểm danh nếu nhận diện được người
                if name != "Unknown":
                    # Lưu các tên nhận diện gần đây (để kiểm tra 3 lần liên tiếp)
                    self.recent_names.append(name)
                    if len(self.recent_names) > 3:
                        self.recent_names.pop(0)
                    
                    # Nếu tên xuất hiện 3 lần liên tiếp và có thể điểm danh, ghi nhận điểm danh
                    if self.recent_names.count(name) == 3 and self.attendance_tracker.can_check_in(name):
                        self.attendance_tracker.record_attendance(name)
                
                # Vẽ hộp giới hạn và tên lên khung hình
                top, right, bottom, left = face_location
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(frame, name, (left, top - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        return frame
    
    def start(self):
        """Bắt đầu xử lý video"""
        self.running = True
        self._initialize_capture()
        
        while self.running:
            ret, frame = self.cap.read()
            
            if not ret:
                print("Không lấy được khung hình. Đang kết nối lại...")
                time.sleep(0.5)
                if not self._initialize_capture():
                    continue
                continue
            
            # Thay đổi kích thước khung hình để tăng hiệu suất
            height, width = frame.shape[:2]
            new_height = int(self.frame_resize_width * height / width)
            frame = cv2.resize(frame, (self.frame_resize_width, new_height))
            
            # Xử lý khung hình
            processed_frame = self._process_frame(frame)
            
            # Hiển thị khung hình
            cv2.imshow('Realtime recognition', processed_frame)
            
            # Kiểm tra xem người dùng có nhấn phím thoát hay không
            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.stop()
                break
    
    def stop(self):
        """Dừng xử lý video và giải phóng tài nguyên"""
        self.running = False
        if self.cap is not None:
            self.cap.release()
        cv2.destroyAllWindows()
        print("Đã dừng xử lý video.")
