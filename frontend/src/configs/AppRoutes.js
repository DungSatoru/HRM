import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees/Employees";
// import Login from "../pages/Login";
// import Signup from "../pages/Signup";
// import NotFoundPage from "../pages/NotFoundPage";
import MainLayout from "../layouts/MainLayout/MainLayout";
import EmployeeCreate from "../pages/Employees/EmployeeCreate";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Các trang không có Sidebar */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}

        {/* Các trang có Sidebar */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/employees" element={<Employees />} />
                <Route path="/employees/add" element={<EmployeeCreate />} />
                {/* <Route path="*" element={<NotFoundPage />} /> */}
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
