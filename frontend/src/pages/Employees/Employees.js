import { useEffect, useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../../services/employeeService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;
  const navigate = useNavigate();


  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân viên:", error);
      setLoading(false);
    }
  };

  // Xác nhận và xóa nhân viên
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await deleteEmployee(id);
        fetchEmployees(); // Tải lại danh sách sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
      }
    }
  };

  // Lọc nhân viên theo họ tên hoặc email
  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.fullName ? emp.fullName.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      ) ||
      (emp.email ? emp.email.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      )
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Quản lý nhân viên</h2>

      {/* Thanh tìm kiếm và nút thêm nhân viên */}
      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Tìm kiếm nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-success"
          onClick={() => navigate("/employees/add")}
        >
          + Thêm Nhân Viên
        </button>
      </div>

      {/* Hiển thị trạng thái loading */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Họ và Tên</th>
                <th>Chức vụ</th>
                <th>Phòng ban</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Trạng thái</th>
                <th>Ngày vào làm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.userId}>
                    <td>{emp.userId}</td>
                    <td>
                      <Link
                        to={`/employees/${emp.userId}`}
                        className="text-primary fw-bold"
                      >
                        {emp.fullName || "Không có tên"}
                      </Link>
                    </td>
                    <td>{emp.positionName || "N/A"}</td>
                    <td>{emp.departmentName || "N/A"}</td>
                    <td>{emp.email || "Không có email"}</td>
                    <td>{emp.phone || "Không có số"}</td>
                    <td>
                      <span
                        className={`badge ${
                          emp.status === "ACTIVE"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td>{emp.hireDate || "N/A"}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2">
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(emp.userId)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    Không tìm thấy nhân viên nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Employees;
