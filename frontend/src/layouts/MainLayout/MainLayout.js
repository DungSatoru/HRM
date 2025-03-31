import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useLocation } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  const location = useLocation();
  
  // Ẩn Sidebar trên trang đăng nhập và đăng ký
  const hideSidebarRoutes = ["/login", "/signup"];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="container-wrapper">
      {shouldShowSidebar && <Sidebar />}

      <div className={`main ${shouldShowSidebar ? "with-sidebar" : "full-width"}`}>
        {shouldShowSidebar && <Header />}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
