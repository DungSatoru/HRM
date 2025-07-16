import pandas as pd
from datetime import datetime
import random

# Danh sách xã/phường và huyện/quận tại Hà Nội
locations = [
    ("Chi Đông", "Mê Linh"),
    ("Thanh Xuân", "Sóc Sơn"),
    ("Minh Phú", "Sóc Sơn"),
    ("Láng Hạ", "Đống Đa"),
    ("Trung Giã", "Sóc Sơn"),
    ("Kim Hoa", "Mê Linh"),
    ("Thạch Đà", "Mê Linh"),
    ("Quang Minh", "Mê Linh"),
    ("Thanh Lâm", "Mê Linh"),
    ("Phú Lương", "Hà Đông"),
    ("Yên Nghĩa", "Hà Đông"),
    ("Phúc Lợi", "Long Biên"),
    ("Phú Diễn", "Bắc Từ Liêm"),
    ("Xuân Đỉnh", "Bắc Từ Liêm"),
    ("Phúc Thọ", "Phúc Thọ"),
    ("Đông Hội", "Đông Anh"),
    ("Mai Lâm", "Đông Anh"),
    ("Đa Tốn", "Gia Lâm"),
    ("Kiêu Kỵ", "Gia Lâm"),
    ("Tân Triều", "Thanh Trì"),
    ("Ngọc Hồi", "Thanh Trì"),
    ("Vĩnh Quỳnh", "Thanh Trì"),
    ("Tả Thanh Oai", "Thanh Trì"),
    ("Đại Mỗ", "Nam Từ Liêm"),
    ("Mễ Trì", "Nam Từ Liêm"),
    ("Trung Văn", "Nam Từ Liêm"),
    ("Phú Đô", "Nam Từ Liêm"),
    ("Xuân Phương", "Nam Từ Liêm"),
    ("Phương Canh", "Nam Từ Liêm"),
    ("Cầu Diễn", "Nam Từ Liêm"),
    ("Đại Thịnh", "Mê Linh"),
    ("Tiền Phong", "Mê Linh"),
    ("Tráng Việt", "Mê Linh"),
    ("Tam Đồng", "Mê Linh"),
    ("Liên Mạc", "Mê Linh"),
    ("Vạn Yên", "Mê Linh"),
    ("Chu Phan", "Mê Linh"),
    ("Tiến Thịnh", "Mê Linh"),
    ("Mê Linh", "Mê Linh"),
    ("Văn Khê", "Mê Linh"),
    ("Hoàng Kim", "Mê Linh"),
    ("Đông La", "Hoài Đức"),
    ("La Phù", "Hoài Đức"),
    ("An Khánh", "Hoài Đức"),
    ("An Thượng", "Hoài Đức"),
    ("Vân Côn", "Hoài Đức"),
    ("Phú Lãm", "Hà Đông"),
    ("Kiến Hưng", "Hà Đông"),
    ("Dương Nội", "Hà Đông"),
    ("Đồng Mai", "Hà Đông"),
    ("Biên Giang", "Hà Đông"),
    ("Phú Thịnh", "Sơn Tây"),
    ("Ngô Quyền", "Sơn Tây"),
    ("Viên Sơn", "Sơn Tây"),
    ("Đường Lâm", "Sơn Tây"),
    ("Trung Hưng", "Sơn Tây"),
    ("Sơn Lộc", "Sơn Tây"),
    ("Xuân Khanh", "Sơn Tây"),
    ("Kim Sơn", "Sơn Tây"),
    ("Sơn Đông", "Sơn Tây"),
    ("Cổ Đông", "Sơn Tây"),
    ("Phúc Xá", "Ba Đình"),
    ("Trúc Bạch", "Ba Đình"),
    ("Vĩnh Phúc", "Ba Đình"),
    ("Cống Vị", "Ba Đình"),
    ("Liễu Giai", "Ba Đình"),
    ("Nguyễn Trung Trực", "Ba Đình"),
    ("Quán Thánh", "Ba Đình"),
    ("Ngọc Hà", "Ba Đình"),
    ("Điện Biên", "Ba Đình"),
    ("Đội Cấn", "Ba Đình"),
    ("Ngọc Khánh", "Ba Đình"),
    ("Kim Mã", "Ba Đình"),
    ("Giảng Võ", "Ba Đình"),
    ("Thành Công", "Ba Đình"),
    ("Phúc Tân", "Hoàn Kiếm"),
    ("Đồng Xuân", "Hoàn Kiếm"),
    ("Hàng Mã", "Hoàn Kiếm"),
    ("Hàng Buồm", "Hoàn Kiếm"),
    ("Hàng Đào", "Hoàn Kiếm"),
    ("Hàng Bồ", "Hoàn Kiếm"),
    ("Cửa Đông", "Hoàn Kiếm"),
    ("Lý Thái Tổ", "Hoàn Kiếm"),
    ("Hàng Bạc", "Hoàn Kiếm"),
    ("Hàng Gai", "Hoàn Kiếm"),
    ("Chương Dương", "Hoàn Kiếm"),
    ("Hàng Trống", "Hoàn Kiếm"),
    ("Cửa Nam", "Hoàn Kiếm"),
    ("Hàng Bông", "Hoàn Kiếm"),
    ("Tràng Tiền", "Hoàn Kiếm"),
    ("Trần Hưng Đạo", "Hoàn Kiếm"),
    ("Phan Chu Trinh", "Hoàn Kiếm"),
    ("Hàng Bài", "Hoàn Kiếm"),
    ("Phú Thượng", "Tây Hồ"),
    ("Nhật Tân", "Tây Hồ"),
    ("Tứ Liên", "Tây Hồ"),
    ("Quảng An", "Tây Hồ"),
    ("Xuân La", "Tây Hồ"),
    ("Yên Phụ", "Tây Hồ"),
    ("Bưởi", "Tây Hồ"),
    ("Thụy Khuê", "Tây Hồ"),
    ("Thượng Thanh", "Long Biên"),
    ("Ngọc Thụy", "Long Biên"),
    ("Giang Biên", "Long Biên"),
    ("Đức Giang", "Long Biên"),
    ("Việt Hưng", "Long Biên"),
    ("Gia Thụy", "Long Biên"),
    ("Ngọc Lâm", "Long Biên"),
    ("Phúc Lợi", "Long Biên"),
    ("Bồ Đề", "Long Biên"),
    ("Sài Đồng", "Long Biên"),
    ("Long Biên", "Long Biên"),
    ("Thạch Bàn", "Long Biên"),
    ("Phúc Đồng", "Long Biên"),
    ("Cự Khối", "Long Biên"),
    ("Nghĩa Đô", "Cầu Giấy"),
    ("Nghĩa Tân", "Cầu Giấy"),
    ("Mai Dịch", "Cầu Giấy"),
    ("Dịch Vọng", "Cầu Giấy"),
    ("Dịch Vọng Hậu", "Cầu Giấy"),
    ("Quan Hoa", "Cầu Giấy"),
    ("Yên Hòa", "Cầu Giấy"),
    ("Trung Hòa", "Cầu Giấy"),
    ("Cát Linh", "Đống Đa"),
    ("Văn Miếu", "Đống Đa"),
    ("Quốc Tử Giám", "Đống Đa"),
    ("Láng Thượng", "Đống Đa"),
    ("Ô Chợ Dừa", "Đống Đa"),
    ("Văn Chương", "Đống Đa"),
    ("Hàng Bột", "Đống Đa"),
    ("Láng Hạ", "Đống Đa"),
    ("Khâm Thiên", "Đống Đa"),
    ("Thổ Quan", "Đống Đa"),
    ("Nam Đồng", "Đống Đa"),
    ("Trung Phụng", "Đống Đa"),
    ("Quang Trung", "Đống Đa"),
    ("Trung Liệt", "Đống Đa"),
    ("Phương Liên", "Đống Đa"),
    ("Thịnh Quang", "Đống Đa"),
    ("Trung Tự", "Đống Đa"),
    ("Kim Liên", "Đống Đa"),
    ("Phương Mai", "Đống Đa"),
    ("Ngã Tư Sở", "Đống Đa"),
    ("Khương Thượng", "Đống Đa"),
    ("Nguyễn Du", "Hai Bà Trưng"),
    ("Bạch Đằng", "Hai Bà Trưng"),
    ("Phạm Đình Hổ", "Hai Bà Trưng"),
    ("Lê Đại Hành", "Hai Bà Trưng"),
    ("Đồng Nhân", "Hai Bà Trưng"),
    ("Phố Huế", "Hai Bà Trưng"),
    ("Đống Mác", "Hai Bà Trưng"),
    ("Thanh Lương", "Hai Bà Trưng"),
    ("Thanh Nhàn", "Hai Bà Trưng"),
    ("Cầu Dền", "Hai Bà Trưng"),
    ("Bách Khoa", "Hai Bà Trưng"),
]

# Danh sách nhân viên và phòng ban

employees = [
    ("Nguyễn Văn Tú", "Cơ điện"),
    ("Nguyễn Đăng Đại", "Cơ điện"),
    ("Hoàng Thị Yến", "Kinh doanh"),
    ("Bùi Thị Mai", "IT"),
    ("Nguyễn Ngọc Gianh", "Bảo vệ"),
    ("Ngô Thế Anh", "Bảo vệ"),
    ("Nguyễn Văn Hòa", "Cơ điện"),
    ("Nguyễn Văn Minh", "Cơ điện"),
    ("Vũ Hữu Cảnh", "Cơ điện"),
    ("Chu Thị Hồng", "Kinh doanh"),
    ("Nguyễn Văn Thế", "Cơ điện"),
    ("Vũ Xuân Tuyến", "Bảo vệ"),
    ("Nguyễn Thế Hải", "Cải tiến"),
    ("Lê Viết Huy", "Cơ điện"),
    ("Hà Trọng Nam", "Cải tiến"),
    ("Lưu Văn Thế", "Bảo vệ"),
    ("Hoàng Anh Tuấn", "Bảo vệ"),
    ("Trần Trung Nam", "Cơ điện"),
    ("Vũ Trọng Ánh", "Bảo vệ"),
    ("Nguyễn Văn Thuỷ", "Bảo vệ"),
    ("Nguyễn Văn Tịnh", "Bảo vệ"),
    ("Nguyễn Trường Sơn", "Cải tiến"),
    ("Nguyễn Công Trường", "Cơ điện"),
    ("Nguyễn Hoàng Sơn", "Cơ điện"),
    ("Nguyễn Thị Mai Hưởng", "Kinh doanh"),
    ("Hoàng Trung Kiên", "Cơ điện"),
    ("Ngô Thị Lệ", "Kinh doanh"),
    ("Nguyễn Thị Hằng", "Kinh doanh"),
    ("Nguyễn Thị Hoa", "IT"),
    ("Lê Mạnh Tưởng", "IT"),
    ("Nguyễn Văn Duyệt", "Cơ điện"),
    ("Nguyễn Huy Chiến", "Cơ điện"),
    ("Nguyễn Thị Thu", "IT"),
    ("Tạ Thị Huế", "Kinh doanh"),
    ("Nghiêm Ngọc Thanh", "Cơ điện"),
    ("Nguyễn Tiến Dũng", "Cơ điện"),
    ("Nguyễn Văn Huệ", "Cải tiến"),
    ("Nguyễn Văn Thắng", "Cơ điện"),
    ("Đỗ Thu Thủy", "IT"),
    ("Nguyễn Bá Thành", "IT"),
    ("Nguyễn Thị Huế", "Kinh doanh"),
    ("Nguyễn Huy Hoàng", "Cơ điện"),
    ("Nguyễn Anh Đức", "Cơ điện"),
    ("Phạm Thị Bích", "Kinh doanh"),
    ("Vũ Thị Tuyết", "Kinh doanh"),
    ("Nguyễn Thái Thành", "Cải tiến"),
    ("Phạm Tiến Đạt", "Cơ điện"),
    ("Nguyễn Thu Trang", "Kinh doanh"),
    ("Phạm Thị Hà", "IT"),
    ("Nguyễn Thị Thơm", "Kinh doanh"),
    ("Nguyễn Đăng Thà", "Cải tiến"),
    ("Đoàn Thị Hà Ngọc", "IT"),
    ("Nguyễn Thị Phương Thanh", "Kinh doanh"),
    ("Nguyễn Thế Phong", "Cải tiến"),
    ("Trịnh Văn Thuận", "Cải tiến"),
    ("Nguyễn Thị Hồng Nhung", "Bếp ăn"),
    ("Đặng Ngọc Hùng", "Cải tiến"),
    ("Hà Kiều Oanh", "Kinh doanh"),
    ("Ngô Tiến Thành", "IT"),
    ("Nguyễn Ngọc Linh", "Cơ điện"),
    ("Nguyễn Quốc Hùng", "Cơ điện"),
    ("Nguyễn Thị Hương Ly", "Kinh doanh"),
    ("Phạm Hoàng An", "Cơ điện"),
    ("Đỗ Đức Thắng", "Cơ điện"),
    ("Nguyễn Chí Công", "Cơ điện"),
    ("Phạm Trọng Tấn", "Cải tiến"),
    ("Phạm Văn Thành", "Cải tiến"),
    ("Nguyễn Văn Minh", "Cải tiến"),
    ("Nguyễn Ngọc Thanh", "Bảo vệ"),
    ("Nguyễn Quang Lợi", "Cơ điện"),
    ("Nguyễn Anh Tài", "Cơ điện"),
    ("Trần Thị Thanh Huyền", "Kinh doanh"),
    ("Nguyễn Minh Hiếu", "Cơ điện"),
    ("Hạ Quang Dũng", "Cơ điện"),
]

bangiamdoc = [
    ("Nguyễn Văn Hào", "Ban Giám Đốc"),
    ("Trần Thu Thủy", "Ban Giám Đốc"),
    ("Đỗ Văn Tiến", "Ban Giám Đốc"),
]


phongHCNS = [
    ("Nguyễn Văn Doanh", "Hành chính & Nhân sự"),
    ("Nguyễn Ngọc Sơn", "Hành chính & Nhân sự"),
    ("Nguyễn Thị Hà", "Hành chính & Nhân sự"),
    ("Nguyễn Thị Công Lý", "Hành chính & Nhân sự"),
    ("Trần Thị Hiền", "Hành chính & Nhân sự"),
    ("Nguyễn Quỳnh Liên", "Hành chính & Nhân sự"),
    ("Ngô Thị Hồng Duyên", "Hành chính & Nhân sự"),
    ("Nguyễn Thị Hằng", "Hành chính & Nhân sự"),
    ("Dương Thị Ngọc Lan", "Hành chính & Nhân sự"),
    ("Phùng Văn Hào", "Hành chính & Nhân sự")
]


# Bản đồ phòng ban sang ID
department_map = {
    "Ban Giám Đốc": 23,
    "Bảo vệ": 24,
    "Bếp ăn": 25,
    "Cải tiến": 26,
    "Cơ điện": 13,
    "Công nghệ thông tin": 4,
    "Hành chính & Nhân sự": 1,
    "Kho": 28,
    "Kinh doanh": 3,
    "Marketing": 11,
    "Quản lý sản xuất": 27,
    "Sản xuất": 22,
    "Tài chính": 12,
    "IT": 4,  # IT là Công nghệ thông tin
}

# Map phòng ban → tên vị trí
department_position_name_map = {
    "Cơ điện": "Nhân viên kỹ thuật",
    "Kinh doanh": "Nhân viên kinh doanh",
    "IT": ".Net Developer",
    "Bảo vệ": "Bảo vệ",
    "Cải tiến": "Nhân viên cải tiến",
    "Bếp ăn": "Nhân viên bếp",
    "Ban Giám Đốc": "Giám Đốc",
    "Ban Giám Đốc": "Phó Giám Đốc",
}


# Dữ liệu position_id tương ứng
position_map = {
    "Bảo vệ": 26,
    "Business Analyst": 11,
    "Giám Đốc": 24,
    ".Net Developer": 14,
    "Nhân viên bếp": 27,
    "Nhân viên cải tiến": 28,
    "Nhân viên kinh doanh": 1,
    "Nhân viên kỹ thuật": 10,
    "Phó Giám Đốc": 25,
    "Quản lý dự án": 13,
    "Quản lý nhân sự": 17,
    "Tester": 12,
    "Trưởng phòng": 16
}


import unicodedata

def remove_accents(input_str):
    return ''.join(c for c in unicodedata.normalize('NFD', input_str)
                   if unicodedata.category(c) != 'Mn')

def generate_username(full_name: str, year_of_birth: int):
    parts = full_name.strip().split()
    if len(parts) < 2:
        return "user" + str(random.randint(100, 999))
    
    parts = [remove_accents(p).lower() for p in parts]  # bỏ dấu + viết thường
    
    first_name = parts[-1]
    last_initial = parts[0][0] if len(parts) >= 1 else ""
    middle_initial = parts[1][0] if len(parts) >= 3 else ""
    year_suffix = str(year_of_birth)[-2:]
    
    return f"{first_name}{last_initial}{middle_initial}{year_suffix}"

def generate_email(full_name: str, date_of_birth: str):
    # Bỏ dấu và viết thường
    name_no_accents = remove_accents(full_name).lower().replace(" ", "")
    # Format lại ngày sinh từ yyyy-mm-dd → ddmmyyyy
    parts = date_of_birth.split("-")
    dob_str = f"{parts[2]}{parts[1]}{parts[0]}"
    return f"{name_no_accents}{dob_str}@gmail.com"

user_data = []

for i, (fullName, departmentName) in enumerate(phongHCNS, start=1):
    dob_year = random.randint(1985, 2003)
    dob = f"{dob_year}-{random.randint(1,12):02}-{random.randint(1,28):02}"
    
    position_name = department_position_name_map.get(departmentName, "Nhân viên kỹ thuật")
    position_id = position_map.get(position_name, 10)
    
    email = generate_email(fullName, dob)
    username = generate_username(fullName, dob_year)
    
    data = {
        "username": username,
        "identity": str(random.randint(100000000000, 999999999999)),
        "email": email,
        "phone": f"09{random.randint(10000000,99999999)}",
        "fullName": fullName,
        "roleId": 5,
        "departmentId": department_map.get(departmentName, 0),
        "positionId": position_id,
        "status": "ACTIVE",
        "hireDate": "2023-01-15",
        "createdAt": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "gender": random.choice([True, False]),
        "dateOfBirth": dob,
        "address": f"{random.choice(locations)[0]}, {random.choice(locations)[1]}, Hà Nội",
        "profileImageUrl": None,
        "emergencyContactName": None,
        "emergencyContactPhone": None,
        "contractType": None,
        "educationLevel": None
    }
    user_data.append(data)



# Xuất ra file CSV
df = pd.DataFrame(user_data)
df.to_csv("generated_employees.csv", index=False)
print("✅ File CSV đã được tạo: generated_employees.csv")
