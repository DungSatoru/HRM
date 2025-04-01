import React, { useState } from 'react';
import './EmployeeList.css'; // Đảm bảo bạn có file CSS tương ứng
import { Link } from 'react-router-dom';
import { deleteEmployee } from '~/services/employeeService';

const EmployeeList = ({ employees, setEmployees }) => {
  // State to handle pagination (rows per page, current page)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = employees.slice(startIndex, startIndex + rowsPerPage);

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

  // Xác nhận và xóa nhân viên
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        // Gọi API xóa nhân viên
        await deleteEmployee(id);

        // Sau khi xóa, cập nhật lại danh sách nhân viên trong state
        setEmployees(prevEmployees => prevEmployees.filter(employee => employee.userId !== id));

      } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
      }
    }
  };

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Tên nhân viên</th>
            <th>Chức vụ</th>
            <th>Ngày gia nhập</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((employee, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{employee.fullName}</td>
              <td>{employee.position.positionName}</td>
              <td>{employee.hireDate}</td>
              <td className={`${employee.status === 'ACTIVE' ? 'text-success' : 'text-secondary'}`}>
                {employee.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ việc'}
              </td>
              <td>
                <Link to={`/employees/${employee.userId}/edit`} className="btn btn-outline-warning btn-sm me-2">
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(employee.userId)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <button onClick={handleNextPage} disabled={currentPage * rowsPerPage >= employees.length}>
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
