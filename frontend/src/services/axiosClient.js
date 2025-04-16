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

// Thêm interceptor để xử lý lỗi từ response
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
      // Đợi 1 giây rồi mới redirect để toast hiển thị
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/login';
      }, 1000); // 1000ms = 1 giây
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
