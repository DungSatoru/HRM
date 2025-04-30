# checkin_data_handler.py
import os
import csv

class CheckInDataHandler:
    def __init__(self, checkin_folder):
        self.checkin_folder = checkin_folder

    def load_check_in_data(self, name):
        """
        Tải dữ liệu điểm danh cho một người cụ thể

        Tham số:
            name (str): Tên của người đó

        Trả về:
            tuple: (dict chứa dữ liệu điểm danh, đường dẫn đến tệp điểm danh)

        """
        check_in_data = {}
        check_in_file = os.path.join(self.checkin_folder, f"{name}_check_in.csv")

        if os.path.exists(check_in_file):
            with open(check_in_file, mode='r') as file:
                reader = csv.reader(file)
                try:
                    next(reader)
                except StopIteration:
                    pass
                
                for row in reader:
                    if len(row) >= 2:
                        name, check_in_time = row
                        check_in_data[name] = check_in_time

        return check_in_data, check_in_file

    def create_check_in_file(self, check_in_file, name, check_in_time):
        """
        Tạo mới hoặc thêm dữ liệu điểm danh vào tệp

        Tham số:
            check_in_file (str): Đường dẫn đến tệp điểm danh
            name (str): Tên của người đó
            check_in_time (str): Thời gian người đó điểm danh
        """
        if not os.path.exists(check_in_file):
            with open(check_in_file, mode='w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(["Name", "CheckInTime"])
        
        with open(check_in_file, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([name, check_in_time])
