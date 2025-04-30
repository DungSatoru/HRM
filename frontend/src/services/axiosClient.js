// services/axiosClient.js
import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({
  baseURL: `${apiUrl}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isLoggedOut = false; // Biến để theo dõi trạng thái đăng xuất
let hasToastShown = false; // Biến để đảm bảo chỉ hiển thị toast 1 lần

// Thêm interceptor để xử lý lỗi từ response
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !isLoggedOut) {
      setTimeout(() => {
        if (!hasToastShown) {
          toast.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
          hasToastShown = true; // Đánh dấu đã hiển thị toast
        }

        isLoggedOut = true; // Đánh dấu là đã đăng xuất
        localStorage.clear();
        window.location.href = '/login';
      }, 1000);
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
