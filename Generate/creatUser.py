import json
import requests
import pandas as pd
from datetime import datetime

# Đọc dữ liệu từ file CSV
df = pd.read_csv("generated_employees.csv")

# Token Authorization
token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwaHVvbmdudG0iLCJyb2xlcyI6WyJST0xFX0hSIl0sImlhdCI6MTc0OTA5MjUwNiwiZXhwIjoxNzQ5MTI4NTA2fQ._Nvc21n9NBLPexlWHEWbPQsCHNnJ6BCt6fg3LAM-13Q"

# Duyệt qua từng dòng trong CSV và gửi request
for index, row in df.iterrows():
    # Tạo JSON object cho field "data"
    employee_data = {
        "username": str(row["username"]),
        "identity": str(row["identity"]),
        "email": str(row["email"]),
        "phone": str(row["phone"]),
        "fullName": str(row["fullName"]),
        "roleId": int(row["roleId"]),
        "departmentId": int(row["departmentId"]),
        "positionId": int(row["positionId"]),
        "status": str(row["status"]),
        "hireDate": str(row["hireDate"]),
        "createdAt": str(row.get("createdAt", datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))),
        "gender": str(row["gender"]).lower(),  # "true"/"false"
        "dateOfBirth": str(row["dateOfBirth"]),
        "address": str(row["address"]),
        "emergencyContactName": None,
        "emergencyContactPhone": None,
        "contractType": None,
        "educationLevel": None,
        "profileImageUrl": None  # sẽ được set trong BE nếu có file
    }

    # Gửi multipart: JSON ở phần "data", ảnh là "image" (hiện tại để None)
    files = {
        "data": (None, json.dumps(employee_data), "application/json"),
        "image": (None, None)  # nếu có ảnh: ("filename.jpg", open(..., "rb"), "image/jpeg")
    }

    response = requests.post(
        "http://localhost:8080/api/users",
        files=files,
        headers={"Authorization": token}
    )

    print(f"[{index+1}] Status: {response.status_code} | Response: {response.text}")