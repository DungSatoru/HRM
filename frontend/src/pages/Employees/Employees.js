import { useEffect, useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '~/services/employeeService';
import './Employees.css'; 

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation(); // Hook to track current location (URL)

  // Calculate the range of employees for current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const handleNextPage = () => {
    if (currentPage * rowsPerPage < employees.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

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
      console.error('Lỗi khi tải danh sách nhân viên:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
      }
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.fullName ? emp.fullName.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
      (emp.email ? emp.email.toLowerCase() : '').includes(searchTerm.toLowerCase())
  );

  // Function to apply 'active' class based on current location
  const getLinkClassName = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="employees-container">
      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="add-employee-btn" onClick={() => navigate('/employees/add')}>
          + Thêm Nhân Viên
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover employee-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Tên nhân viên</th>
                <th>Chức vụ</th>
                <th>Ngày gia nhập</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{emp.fullName}</td>
                    <td>{emp.position.positionName}</td>
                    <td>{emp.hireDate}</td>
                    <td className={`${emp.status === 'ACTIVE' ? 'text-success' : 'text-secondary'}`}>
                      {emp.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ việc'}
                    </td>
                    <td>
                      <NavLink
                        to={`/employees/${emp.userId}/edit`}
                        className="btn btn-outline-warning btn-sm me-2"
                        activeClassName="active"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </NavLink>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(emp.userId)}>
                        <i className="fa-solid fa-trash"></i>
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

      {/* Pagination Controls */}
      <div className="pagination">
        <span>Số nhân viên mỗi trang: </span>
        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Trang trước
        </button>
        <button onClick={handleNextPage} disabled={currentPage * rowsPerPage >= filteredEmployees.length}>
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default Employees;
