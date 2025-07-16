import csv
import random
from datetime import datetime, timedelta

# Danh sách ID nhân viên
user_ids = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18] 

# Thời gian bắt đầu và kết thúc
start_date = datetime(2025, 7, 1)
end_date = datetime(2025, 7, 17)

# Hàm tạo thời gian check-in random từ 7:50 đến 9:20
def random_check_in():
    hour = 7 + random.randint(0, 1)
    minute = 50 if hour == 7 else random.randint(0, 20)
    return f"{hour:02d}:{minute:02d}:00"

# Hàm tạo thời gian check-out random từ 17:00 đến 23:00
def random_check_out():
    # hour = random.randint(17, 23)
    # minute = random.randint(0, 59)
    hour = 17
    minute = 0
    return f"{hour:02d}:{minute:02d}:00"

# Tạo danh sách dữ liệu
records = []
attendance_id = 1
current_date = start_date

while current_date <= end_date:
    if current_date.weekday() < 5:  # Bỏ qua Thứ 7 (5), Chủ nhật (6)
        for user_id in user_ids:
            check_in = random_check_in()
            check_out = random_check_out()
            records.append([
                attendance_id,
                user_id,
                current_date.strftime('%Y-%m-%d'),
                check_in,
                check_out
            ])
            attendance_id += 1
    current_date += timedelta(days=1)

# Ghi vào file CSV
with open('attendance_generated.csv', mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['attendance_id', 'user_id', 'date', 'check_in', 'check_out'])
    writer.writerows(records)

print("✅ File attendance_generated.csv đã được tạo.")


import csv
import pymysql

conn = pymysql.connect(host='localhost', user='root', password='', db='hr_management', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
cursor = conn.cursor()

with open('attendance_generated.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        cursor.execute(
            "INSERT INTO attendances (user_id, date, check_in, check_out) VALUES (%s, %s, %s, %s)",
            (row['user_id'], row['date'], row['check_in'], row['check_out'])
        )

conn.commit()
conn.close()
print("✅ Dữ liệu đã được chèn vào bảng attendances trong cơ sở dữ liệu.")