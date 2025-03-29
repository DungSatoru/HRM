import { Link, NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2>HR Management</h2>
      <ul>
        <li>
          <NavLink
            className={(nav) => nav.isActive ? "active" : ""}
            to="/dashboard"
          >
            <i className="fas fa-chart-simple"></i> Tổng quan
          </NavLink>
        </li>
        <li>
          <NavLink
            className={(nav) => nav.isActive ? "active" : ""}
            to="/employees"
          >
            <i className="fa-solid fa-users"></i> Nhân viên
          </NavLink>
        </li>
        <li>
          <NavLink
            className={(nav) => nav.isActive ? "active" : ""}
            to="/departments"
          >
            <i className="fa-solid fa-briefcase"></i> Phòng ban
            </NavLink>
        </li>
        <li>
          <NavLink
            className={(nav) => nav.isActive ? "active" : ""}
            to="/roles"
          >
            <i className="fa-solid fa-user-lock"></i> Phân quyền
            </NavLink>
        </li>
        <li>
          <NavLink
            className={(nav) => nav.isActive ? "active" : ""}
            to="/attendance"
          >
            <i className="fa-solid fa-calendar-days"></i> Chấm công
            </NavLink>
        </li>
        <li>
          <NavLink
            className={(nav) => nav.isActive ? "active" : ""}
            to="/payroll"
          >
            <i className="fa-solid fa-sack-dollar"></i> Lương & Thưởng
            </NavLink>
        </li>
        <li>
          <NavLink
            className={(nav) => nav.isActive ? "active" : ""}
            to="/reports"
          >
            <i className="fa-solid fa-chart-bar"></i> Báo cáo & Thống kê
            </NavLink>
        </li>
        <li>
          <NavLink
            className={(nav) => nav.isActive ? "active" : ""}
            to="/settings"
          >
            <i className="fas fa-gear"></i> Cài đặt
            </NavLink>
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
