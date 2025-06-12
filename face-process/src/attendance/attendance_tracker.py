import time
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

    def _should_record_attendance(self, user_id):
        """
        Kiểm tra xem có nên ghi nhận điểm danh cho người này dựa trên khoảng thời gian chờ hay không
        """
        current_time = time.time()
        # Lấy thời gian check-in cuối cùng của user từ file
        last_check_in_time = self.data_handler.get_last_check_in_time(user_id)
        check_in_file = self.data_handler.get_check_in_file_path(user_id)
        
        if last_check_in_time:
            try:
                last_check_in_time = time.strptime(last_check_in_time, "%Y-%m-%d %H:%M:%S")
                last_check_in_time = time.mktime(last_check_in_time)
                if current_time - last_check_in_time < self.cooldown_time:
                    print(f"{user_id} đã điểm danh trong vòng {self.cooldown_time/60} phút qua.")
                    return False, check_in_file
            except (ValueError, TypeError):
                pass
        return True, check_in_file

    # def can_check_in(self, user_id):
    #     """
    #     Kiểm tra xem người này có thể điểm danh không, dựa trên thời gian cooldown
        
    #     Tham số:
    #         user_id (str): Tên của người đó
        
    #     Trả về:
    #         bool: True nếu người đó có thể điểm danh, False nếu không
    #     """
    #     should_record, check_in_file = self._should_record_attendance(user_id)
    #     return should_record

    def record_attendance(self, user_id):
        """
        Ghi nhận điểm danh cho người đã nhận diện
        
        Tham số:
            user_id (str): Tên của người được nhận diện
            
        Trả về:
            bool: True nếu điểm danh thành công, False nếu không
        """
        # Nếu là người lạ (Unknown), không thực hiện điểm danh
        if user_id == "Unknown":
            return False
            
        should_record, check_in_file = self._should_record_attendance(user_id)
        
        if should_record:
            check_in_time = time.strftime("%Y-%m-%d %H:%M:%S")
            # Tạo tệp và thêm header nếu chưa tồn tại
            self.data_handler.create_check_in_file(check_in_file, user_id, check_in_time)
            # Gửi thông tin điểm danh lên server
            self.websocket_client.send_attendance_to_server(user_id)
            print(f"{user_id} đã điểm danh vào lúc {check_in_time}.")
            return True
            
        return False
