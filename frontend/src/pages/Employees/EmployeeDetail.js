import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeById } from "../../services/employeeService"; // Dịch vụ lấy thông tin nhân viên theo ID

const EmployeeDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null); // Lưu thông tin nhân viên
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy dữ liệu nhân viên khi trang tải
    fetchEmployeeDetail();
  }, [id]);

  const fetchEmployeeDetail = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeById(id); // Gọi API để lấy thông tin nhân viên
      setEmployee(data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải thông tin nhân viên:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Không tìm thấy nhân viên</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Chi tiết Nhân viên</h2>
      <div className="shadow p-4 bg-light rounded">
        <div className="row">
          {/* Cột trái */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Tên tài khoản</label>
              <p>{employee.username}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Họ và Tên</label>
              <p>{employee.fullName}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Căn cước công dân</label>
              <p>{employee.identity}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <p>{employee.email}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <p>{employee.phone}</p>
            </div>
          </div>

          {/* Cột phải */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Vai trò</label>
              <p>{employee.role.roleName}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Chức vụ</label>
              <p>{employee.position.positionName}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Phòng ban</label>
              <p>{employee.department.departmentName}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Trạng thái</label>
              <p>{employee.status}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Ngày vào làm</label>
              <p>{employee.hireDate}</p>
            </div>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/employees")}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetail;
