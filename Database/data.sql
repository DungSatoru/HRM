3.1. Chèn dữ liệu mẫu vào roles - Vai trò
hr_managementINSERT INTO roles (role_name, description) VALUES
('Admin', 'Quản lý toàn bộ hệ thống'),
('HR', 'Quản lý nhân sự'),
('Kế toán', 'Quản lý lương và thuế'),
('Manager', 'Quản lý phòng ban'),
('Nhân viên', 'Nhân viên thông thường');

3.2. Chèn dữ liệu mẫu vào departments - Phòng ban
hr_managementINSERT INTO departments (department_name) VALUES
('Nhân sự'),
('Kế toán'),
('Kinh doanh'),
('Công nghệ thông tin'),
('Marketing');

3.3. Chèn dữ liệu mẫu vào positions - Chức vụ
INSERT INTO positions (position_name) VALUES
('Giám đốc'),
('Trưởng phòng'),
('Nhân viên'),
('Thực tập sinh');
3.3. Chèn dữ liệu mẫu vào users - Nhân viên

INSERT INTO users (username, password, identity, email, phone, full_name, role_id, department_id, position_id, status, hire_date)
VALUES 
('admin', 'hashed_password', '123456789012', 'admin@company.com', '0987654321', 'Nguyễn Văn A', 1, 1, 1, 'ACTIVE', '2023-01-01'),
('hr_user', 'hashed_password', '234567890123', 'hr@company.com', '0987654322', 'Trần Thị B', 2, 1, 2, 'ACTIVE', '2023-02-01'),
('accountant', 'hashed_password', '345678901234', 'ke.toan@company.com', '0987654323', 'Lê Văn C', 3, 2, 3, 'ACTIVE', '2023-03-01'),
('manager', 'hashed_password', '456789012345', 'manager@company.com', '0987654324', 'Hoàng Văn D', 4, 3, 2, 'ACTIVE', '2023-04-01'),
('employee', 'hashed_password', '567890123456', 'nv@company.com', '0987654325', 'Phạm Thị E', 5, 3, 3, 'ACTIVE', '2023-05-01');
