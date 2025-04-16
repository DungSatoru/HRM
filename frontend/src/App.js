import MainLayout from './layouts/MainLayout/MainLayout';
import { Route, BrowserRouter as Router, Routes, Outlet } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';

// Component kiểm tra token
function RequireAuth() {
  const token = localStorage.getItem('token');
  console.log('Token:', token);  // Debugging token

  // Kiểm tra token và chuyển hướng nếu không có token
  if (!token) {
    console.log('Chuyển hướng về trang đăng nhập');  // Debugging
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;  // Quan trọng: Sử dụng Outlet để render các route con
}

function App() {
  if (!Array.isArray(publicRoutes) || !Array.isArray(privateRoutes)) {
    console.error('Routes không phải là một mảng hợp lệ');
  }

  return (
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
              {/* Các route con sẽ được render bởi Outlet trong RequireAuth */}
              {privateRoutes.map((route, index) => {
                const Page = route.component;
                return <Route key={index} path={route.path} element={<Page />} />;
              })}
            </Route>
          </Routes>
        </MainLayout>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;