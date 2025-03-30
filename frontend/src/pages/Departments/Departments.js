import { useEffect, useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { getDepartments, deleteDepartment } from "~/services/departmentService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 5;
  const navigate = useNavigate();


  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      console.log(data);
      
      setDepartments(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng ban:", error);
      setLoading(false);
    }
  };

  // Xác nhận và xóa phòng ban
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) {
      try {
        await deleteDepartment(id);
        fetchDepartments(); // Tải lại danh sách sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa phòng ban:", error);
      }
    }
  };

  // Lọc phòng ban theo họ tên hoặc email
  const filteredDepartments = departments.filter(
    (department) =>
      (department.fullName ? department.fullName.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      ) ||
      (department.email ? department.email.toLowerCase() : "").includes(
        searchTerm.toLowerCase()
      )
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Quản lý phòng ban</h2>

      {/* Thanh tìm kiếm và nút thêm phòng ban */}
      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Tìm kiếm phòng ban..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-success"
          onClick={() => navigate("/departments/add")}
        >
          + Thêm Phòng Ban
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
                <th>Tên phòng ban</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <tr key={department.departmentId}>
                    <td>{department.departmentId}</td>
                    <td>
                      <Link
                        to={`/departments/${department.departmentId}`}
                        className="text-primary fw-bold"
                      >
                        {department.departmentName || "Không có tên"}
                      </Link>
                    </td>
                    
                    <td>
                      <button className="btn btn-warning btn-sm me-2">
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(department.departmentId)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    Không tìm thấy phòng ban nào
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

export default Departments;
