import cv2
import time
import math

class VideoProcessor:
    def __init__(self, rtsp_url, face_recognizer, attendance_tracker, 
                 frame_resize_width=640, recognition_interval=25):
        self.rtsp_url = rtsp_url
        self.face_recognizer = face_recognizer
        self.attendance_tracker = attendance_tracker
        self.frame_resize_width = frame_resize_width
        self.recognition_interval = recognition_interval
        self.cap = None
        self.running = False
        self.frame_count = 0
        self.recognized_faces_cache = []  # (face_id, location)
        self.recent_face_centers = {}  # {face_id: [(x, y), ...]}
        self.max_history = 3
        self.position_threshold = 100 # Ngưỡng khoảng cách để xác định khuôn mặt ổn định 100px

    def _initialize_capture(self):
        if self.cap is not None:
            self.cap.release()
        self.cap = cv2.VideoCapture(self.rtsp_url)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        if not self.cap.isOpened():
            print("Lỗi: Không thể mở luồng RTSP.")
            return False
        return True

    def _euclidean(self, p1, p2):
        return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

    def _is_stable(self, centers):
        if len(centers) < 3:
            return False
        d1 = self._euclidean(centers[0], centers[1])
        d2 = self._euclidean(centers[1], centers[2])
        d3 = self._euclidean(centers[0], centers[2])
        return d1 < self.position_threshold and d2 < self.position_threshold and d3 < self.position_threshold

    def _process_frame(self, frame):
        self.frame_count += 1

        # Nhận diện mỗi N frame
        if self.frame_count % self.recognition_interval == 0:
            recognized_faces = self.face_recognizer.recognize_faces(frame)
            self.recognized_faces_cache = recognized_faces  # Cập nhật cache

            for face_id, face_location, confidence in recognized_faces:
                if face_id != "Unknown":
                    top, right, bottom, left = face_location
                    center = ((left + right) // 2, (top + bottom) // 2)

                    if face_id not in self.recent_face_centers:
                        self.recent_face_centers[face_id] = []
                    self.recent_face_centers[face_id].append(center)

                    if len(self.recent_face_centers[face_id]) > self.max_history:
                        self.recent_face_centers[face_id].pop(0)

                    if self._is_stable(self.recent_face_centers[face_id]):
                        # if self.attendance_tracker.can_check_in(face_id):
                            self.attendance_tracker.record_attendance(face_id)

        # Luôn vẽ kết quả nhận diện gần nhất
        for face_id, face_location, confidence  in self.recognized_faces_cache:
            top, right, bottom, left = face_location
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            label = f"{face_id} ({confidence}%)"
            cv2.putText(frame, label, (left, top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        return frame

    def start(self):
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

            height, width = frame.shape[:2]
            new_height = int(self.frame_resize_width * height / width)
            frame = cv2.resize(frame, (self.frame_resize_width, new_height))

            processed_frame = self._process_frame(frame)

            cv2.imshow('Realtime recognition', processed_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.stop()
                break

    def stop(self):
        self.running = False
        if self.cap is not None:
            self.cap.release()
        cv2.destroyAllWindows()
        print("Đã dừng xử lý video.")
