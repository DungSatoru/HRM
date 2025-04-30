# # attendance_tracker.py
# import os
# import time
# import csv
# from .checkin_data_handler import CheckInDataHandler
# from .websocket_client import WebSocketClient

# class AttendanceTracker:
#     def __init__(self, checkin_folder, cooldown_time=600):
#         """
#         Initialize the attendance tracker
        
#         Args:
#             checkin_folder (str): Path to the folder for storing check-in records
#             cooldown_time (int): Minimum time in seconds between check-ins for the same person
#         """
#         self.checkin_folder = checkin_folder
#         self.cooldown_time = cooldown_time
#         self.data_handler = CheckInDataHandler(self.checkin_folder)
#         self.websocket_client = WebSocketClient()

#     def _should_record_attendance(self, name):
#         """
#         Check if attendance should be recorded for this person based on cooldown period
        
#         Args:
#             name (str): Person's name
            
#         Returns:
#             tuple: (bool indicating if attendance should be recorded, check-in file path)
#         """
#         current_time = time.time()
#         check_in_data, check_in_file = self.data_handler.load_check_in_data(name)
        
#         # Check if person already checked in within cooldown period
#         if name in check_in_data:
#             try:
#                 last_check_in_time = check_in_data[name]
#                 last_check_in_time = time.strptime(last_check_in_time, "%Y-%m-%d %H:%M:%S")
#                 last_check_in_time = time.mktime(last_check_in_time)
                
#                 if current_time - last_check_in_time < self.cooldown_time:
#                     print(f"{name} has already checked in within the last {self.cooldown_time/60} minutes.")
#                     return False, check_in_file
#             except (ValueError, TypeError):
#                 # If there's an error parsing the time, allow check-in
#                 pass
                
#         return True, check_in_file
    
#     def record_attendance(self, name):
#         """
#         Record attendance for a recognized person
        
#         Args:
#             name (str): Name of the recognized person
            
#         Returns:
#             bool: True if attendance was recorded, False otherwise
#         """
#         if name == "Unknown":
#             return False
            
#         should_record, check_in_file = self._should_record_attendance(name)
        
#         if should_record:
#             check_in_time = time.strftime("%Y-%m-%d %H:%M:%S")
#             # Create file with header if it doesn't exist
#             self.data_handler.create_check_in_file(check_in_file, name, check_in_time)
#             self.websocket_client.send_attendance_to_server(name)
#             print(f"{name} checked in at {check_in_time}.")
#             return True
            
#         return False


import os
import time
import csv
from .checkin_data_handler import CheckInDataHandler
from .websocket_client import WebSocketClient

class AttendanceTracker:
    def __init__(self, checkin_folder, cooldown_time=600):
        """
        Khởi tạo bộ theo dõi điểm danh
        
        Tham số:
            checkin_folder (str): Đường dẫn đến thư mục lưu trữ các bản ghi điểm danh
            cooldown_time (int): Thời gian tối thiểu (tính bằng giây) giữa các lần điểm danh của cùng một người
        """
        self.checkin_folder = checkin_folder
        self.cooldown_time = cooldown_time
        self.data_handler = CheckInDataHandler(self.checkin_folder)
        self.websocket_client = WebSocketClient()

    def _should_record_attendance(self, name):
        """
        Kiểm tra xem có nên ghi nhận điểm danh cho người này dựa trên khoảng thời gian chờ hay không

        Tham số:
            name (str): Tên của người đó

        Trả về:
            tuple: (bool cho biết có nên ghi nhận điểm danh hay không, đường dẫn đến tệp điểm danh)
        """
        current_time = time.time()
        check_in_data, check_in_file = self.data_handler.load_check_in_data(name)
        
        # Kiểm tra xem người đó đã điểm danh trong thời gian cooldown hay chưa
        if name in check_in_data:
            try:
                last_check_in_time = check_in_data[name]
                last_check_in_time = time.strptime(last_check_in_time, "%Y-%m-%d %H:%M:%S")
                last_check_in_time = time.mktime(last_check_in_time)
                
                # Nếu thời gian giữa lần điểm danh gần nhất và hiện tại nhỏ hơn thời gian cooldown, không ghi nhận điểm danh
                if current_time - last_check_in_time < self.cooldown_time:
                    print(f"{name} đã điểm danh trong vòng {self.cooldown_time/60} phút qua.")
                    return False, check_in_file
            except (ValueError, TypeError):
                # Nếu có lỗi khi phân tích thời gian, cho phép điểm danh
                pass
                
        return True, check_in_file

    def can_check_in(self, name):
        """
        Kiểm tra xem người này có thể điểm danh không, dựa trên thời gian cooldown
        
        Tham số:
            name (str): Tên của người đó
        
        Trả về:
            bool: True nếu người đó có thể điểm danh, False nếu không
        """
        should_record, check_in_file = self._should_record_attendance(name)
        return should_record

    def record_attendance(self, name):
        """
        Ghi nhận điểm danh cho người đã nhận diện
        
        Tham số:
            name (str): Tên của người được nhận diện
            
        Trả về:
            bool: True nếu điểm danh thành công, False nếu không
        """
        # Nếu là người lạ (Unknown), không thực hiện điểm danh
        if name == "Unknown":
            return False
            
        should_record, check_in_file = self._should_record_attendance(name)
        
        if should_record:
            check_in_time = time.strftime("%Y-%m-%d %H:%M:%S")
            # Tạo tệp và thêm header nếu chưa tồn tại
            self.data_handler.create_check_in_file(check_in_file, name, check_in_time)
            # Gửi thông tin điểm danh lên server
            self.websocket_client.send_attendance_to_server(name)
            print(f"{name} đã điểm danh vào lúc {check_in_time}.")
            return True
            
        return False
