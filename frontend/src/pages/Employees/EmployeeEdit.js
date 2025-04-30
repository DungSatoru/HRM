import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '~/services/employeeService';
import { getDepartments } from '~/services/departmentService';
import { getPositions } from '~/services/positionService';
import './EmployeeEdit.css';
import Loading from '~/components/Loading/Loading';

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsData, positionsData, employeeData] = await Promise.all([
          getDepartments(),
          getPositions(),
          getEmployeeById(id),
        ]);

        setDepartments(departmentsData || []);
        setPositions(positionsData || []);
        setEmployee(employeeData);

        if (employeeData) {
          setFormData({
            username: employeeData.username || '',
            fullName: employeeData.fullName || '',
            identity: employeeData.identity || '',
            email: employeeData.email || '',
            phone: employeeData.phone || '',
            positionId: employeeData.positionId || '',
            departmentId: employeeData.departmentId || '',
            status: employeeData.status || 'ACTIVE',
            hireDate: employeeData.hireDate?.split('T')[0] || '',
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedEmployeeData = {
        username: formData.username,
        fullName: formData.fullName,
        identity: formData.identity,
        email: formData.email,
        phone: formData.phone,
        roleId: 5,
        departmentId: formData.departmentId,
        positionId: formData.positionId,
        status: formData.status,
        hireDate: formData.hireDate,
      };

      await updateEmployee(id, updatedEmployeeData);
      navigate('/employees', { state: { message: 'Cập nhật thông tin nhân viên thành công!' } });
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!employee) {
    return (
      <div className="alert alert-danger text-center m-4">
        <i className="fas fa-exclamation-circle me-2"></i>
        Không tìm thấy thông tin nhân viên
      </div>
    );
  }

  return (
    <div className="page-container employee-edit-container">
      <h2 className="page-title">Chỉnh Sửa Thông Tin Nhân Viên</h2>
      <div className="card-container">
        <form onSubmit={handleSaveEmployee}>
          <div className="row">
            {/* Thông tin cá nhân */}
            <div className="col-12">
              <div className="card border-0">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-muted">
                    <i className="fas fa-id-card me-2"></i>Thông tin cá nhân
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className="form-control"
                          value={formData.username || ''}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="username">Tên tài khoản</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className="form-control"
                          value={formData.fullName || ''}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="fullName">Họ và tên</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="identity"
                          name="identity"
                          className="form-control"
                          value={formData.identity || ''}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="identity">Căn cước công dân</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="date"
                          id="hireDate"
                          name="hireDate"
                          className="form-control"
                          value={formData.hireDate || ''}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="hireDate">Ngày vào làm</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div className="col-12">
              <div className="card border-0 ">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-muted">
                    <i className="fas fa-address-book me-2"></i>Thông tin liên hệ
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="email">Email</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          className="form-control"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="phone">Số điện thoại</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin công việc */}
            <div className="col-12">
              <div className="card border-0">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-muted">
                    <i className="fas fa-briefcase me-2"></i>Thông tin công việc
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="text" id="roleName" className="form-control bg-light" value="Nhân viên" disabled />
                        <label htmlFor="roleName">Vai trò</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          id="status"
                          name="status"
                          className="form-select"
                          value={formData.status || ''}
                          onChange={handleInputChange}
                        >
                          <option value="ACTIVE">Đang làm việc</option>
                          <option value="INACTIVE">Nghỉ việc</option>
                          <option value="BANNED">Cấm hoạt động</option>
                        </select>
                        <label htmlFor="status">Trạng thái</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          id="departmentId"
                          name="departmentId"
                          className="form-select"
                          value={formData.departmentId || ''}
                          onChange={handleInputChange}
                        >
                          <option value="">-- Chọn phòng ban --</option>
                          {departments.map((dep) => (
                            <option key={dep.departmentId} value={dep.departmentId}>
                              {dep.departmentName}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="departmentId">Phòng ban</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          id="positionId"
                          name="positionId"
                          className="form-select"
                          value={formData.positionId || ''}
                          onChange={handleInputChange}
                        >
                          <option value="">-- Chọn chức vụ --</option>
                          {positions.map((position) => (
                            <option key={position.positionId} value={position.positionId}>
                              {position.positionName}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="positionId">Chức vụ</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-light px-4"
              onClick={() => navigate('/employees')}
              disabled={saving}
            >
              <i className="fas fa-times me-2"></i>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEdit;
