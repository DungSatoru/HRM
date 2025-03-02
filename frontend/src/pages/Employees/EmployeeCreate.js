import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addEmployee } from "../../services/employeeService";
import { getDepartments } from "../../services/departmentService";
import { getPositions, addPosition } from "../../services/positionService"; // Import service cho vị trí

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]); // Danh sách vị trí
  const [newPosition, setNewPosition] = useState(""); // Để lưu tên vị trí mới nếu người dùng thêm
  const [selectedPosition, setSelectedPosition] = useState(""); // Để lưu vị trí đã chọn

  useEffect(() => {
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng ban:", error);
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const data = await getPositions();
      setPositions(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách vị trí:", error);
    }
  };

  const handlePositionChange = (e) => {
    const positionName = e.target.value;
    setNewPosition(positionName);
    setSelectedPosition(""); // Khi người dùng nhập mới, bỏ chọn vị trí có sẵn
  };

  const handleSelectPosition = (e) => {
    setSelectedPosition(e.target.value); // Lấy vị trí đã chọn từ dropdown
    setNewPosition(""); // Khi người dùng chọn, xóa input để tránh nhầm lẫn
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let selectedPositionId = positions.find(
      (pos) => pos.positionName === selectedPosition
    )?.positionId;

    // Nếu không tìm thấy vị trí trong danh sách, cần thêm mới vị trí
    if (!selectedPositionId && newPosition) {
      try {
        // Tạo mới vị trí
        const newPositionData = { positionName: newPosition };
        const createdPosition = await addPosition(newPositionData); // Gọi API để thêm vị trí mới
        selectedPositionId = createdPosition.positionId; // Lấy ID vị trí mới tạo
      } catch (error) {
        console.error("Lỗi khi thêm vị trí mới:", error);
        return;
      }
    }

    const data = {
      username: formData.get("username"),
      identity: formData.get("identity"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      fullName: formData.get("fullName"),
      role: {
        roleId: 5, // Vai trò Nhân viên mặc định
        roleName: "Nhân viên",
      },
      department: {
        departmentId: formData.get("departmentName"), // Giả định ID phòng ban mặc định
        departmentName: formData.get("departmentName"),
      },
      position: {
        positionId: selectedPositionId || null, // Sử dụng ID vị trí đã được chọn hoặc thêm mới
        positionName: selectedPosition || newPosition,
      },
      status: formData.get("status"),
      hireDate: formData.get("hireDate"),
    };

    try {
      await addEmployee(data);
      navigate("/employees");
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Thêm Nhân Viên</h2>
      <form onSubmit={handleSaveEmployee} className="shadow p-4 bg-light rounded">
        <div className="row">
          {/* Cột trái */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Tên tài khoản</label>
              <input type="text" name="username" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Họ và Tên</label>
              <input type="text" name="fullName" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Căn cước công dân</label>
              <input type="text" name="identity" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input type="text" name="phone" className="form-control" required />
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
              <div>
                <select
                  name="positionName"
                  className="form-select"
                  onChange={handleSelectPosition} // Sử dụng dropdown chọn vị trí
                  value={selectedPosition || newPosition}
                >
                  <option value="">Chọn chức vụ</option>
                  {positions.map((position) => (
                    <option key={position.positionId} value={position.positionName}>
                      {position.positionName}
                    </option>
                  ))}
                </select>
                {/* Nếu không có trong danh sách, người dùng có thể nhập tên vị trí */}
                <input
                  type="text"
                  name="positionName"
                  className="form-control mt-2"
                  placeholder="Hoặc nhập vị trí mới"
                  value={newPosition}
                  onChange={handlePositionChange} // Cập nhật vị trí mới
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Phòng ban</label>
              <select name="departmentName" className="form-select">
                {departments.map((dep) => (
                  <option key={dep.departmentId} value={dep.departmentId}>
                    {dep.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Trạng thái</label>
              <select name="status" className="form-select">
                <option value="ACTIVE">Đang làm việc</option>
                <option value="INACTIVE">Nghỉ việc</option>
                <option value="BANNED">Cấm hoạt động</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Ngày vào làm</label>
              <input type="date" name="hireDate" className="form-control" required />
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

export default EmployeeCreate;
