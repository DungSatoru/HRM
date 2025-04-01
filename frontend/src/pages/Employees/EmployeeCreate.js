import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '~/services/employeeService';
import { getDepartments } from '~/services/departmentService';
import { getPositions } from '~/services/positionService';
import './EmployeeCreate.css';

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]); // Danh sách vị trí
  const [selectedPosition, setSelectedPosition] = useState(''); // Để lưu vị trí đã chọn

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
      console.error('Lỗi khi tải danh sách phòng ban:', error);
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const data = await getPositions();
      setPositions(data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách vị trí:', error);
    }
  };

  const handleSelectPosition = (e) => {
    setSelectedPosition(e.target.value); // Lấy vị trí đã chọn từ dropdown
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let selectedPositionId = positions.find((pos) => pos.positionName === selectedPosition)?.positionId;

    const data = {
      username: formData.get('username'),
      identity: formData.get('identity'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      fullName: formData.get('fullName'),
      role: {
        roleId: 5, // Vai trò Nhân viên mặc định
        roleName: 'Nhân viên',
      },
      department: {
        departmentId: formData.get('departmentName'), // Giả định ID phòng ban mặc định
        departmentName: formData.get('departmentName'),
      },
      position: {
        positionId: selectedPositionId || null, // Sử dụng ID vị trí đã được chọn
        positionName: selectedPosition,
      },
      status: formData.get('status'),
      hireDate: formData.get('hireDate'),
    };

    try {
      await addEmployee(data);
      navigate('/employees');
    } catch (error) {
      console.error('Lỗi khi thêm nhân viên:', error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Thêm Nhân Viên</h2>
      <form onSubmit={handleSaveEmployee} className="form-content">
        <div className="row">
          {/* Cột trái */}
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Tên tài khoản</label>
              <div className="input-container">
                <input type="text" name="username" placeholder="Tên tài khoản" className="form-input" required />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Họ và Tên</label>
              <div className="input-container">
                <input type="text" name="fullName" placeholder="Họ và Tên" className="form-input" required />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Căn cước công dân</label>
              <div className="input-container">
                <input type="text" name="identity" placeholder="Căn cước công dân" className="form-input" required />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-container">
                <input type="email" name="email" placeholder="Email" className="form-input" required />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <div className="input-container">
                <input type="text" name="phone" placeholder="Số điện thoại" className="form-input" required />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Vai trò</label>
              <div className="input-container">
                <input type="text" name="roleName" className="form-input" value="Nhân viên" disabled />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Chức vụ</label>
              <div className="input-container">
                <select
                  name="positionName"
                  className="form-input"
                  onChange={handleSelectPosition}
                  value={selectedPosition}
                  required
                >
                  <option value="">Chọn chức vụ</option>
                  {positions.map((position) => (
                    <option key={position.positionId} value={position.positionName}>
                      {position.positionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Phòng ban</label>
              <div className="input-container">
                <select name="departmentName" className="form-input">
                  {departments.map((dep) => (
                    <option key={dep.departmentId} value={dep.departmentId}>
                      {dep.departmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <div className="input-container">
                <select name="status" className="form-input">
                  <option value="ACTIVE">Đang làm việc</option>
                  <option value="INACTIVE">Nghỉ việc</option>
                  <option value="BANNED">Cấm hoạt động</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Ngày vào làm</label>
              <div className="input-container">
                <input type="date" name="hireDate" className="form-input" required />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Lưu
          </button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/employees')}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;
