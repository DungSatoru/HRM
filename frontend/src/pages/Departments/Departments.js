import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDepartments, deleteDepartment, addDepartment } from '~/services/departmentService';
import './Departments.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
        fetchDepartments(); // Reload department list after deletion
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) {
      alert('Please enter a department name');
      return;
    }

    const departmentData = {
      departmentName: newDepartmentName,
    };

    try {
      await addDepartment(departmentData);
      setNewDepartmentName('');
      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const filteredDepartments = departments.filter((department) =>
    (department.departmentName ? department.departmentName.toLowerCase() : '').includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="department-container">
      <h2 className="page-title">Quản lý phòng ban</h2>

      <div className="card-container">
        <div className="row">
          {/* Add New Department Card */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Thêm phòng ban mới</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSaveDepartment}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên phòng ban..."
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                    />
                    <button type="submit" className="btn-save m-0">
                      <i className="fas fa-save me-1"></i> Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Search Department Card */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Tìm kiếm phòng ban</h5>
              </div>
              <div className="card-body">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-search mx-2"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên phòng ban..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Table Card */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title m-0">Danh sách phòng ban</h5>
          <span className="badge bg-primary">{filteredDepartments.length} phòng ban</span>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped department-table">
                <thead className="table-light">
                  <tr>
                    <th className="text-center" style={{ width: '10%' }}>
                      ID
                    </th>
                    <th style={{ width: '30%' }}>Tên phòng ban</th>
                    <th style={{ width: '25%' }}>Trưởng phòng</th>
                    <th className="text-center" style={{ width: '15%' }}>
                      Số nhân viên
                    </th>
                    <th className="text-center" style={{ width: '20%' }}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.length > 0 ? (
                    filteredDepartments.map((department) => (
                      <tr key={department.departmentId}>
                        <td className="text-center">{department.departmentId}</td>
                        <td>
                          <Link to={`/departments/${department.departmentId}`} className="department-link">
                            {department.departmentName || 'No Name'}
                          </Link>
                        </td>
                        <td>{department.managerName || 'Chưa có'}</td>
                        <td className="text-center">
                          <span className="badge bg-info">{department.employeeCount || 0}</span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary me-2" title="Sửa">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(department.departmentId)}
                              title="Xóa"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        <i className="fas fa-folder-open me-2 fa-2x"></i>
                        <p>Không tìm thấy phòng ban</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Departments;
