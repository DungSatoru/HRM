import MainLayout from './layouts/MainLayout/MainLayout';
import { Route, BrowserRouter as Router, Routes, Outlet, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ConfigProvider } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN'; // Import locale tiếng Việt

// Component kiểm tra token
function RequireAuth() {
  const token = localStorage.getItem('token');
  console.log('Token:', token);  // Debugging token

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function App() {
  if (!Array.isArray(publicRoutes) || !Array.isArray(privateRoutes)) {
    console.error('Routes không phải là một mảng hợp lệ');
  }

  return (
    <ConfigProvider locale={locale}>
      <Router>
        <div className="App">
          <MainLayout>
            <Routes>
              {/* Các route công khai không cần đăng nhập */}
              {publicRoutes.map((route, index) => {
                const Page = route.component;
                return <Route key={index} path={route.path} element={<Page />} />;
              })}

              {/* Route wrapper với RequireAuth */}
              <Route element={<RequireAuth />}>
                {privateRoutes.map((route, index) => {
                  const Page = route.component;
                  return <Route key={index} path={route.path} element={<Page />} />;
                })}
              </Route>
            </Routes>
          </MainLayout>
          <ToastContainer position="top-right" autoClose={1500} />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
