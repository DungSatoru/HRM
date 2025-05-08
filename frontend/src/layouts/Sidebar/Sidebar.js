import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const fullName = localStorage.getItem('fullName') || 'Người dùng';
  const position = localStorage.getItem('positionName') || 'Nhân viên';
  const role = localStorage.getItem('roleName');

  // Phân quyền chi tiết
  const isAdmin = role === 'ROLE_ADMIN';
  const isHR = role === 'ROLE_HR';
  const isEmployee = role === 'ROLE_EMPLOYEE';
  const isManager = role === 'ROLE_MANAGER';
  const isAccountant = role === 'ROLE_ACCOUNTANT';

  const [openSections, setOpenSections] = useState({
    collapsePhongBanVaChucVu: false,
    collapseChamCong: false,
    collapseLuongPhucLoi: false,
    collapseTuyenDung: false,
    collapseBaoCao: false,
    collapseUser: false,
    collapseSetting: false,
  });

  const handleToggle = (section) => {
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
          {/* Tổng quan - Tất cả đều xem được */}
          {(isHR || isAdmin || isManager || isAccountant) && (
            <li>
              <NavLink to="/dashboard">
                <i className="fa-solid fas fa-tachometer-alt"></i> Tổng quan
              </NavLink>
            </li>
          )}

          {/* Quản lý nhân viên - HR và Admin */}
          {(isHR || isAdmin) && (
            <li>
              <NavLink to="/employees">
                <i className="fa-solid fa-users"></i> Nhân viên
              </NavLink>
            </li>
          )}

          {/* Quản lý phòng ban và chức vụ - HR, Admin và Manager */}
          {(isHR || isAdmin || isManager) && (
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
                  {isAdmin && (
                    <li>
                      <NavLink to="/departments">Quản lý phòng ban</NavLink>
                    </li>
                  )}
                  {(isHR || isAdmin) && (
                    <li>
                      <NavLink to="/roles">Quản lý chức vụ</NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </li>
          )}

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
                <NavLink to={`/attendances/user/${localStorage.getItem('userId')}`}>Chấm công của tôi</NavLink>
                {(isHR || isAdmin || isManager) && (
                  <>
                    <li>
                      <NavLink to="/attendances">Chấm công nhân viên</NavLink>
                    </li>
                    <li>
                      <NavLink to="/attendance-history">Lịch sử chấm công</NavLink>
                    </li>
                    <li>
                      <NavLink to="/attendance-reports">Báo cáo chấm công</NavLink>
                    </li>
                  </>
                )}
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
                  <NavLink to={`/salary/employee/${localStorage.getItem('userId')}`}>Bảng lương của tôi</NavLink>
                </li>
                {(isHR || isAdmin || isAccountant) && (
                  <>
                    <li>
                      <NavLink to="/salary">Bảng lương nhân viên</NavLink>
                    </li>
                    <li>
                      <NavLink to="/manage-salary">Quản lý lương</NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </li>
        </ul>
      </div>

      {/* Admin menu - Chỉ Admin */}
      {isAdmin && (
        <div className="admin-menu">
          <p className="fw-bold">Quản trị hệ thống</p>
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
                    <NavLink to="/user-permissions">Phân quyền người dùng</NavLink>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      )}

      {/* Cài đặt - Tất cả đều xem được */}
      <div className="other">
        <p className="fw-bold">Khác</p>
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
                
                {(isHR || isAdmin) && (
                  <li>
                    <NavLink to="/settings/security">Cấu hình bảo mật</NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    to="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      localStorage.clear();
                      window.location.href = '/login';
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
