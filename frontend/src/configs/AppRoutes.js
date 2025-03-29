import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees/Employees";

// import Login from "../pages/Login";
// import Signup from "../pages/Signup";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import MainLayout from "../layouts/MainLayout/MainLayout";
import EmployeeCreate from "../pages/Employees/EmployeeCreate";
import Departments from "../pages/Departments/Departments.js";
import DepartmentCreate from "../pages/Departments/DepartmentCreate";
import EmployeeDetail from "../pages/Employees/EmployeeDetail";
import EmployeeEdit from "../pages/Employees/EmployeeEdit";
import Settings from "../pages/Settings/Settings.js";
import FaceTrainingWrapper from "../pages/Settings/FaceTraining/FaceTraining.js";

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
                <Route path="/employees/:id" element={<EmployeeDetail />} />
                <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

                <Route path="/departments" element={<Departments />} />
                <Route path="/departments/add" element={<DepartmentCreate />} />

                <Route path="/settings" element={<Settings />} />
                <Route
                  path="/settings/face-training"
                  element={<FaceTrainingWrapper />}
                />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
