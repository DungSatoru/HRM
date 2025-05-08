import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartmentById } from '~/services/departmentService';
import { getEmployeeById } from '~/services/employeeService';
import { getPositionById } from '~/services/positionService';
import { getRoleById } from '~/services/roleService';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [positionName, setPositionName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeDetail();
  }, [id]);

  const fetchEmployeeDetail = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeById(id);
      const departmentData = await getDepartmentById(data.departmentId);
      const positionData = await getPositionById(data.positionId);
      const roleData = await getRoleById(data.roleId);
      setDepartmentName(departmentData.departmentName);
      setPositionName(positionData.positionName);
      setRoleName(roleData.roleName);
      setEmployee(data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải thông tin nhân viên:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!employee) return <div className="error-message">Không tìm thấy nhân viên</div>;

  return (
    <div className="page-container employee-detail-container">
      <h2 className="page-title">Hồ sơ nhân viên</h2>
      <div className="card-container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  {/* Hình ảnh nhân viên */}
                  <div className="col-md-9 mb-4 d-flex align-items-center">
                    <img
                      src={
                        employee.profileImageUrl
                          ? `${process.env.REACT_APP_SERVER_URL}${employee.profileImageUrl}`
                          : 'https://cdn-icons-png.flaticon.com/512/219/219969.png'
                      }
                      alt="Avatar"
                      className="img-fluid rounded-circle"
                      style={{ width: '100px', height: '100px' }}
                    />
                    <div className="profile-name ms-3">
                      <h1 className="profile-name-text">{employee.fullName}</h1>
                      <span
                        className={`profile-status p-2 rounded text-white ${
                          employee.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'
                        }`}
                      >
                        {employee.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ việc'}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-3 mb-4 d-flex justify-content-end align-items-center">
                    <button className="btn btn-outline-secondary" onClick={() => navigate(`/employees/${id}/edit`)}>
                      <i className="fas fa-edit me-1"></i> Chỉnh sửa
                    </button>
                  </div>
                  <hr />

                  {/* Cột trái */}
                  <div className="col-md-6 mt-4">
                    <div className="profile-item">
                      <label className="form-label fw-bold">Tên tài khoản</label>
                      <span className="profile-value">{employee.username}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Căn cước công dân</label>
                      <span className="profile-value">{employee.identity}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Email</label>
                      <span className="profile-value">{employee.email}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Số điện thoại</label>
                      <span className="profile-value">{employee.phone}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Ngày sinh</label>
                      <span className="profile-value">{new Date(employee.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Giới tính</label>
                      <span className="profile-value">{employee.gender ? 'Nam' : 'Nữ'}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Địa chỉ</label>
                      <span className="profile-value">{employee.address}</span>
                    </div>
                  </div>

                  {/* Cột phải */}
                  <div className="col-md-6 mt-4">
                    <div className="profile-item">
                      <label className="form-label fw-bold">Vai trò</label>
                      <span className="profile-value">{roleName}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Chức vụ</label>
                      <span className="profile-value">{positionName}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Phòng ban</label>
                      <span className="profile-value">{departmentName}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Ngày vào làm</label>
                      <span className="profile-value">{employee.hireDate}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Người liên hệ khẩn cấp</label>
                      <span className="profile-value">{employee.emergencyContactName || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">SĐT người liên hệ khẩn cấp</label>
                      <span className="profile-value">{employee.emergencyContactPhone || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Loại hợp đồng</label>
                      <span className="profile-value">{employee.contractType || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="profile-item">
                      <label className="form-label fw-bold">Trình độ học vấn</label>
                      <span className="profile-value">{employee.educationLevel || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btn-outline-secondary mt-3" onClick={() => navigate('/employees')}>
              <i className="fa-solid fa-left-long"></i> Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
