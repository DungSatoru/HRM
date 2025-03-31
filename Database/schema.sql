CREATE DATABASE hr_management;
USE hr_management;

// Thứ tự tạo bảng
// roles
// departments
// positions
// permistions
// role_permissions
// users
// attendances
// payrolls
// salary_slips
// leave_requests

📌 1. Bảng users - Thông tin nhân viên
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    identity VARCHAR(12) NOT NULL,
    email VARCHAR(100) UNIQUE CHECK (email LIKE '%@%.%'),
    phone VARCHAR(15) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role_id BIGINT NOT NULL,
    department_id BIGINT NULL,
    position_id BIGINT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
    hire_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    FOREIGN KEY (position_id) REFERENCES positions(position_id) ON DELETE SET NULL
);

📌 2. Bảng roles - Vai trò
CREATE TABLE roles (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NULL
);

📌 3. Bảng permissions - Quyền hạn
CREATE TABLE permissions (
    permission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255) NULL
);

📌 4. Bảng role_permissions - Quyền gán cho vai trò
CREATE TABLE role_permissions (
    role_id BIGINT,
    permission_id BIGINT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

📌 5. Bảng departments - Phòng ban
CREATE TABLE departments (
    department_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) UNIQUE NOT NULL
);

📌 6. Bảng positions - Chức vụ
CREATE TABLE positions (
    position_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    position_name VARCHAR(100) UNIQUE NOT NULL
);

📌 7. Bảng attendances - Chấm công
CREATE TABLE attendances (
    attendance_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    check_in TIME NULL,
    check_out TIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

📌 8. Bảng payrolls - Bảng lương hàng tháng
CREATE TABLE payrolls (
    payroll_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    month VARCHAR(7) NOT NULL, -- YYYY-MM
    basic_salary DECIMAL(15,2) NULL,
    overtime_salary DECIMAL(15,2) NULL,
    total_salary DECIMAL(15,2) NULL,
    FOREIGN KEY (user_id) REFERrolesENCES users(user_id) ON DELETE CASCADE
);

📌 9. Bảng salary_slips - Phiếu lương
CREATE TABLE salary_slips (
    slip_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payroll_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    issued_date DATE NULL,
    FOREIGN KEY (payroll_id) REFERENCES payrolls(payroll_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

📌 10. Bảng leave_requests - Đơn nghỉ phép
CREATE TABLE leave_requests (
    leave_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    leave_type ENUM('Nghỉ ốm', 'Nghỉ phép', 'Khác') NOT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    status ENUM('Chờ duyệt','Đã duyệt','Từ chối') DEFAULT 'Chờ duyệt',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


SHOW TABLES;roles

