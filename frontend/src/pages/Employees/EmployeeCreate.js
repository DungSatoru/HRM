import { useNavigate } from "react-router-dom";
import { addEmployee } from "../../services/employeeService";

const EmployeeCreate = () => {
  const navigate = useNavigate();

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const employeeData = {
      username: formData.get("username"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      roleName: formData.get("roleName"),
      positionName: formData.get("positionName"),
      departmentName: formData.get("departmentName"),
      status: formData.get("status"),
      hireDate: formData.get("hireDate"),
    };

    try {
      await addEmployee(employeeData);
      navigate("/employees"); // Quay lại danh sách nhân viên
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
              <input type="text" name="roleName" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Chức vụ</label>
              <input type="text" name="positionName" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Phòng ban</label>
              <input type="text" name="departmentName" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Trạng thái</label>
              <select name="status" className="form-select">
                <option value="ACTIVE">Đang làm việc</option>
                <option value="INACTIVE">Nghỉ việc</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Ngày vào làm</label>
              <input type="date" name="hireDate" className="form-control" required />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Lưu</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/employees")}>Hủy</button>
      </form>
    </div>
  );
};

export default EmployeeCreate;
