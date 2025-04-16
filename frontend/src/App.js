import MainLayout from './layouts/MainLayout/MainLayout';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Sử dụng BrowserRouter thay vì Router
import { publicRoutes } from './routes'; // Sửa lỗi chính tả từ 'Rountes' thành 'Routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  if (!Array.isArray(publicRoutes)) {
    console.error('publicRoutes không phải là một mảng hợp lệ');
  }

  return (
    <Router>
      <div className="App">
        <MainLayout>
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Routes>
        </MainLayout>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
