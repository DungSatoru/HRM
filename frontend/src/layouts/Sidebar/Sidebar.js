import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2>HR Management</h2>
      <ul>
        <li>
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            <i className="fas fa-chart-simple"></i> Tổng quan
          </Link>
        </li>
        <li>
          <Link to="/employees" className={location.pathname === "/employees" ? "active" : ""}>
            <i className="fa-solid fa-users"></i> Nhân viên
          </Link>
        </li>
        <li>
          <Link to="/departments" className={location.pathname === "/departments" ? "active" : ""}>
            <i className="fa-solid fa-briefcase"></i> Phòng ban
          </Link>
        </li>
        <li>
          <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>
            <i className="fas fa-gear"></i> Cài đặt
          </Link>
        </li>
        <li>
          <Link to="/logout" className="logout">
            <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
