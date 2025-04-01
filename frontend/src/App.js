import MainLayout from './layouts/MainLayout/MainLayout';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Sử dụng BrowserRouter thay vì Router
import { publicRoutes } from './routes'; // Sửa lỗi chính tả từ 'Rountes' thành 'Routes'

function App() {
  // Kiểm tra xem publicRoutes có phải là một mảng không
  console.log(publicRoutes);

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
      </div>
    </Router>
  );
}

export default App;
