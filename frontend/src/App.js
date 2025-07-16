import MainLayout from './layouts/MainLayout/MainLayout';
import { Route, BrowserRouter as Router, Routes, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'antd/dist/reset.css';

import { ConfigProvider } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import authService from './services/authService';
import { useEffect } from 'react';
import AuthSyncHandler from './components/AuthSyncHandler/AuthSyncHandler';

// ✅ Component bảo vệ route cần đăng nhập
function RequireAuth() {
  const token = localStorage.getItem('token');
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
        <AuthSyncHandler /> 
        <div className="App">
          <MainLayout>
            <Routes>
              {/* ✅ Các route công khai */}
              {publicRoutes.map((route, index) => {
                const Page = route.component;

                // ✅ Chặn truy cập /login nếu đã đăng nhập
                if (route.path === '/login') {
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={localStorage.getItem('token') ? <Navigate to="/" replace /> : <Page />}
                    />
                  );
                }

                // ✅ Các route công khai khác
                return <Route key={index} path={route.path} element={<Page />} />;
              })}

              {/* ✅ Các route yêu cầu đăng nhập */}
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
