import { useLocation, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean);

  const renderBreadcrumb = () => {
    const crumbs = [{ name: 'Chức năng chính', link: '/dashboard' }];

    if (path.length === 0) return crumbs;

    switch (path[0]) {
      case 'dashboard':
        crumbs.push({ name: 'Tổng quan', link: '/dashboard' });
        break;

      case 'employees':
        crumbs.push({ name: 'Nhân viên', link: '/employees' });
        if (path[1] === 'add') {
          crumbs.push({ name: 'Thêm nhân viên', link: '/employees/add' });
        } else if (path[2] === 'edit') {
          crumbs.push({ name: 'Chỉnh sửa nhân viên', link: location.pathname });
        } else {
          crumbs.push({ name: 'Danh sách nhân viên', link: '/employees' });
        }
        break;

      case 'departments':
        crumbs.push({ name: 'Phòng ban - Chức vụ', link: '/departments' });
        crumbs.push({ name: 'Quản lý phòng ban', link: '/departments' });
        break;

      case 'roles':
        crumbs.push({ name: 'Phòng ban - Chức vụ', link: '/roles' });
        crumbs.push({ name: 'Quản lý chức vụ', link: '/roles' });
        break;

      case 'attendances':
        crumbs.push({ name: 'Chấm công', link: '/attendances' });
        if (path[1] === 'user') {
          crumbs.push({ name: 'Chấm công của tôi', link: location.pathname });
        } else if (path[0] === 'attendances') {
          crumbs.push({ name: 'Chấm công nhân viên', link: '/attendances' });
        }
        break;

      case 'attendance-history':
        crumbs.push({ name: 'Chấm công', link: '/attendances' });
        crumbs.push({ name: 'Lịch sử chấm công', link: '/attendance-history' });
        break;

      case 'salary':
        crumbs.push({ name: 'Lương và phúc lợi', link: '/salary' });
        if (path[1] === 'user') {
          crumbs.push({ name: 'Bảng lương của tôi', link: location.pathname });
        } else {
          crumbs.push({ name: 'Bảng lương nhân viên', link: '/salary' });
        }
        break;

      case 'manage-salary':
        crumbs.push({ name: 'Lương và phúc lợi', link: '/salary' });
        crumbs.push({ name: 'Quản lý lương', link: '/manage-salary' });
        break;

      case 'recruitment':
        crumbs.push({ name: 'Tuyển dụng', link: '/recruitment' });
        crumbs.push({ name: 'Quản lý ứng viên', link: '/recruitment' });
        break;

      case 'create-job-post':
        crumbs.push({ name: 'Tuyển dụng', link: '/recruitment' });
        crumbs.push({ name: 'Đăng tin tuyển dụng', link: '/create-job-post' });
        break;

      case 'reports':
        crumbs.push({ name: 'Báo cáo', link: '/reports' });
        crumbs.push({ name: 'Báo cáo nhân sự', link: '/reports' });
        break;

      case 'salary-reports':
        crumbs.push({ name: 'Báo cáo', link: '/salary-reports' });
        crumbs.push({ name: 'Báo cáo lương', link: '/salary-reports' });
        break;

      case 'recruitment-reports':
        crumbs.push({ name: 'Báo cáo', link: '/recruitment-reports' });
        crumbs.push({ name: 'Báo cáo tuyển dụng', link: '/recruitment-reports' });
        break;

      case 'user-list':
        crumbs.push({ name: 'Quản lý người dùng', link: '/user-list' });
        crumbs.push({ name: 'Danh sách người dùng', link: '/user-list' });
        break;

      case 'user-permissions':
        crumbs.push({ name: 'Quản lý người dùng', link: '/user-permissions' });
        crumbs.push({ name: 'Phân quyền người dùng', link: '/user-permissions' });
        break;

      case 'system-settings':
        crumbs.push({ name: 'Quản lý người dùng', link: '/system-settings' });
        crumbs.push({ name: 'Cấu hình hệ thống', link: '/system-settings' });
        break;

      case 'settings':
        crumbs.push({ name: 'Cài đặt', link: '/settings' });
        if (path[1] === 'account') {
          crumbs.push({ name: 'Tài khoản của tôi', link: '/settings/account' });
        } else if (path[1] === 'security') {
          crumbs.push({ name: 'Cấu hình bảo mật', link: '/settings/security' });
        } else if (path[1] === 'face-training') {
          crumbs.push({ name: 'Huấn luyện khuôn mặt', link: '/settings/face-training' });
        } else if (path[1] === 'user-permissions') {
          crumbs.push({ name: 'Phân quyền người dùng', link: '/settings/user-permissions' });
        }
        break;

      default:
        crumbs.push({ name: 'Trang không xác định', link: location.pathname });
    }

    return crumbs;
  };

  const breadcrumbItems = renderBreadcrumb();

  return (
    <div className="header">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {breadcrumbItems.map((item, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${index === breadcrumbItems.length - 1 ? 'active' : ''}`}
              aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
            >
              {index === breadcrumbItems.length - 1 ? item.name : <NavLink to={item.link}>{item.name}</NavLink>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Header;
