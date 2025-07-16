import os
import csv

class CheckInDataHandler:
    def __init__(self, checkin_folder):
        self.checkin_folder = checkin_folder

    def create_check_in_file(self, check_in_file, user_id, check_in_time):
        """
        Tạo mới hoặc thêm dữ liệu điểm danh vào tệp

        Tham số:
            check_in_file (str): Đường dẫn đến tệp điểm danh
            user_id (str): ID của người đó
            check_in_time (str): Thời gian người đó điểm danh
        """
        if not os.path.exists(check_in_file):
            with open(check_in_file, mode='w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(["UserID", "CheckInTime"])

        with open(check_in_file, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([user_id, check_in_time])
            

    def get_last_check_in_time(self, user_id):
        file_path = self.get_check_in_file_path(user_id)
        last_time = None
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                for line in reversed(lines):
                    if line.strip() and not line.startswith("UserID"):
                        parts = line.strip().split(",")
                        if parts[0] == str(user_id):
                            last_time = parts[1]
                            break
        except Exception:
            pass
        return last_time
    
    def get_check_in_file_path(self, user_id):
        return os.path.join(self.checkin_folder, f"{user_id}_check_in.csv")
