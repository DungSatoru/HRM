import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEmployeeById,
  updateEmployee,
} from "~/services/employeeService"; // Dịch vụ lấy và sửa thông tin nhân viên
import { getDepartments } from "~/services/departmentService";
import { getPositions } from "~/services/positionService";

const EmployeeEdit = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchPositions();
    fetchEmployeeDetail();
  }, [id]);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data || []);
    } catch (error) {
      console.error("Lỗi khi tải phòng ban:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const data = await getPositions();
      setPositions(data || []);
    } catch (error) {
      console.error("Lỗi khi tải vị trí:", error);
    }
  };

  const fetchEmployeeDetail = async () => {
    try {
      const data = await getEmployeeById(id);
      setEmployee(data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhân viên:", error);
      setLoading(false);
    }
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedEmployeeData = {
      username: formData.get("username"),
      fullName: formData.get("fullName"),
      identity: formData.get("identity"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      role: {
        roleId: 5, // Vai trò Nhân viên mặc định
        roleName: "Nhân viên",
      },
      department: {
        departmentId: formData.get("departmentName"),
        departmentName: formData.get("departmentName"),
      },
      position: {
        positionId: formData.get("positionName"),
        positionName: formData.get("positionName"),
      },
      status: formData.get("status"),
      hireDate: formData.get("hireDate"),
    };

    try {
      await updateEmployee(id, updatedEmployeeData); // Cập nhật nhân viên qua API
      navigate("/employees");
    } catch (error) {
      console.error("Lỗi khi sửa thông tin nhân viên:", error);
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
      <h2 className="mb-3">Sửa Thông Tin Nhân Viên</h2>
      <form
        onSubmit={handleSaveEmployee}
        className="shadow p-4 bg-light rounded"
      >
        <div className="row">
          {/* Cột trái */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Tên tài khoản</label>
              <input
                type="text"
                name="username"
                className="form-control"
                defaultValue={employee.username}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Họ và Tên</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                defaultValue={employee.fullName}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Căn cước công dân</label>
              <input
                type="text"
                name="identity"
                className="form-control"
                defaultValue={employee.identity}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                defaultValue={employee.email}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                defaultValue={employee.phone}
                required
              />
            </div>
          </div>

          {/* Cột phải */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Vai trò</label>
              <input
                type="text"
                name="roleName"
                className="form-control"
                value="Nhân viên" // Vai trò mặc định là Nhân viên
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Chức vụ</label>
              <select
                name="positionName"
                className="form-select"
                defaultValue={employee.position.positionId}
              >
                {positions.map((position) => (
                  <option key={position.positionId} value={position.positionId}>
                    {position.positionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Phòng ban</label>
              <select
                name="departmentName"
                className="form-select"
                defaultValue={employee.department.departmentId}
              >
                {departments.map((dep) => (
                  <option key={dep.departmentId} value={dep.departmentId}>
                    {dep.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Trạng thái</label>
              <select
                name="status"
                className="form-select"
                defaultValue={employee.status}
              >
                <option value="ACTIVE">Đang làm việc</option>
                <option value="INACTIVE">Nghỉ việc</option>
                <option value="BANNED">Cấm hoạt động</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Ngày vào làm</label>
              <input
                type="date"
                name="hireDate"
                className="form-control"
                defaultValue={employee.hireDate.split("T")[0]} // Đảm bảo ngày tháng theo định dạng yyyy-mm-dd
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Lưu
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/employees")}
        >
          Hủy
        </button>
      </form>
    </div>
  );
};

export default EmployeeEdit;
