import { useLocation, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  // Chia đường dẫn để lấy các phần của breadcrumb
  const path = location.pathname.split('/').filter(Boolean); // Lấy các phần đường dẫn từ URL

  const renderBreadcrumb = () => {
    let breadcrumbItems = [
      { name: 'Main menu', link: '/' }, // Trang chủ luôn là item đầu tiên
    ];

    if (path.length === 0) {
      return breadcrumbItems; // Nếu chưa có trang con, chỉ hiển thị Home
    }

    // Thêm các mục vào breadcrumb dựa trên path hiện tại
    if (path[0] === 'employees') {
      breadcrumbItems.push({ name: 'Nhân viên', link: '/employees' });
      breadcrumbItems.push({ name: 'Danh sách nhân viên', link: '/employees' });
    }

    if (path[0] === 'departments') {
      breadcrumbItems.push({ name: 'Phòng ban', link: '/departments' });
      if (path[1] === 'list') {
        breadcrumbItems.push({ name: 'Danh sách Phòng ban', link: '/departments/list' });
      }
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = renderBreadcrumb();

  return (
    <div className="header">
      {/* Breadcrumb */}
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
