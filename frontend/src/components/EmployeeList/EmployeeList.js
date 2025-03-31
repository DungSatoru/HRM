import React, { useState } from 'react';
import './EmployeeList.css'; // Đảm bảo bạn có file CSS tương ứng

const EmployeeList = ({ employees }) => {
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

  return (
    <div className="table-container">
      <table className="employee-table">
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
          {currentRows.map((employee, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.joinDate}</td>
              <td>{employee.status}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <span>Rows per page: </span>
        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage * rowsPerPage >= employees.length}>
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
