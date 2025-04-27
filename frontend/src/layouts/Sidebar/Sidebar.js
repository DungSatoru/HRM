import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar2.css';

const Sidebar = () => {
  // Lấy thông tin người dùng từ localStorage
  const fullName = localStorage.getItem('fullName') || 'Người dùng';
  const position = localStorage.getItem('position') || 'Nhân viên';

  // Tạo trạng thái cho các icon (tắt/mở)
  const [openSections, setOpenSections] = useState({
    collapseNhanVien: false,
    collapsePhongBanVaChucVu: false,
    collapseChucVu: false,
    collapseChamCong: false,
    collapseLuongPhucLoi: false,
    collapseTuyenDung: false,
    collapseBaoCao: false,
    collapseUser: false,
  });

  const handleToggle = (section) => {
    // Đảo ngược trạng thái của mục được nhấn
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <div className="row">
          <div className="col-md-3">
            <img
              src="https://yt3.googleusercontent.com/teSofwgIZAZaLEFxJtRJkZxZV3KsMdO4BB-vuUkXPcEPdM2bvEPzn4k92VksjV4v49L-cJqGGQ=s900-c-k-c0x00ffffff-no-rj"
              alt="Ảnh đại diện"
              className="profile-img"
            />
          </div>
          <div className="col-md-9">
            <p className="username">{fullName}</p>
            <p className="role">{position}</p>
          </div>
        </div>
      </div>

      <div className="menu">
        <p className="fw-bold">Chức năng chính</p>
        <ul className="list-unstyled">
          {/* Tổng quan */}
          <li>
            <NavLink to="/dashboard">
              <i className="fas fa-tachometer-alt"></i> Tổng quan
            </NavLink>
          </li>

          {/* Quản lý nhân viên */}
          <li>
            <NavLink to="#collapseNhanVien" className="nav-item" onClick={() => handleToggle('collapseNhanVien')}>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="fa-solid fa-users"></i> Nhân viên
                </span>
                <span className="dropdown-icon">
                  <i className={`fa-solid ${openSections.collapseNhanVien ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </span>
              </div>
            </NavLink>
            <div className={`collapse ${openSections.collapseNhanVien ? 'show' : ''}`} id="collapseNhanVien">
              <ul className="submenu">
                <li>
                  <NavLink to="/employees">Danh sách nhân viên</NavLink>
                </li>
                <li>
                  <NavLink to="/employees/add">Quản lý nhân viên</NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Quản lý phòng ban và chức vụ */}
          <li>
            <NavLink
              to="#collapsePhongBanVaChucVu"
              className="nav-item"
              onClick={() => handleToggle('collapsePhongBanVaChucVu')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="fa-solid fa-building"></i> Phòng ban - Chức vụ
                </span>
                <span className="dropdown-icon">
                  <i
                    className={`fa-solid ${
                      openSections.collapsePhongBanVaChucVu ? 'fa-chevron-up' : 'fa-chevron-down'
                    }`}
                  ></i>
                </span>
              </div>
            </NavLink>
            <div
              className={`collapse ${openSections.collapsePhongBanVaChucVu ? 'show' : ''}`}
              id="collapsePhongBanVaChucVu"
            >
              <ul className="submenu">
                <li>
                  <NavLink to="/departments">Quản lý phòng ban</NavLink>
                </li>
                <li>
                  <NavLink to="/roles">Quản lý chức vụ</NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Quản lý Chấm công */}
          <li>
            <NavLink to="#collapseChamCong" className="nav-item" onClick={() => handleToggle('collapseChamCong')}>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="fa-solid fa-user-clock"></i> Chấm công
                </span>
                <span className="dropdown-icon">
                  <i className={`fa-solid ${openSections.collapseChamCong ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </span>
              </div>
            </NavLink>
            <div className={`collapse ${openSections.collapseChamCong ? 'show' : ''}`} id="collapseChamCong">
              <ul className="submenu">
                <li>
                  <NavLink to="/attendances">Theo dõi chấm công theo ngày</NavLink>
                </li>
                <li>
                  <NavLink to="/attendance-history">Lịch sử chấm công nhân viên</NavLink>
                </li>
                <li>
                  <NavLink to="/attendance-reports">Báo cáo chấm công</NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Quản lý Lương và Phúc lợi */}
          <li>
            <NavLink
              to="#collapseLuongPhucLoi"
              className="nav-item"
              onClick={() => handleToggle('collapseLuongPhucLoi')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="fa-solid fa-money-check-alt"></i> Lương và phúc lợi
                </span>
                <span className="dropdown-icon">
                  <i
                    className={`fa-solid ${openSections.collapseLuongPhucLoi ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                  ></i>
                </span>
              </div>
            </NavLink>
            <div className={`collapse ${openSections.collapseLuongPhucLoi ? 'show' : ''}`} id="collapseLuongPhucLoi">
              <ul className="submenu">
                <li>
                  <NavLink to="/payroll">Xem bảng lương</NavLink>
                </li>
                <li>
                  <NavLink to="/manage-payroll">Quản lý lương và phúc lợi</NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Các mục menu khác */}
          {/* Tuyển dụng */}
          <li>
            <NavLink to="#collapseTuyenDung" className="nav-item" onClick={() => handleToggle('collapseTuyenDung')}>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="fa-solid fa-user-plus"></i> Tuyển dụng
                </span>
                <span className="dropdown-icon">
                  <i className={`fa-solid ${openSections.collapseTuyenDung ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </span>
              </div>
            </NavLink>
            <div className={`collapse ${openSections.collapseTuyenDung ? 'show' : ''}`} id="collapseTuyenDung">
              <ul className="submenu">
                <li>
                  <NavLink to="/recruitment">Quản lý ứng viên</NavLink>
                </li>
                <li>
                  <NavLink to="/create-job-post">Tạo thông báo tuyển dụng</NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Báo cáo */}
          <li>
            <NavLink to="#collapseBaoCao" className="nav-item" onClick={() => handleToggle('collapseBaoCao')}>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="fa-solid fa-chart-line"></i> Báo cáo
                </span>
                <span className="dropdown-icon">
                  <i className={`fa-solid ${openSections.collapseBaoCao ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </span>
              </div>
            </NavLink>
            <div className={`collapse ${openSections.collapseBaoCao ? 'show' : ''}`} id="collapseBaoCao">
              <ul className="submenu">
                <li>
                  <NavLink to="/reports">Báo cáo nhân sự</NavLink>
                </li>
                <li>
                  <NavLink to="/salary-reports">Báo cáo lương</NavLink>
                </li>
                <li>
                  <NavLink to="/recruitment-reports">Báo cáo tuyển dụng</NavLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      {/* Admin menu */}
      <div className="admin-menu">
        <p className="fw-bold">Admin menu</p>
        <ul>
          <li>
            <NavLink to="#collapseUser" className="nav-item" onClick={() => handleToggle('collapseUser')}>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="fa-solid fa-user-shield"></i> Quản lý người dùng
                </span>
                <span className="dropdown-icon">
                  <i className={`fa-solid ${openSections.collapseUser ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </span>
              </div>
            </NavLink>
            <div className={`collapse ${openSections.collapseUser ? 'show' : ''}`} id="collapseUser">
              <ul className="submenu">
                <li>
                  <NavLink to="/user-list">Danh sách người dùng</NavLink>
                </li>
                <li>
                  <NavLink to="/user-permissions">Phân quyền người dùng</NavLink>
                </li>
                <li>
                  <NavLink to="/face-training">Huấn luyện khuôn mặt</NavLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      {/* Other menu */}
      <div className="other">
        <p className="fw-bold">Other</p>
        <ul>
          <li>
            <NavLink to="#collapseSetting" className="nav-item" onClick={() => handleToggle('collapseSetting')}>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="fa-solid fa-cogs"></i> Cài đặt
                </span>
                <span className="dropdown-icon">
                  <i className={`fa-solid ${openSections.collapseSetting ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </span>
              </div>
            </NavLink>
            <div className={`collapse ${openSections.collapseSetting ? 'show' : ''}`} id="collapseSetting">
              <ul className="submenu">
                <li>
                  <NavLink to="/settings/account">Quản lý tài khoản</NavLink>
                </li>
                <li>
                  <NavLink to="/settings/security">Cấu hình bảo mật</NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login" // Điều hướng thủ công
                    onClick={(e) => {
                      e.preventDefault(); // Ngăn điều hướng mặc định
                      localStorage.clear(); // Hoặc gọi loginService.logout()
                      window.location.href = '/login'; // Reload + redirect về login
                    }}
                  >
                    Đăng xuất
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
