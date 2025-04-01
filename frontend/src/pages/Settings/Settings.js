import React from 'react';
import { Link } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-container">
      <h2>Cài đặt hệ thống</h2>
      <div className="settings-options">
        <Link to="/settings/account" className="settings-item">
          <i className="fa-solid fa-user-cog"></i> Quản lý tài khoản
        </Link>
        <Link to="/settings/security" className="settings-item">
          <i className="fa-solid fa-shield-alt"></i> Cấu hình bảo mật
        </Link>
        <Link to="/settings/face-training" className="settings-item">
          <i className="fa-solid fa-camera"></i> Huấn luyện khuôn mặt
        </Link>
      </div>
    </div>
  );
};

export default Settings;
