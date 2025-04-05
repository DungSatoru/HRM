# video_module.py - Video processing functionality
import cv2
import time

class VideoProcessor:
    def __init__(self, rtsp_url, face_recognizer, attendance_tracker, 
                 frame_resize_width=640, recognition_interval=25):
        """
        Initialize the video processor
        
        Args:
            rtsp_url (str): RTSP URL for video stream
            face_recognizer (FaceRecognizer): Face recognition module
            attendance_tracker (AttendanceTracker): Attendance tracking module
            frame_resize_width (int): Width to resize frames to
            recognition_interval (int): Process every N frames
        """
        self.rtsp_url = rtsp_url
        self.face_recognizer = face_recognizer
        self.attendance_tracker = attendance_tracker
        self.frame_resize_width = frame_resize_width
        self.recognition_interval = recognition_interval
        self.cap = None
        self.running = False
        self.frame_count = 0
    
    def _initialize_capture(self):
        """Initialize or reinitialize the video capture"""
        if self.cap is not None:
            self.cap.release()
            
        self.cap = cv2.VideoCapture(self.rtsp_url)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        if not self.cap.isOpened():
            print("Error: Could not open RTSP stream.")
            return False
        return True
    
    def _process_frame(self, frame):
        """
        Process a single frame
        
        Args:
            frame (numpy.ndarray): The frame to process
            
        Returns:
            numpy.ndarray: The processed frame
        """
        self.frame_count += 1
        
        # Only process every Nth frame for efficiency
        if self.frame_count % self.recognition_interval == 0:
            recognized_faces = self.face_recognizer.recognize_faces(frame)
            
            for name, face_location in recognized_faces:
                # Record attendance if person is recognized
                if name != "Unknown":
                    self.attendance_tracker.record_attendance(name)
                
                # Draw bounding box and name on frame
                top, right, bottom, left = face_location
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(frame, name, (left, top - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        return frame
    
    def start(self):
        """Start video processing"""
        self.running = True
        self._initialize_capture()
        
        while self.running:
            ret, frame = self.cap.read()
            
            if not ret:
                print("Failed to grab frame. Reconnecting...")
                time.sleep(0.5)
                if not self._initialize_capture():
                    continue
                continue
            
            # Resize frame to improve performance
            height, width = frame.shape[:2]
            new_height = int(self.frame_resize_width * height / width)
            frame = cv2.resize(frame, (self.frame_resize_width, new_height))
            
            # Process the frame
            processed_frame = self._process_frame(frame)
            
            # Display the frame
            cv2.imshow('Live Recognition', processed_frame)
            
            # Check for exit key
            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.stop()
                break
    
    def stop(self):
        """Stop video processing and release resources"""
        self.running = False
        if self.cap is not None:
            self.cap.release()
        cv2.destroyAllWindows()
        print("Video processing stopped.")