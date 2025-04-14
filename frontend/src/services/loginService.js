import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

// Sử dụng template literals để chèn biến vào chuỗi
const API_URL = `${apiUrl}/auth/login`; // URL API của bạn


// Tạo một axios instance để gửi yêu cầu HTTP
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// LoginService
const loginService = {
  // Hàm login
  login: async (username, password) => {
    try {
      // Gửi yêu cầu POST đến API
      const response = await axiosInstance.post('', {
        username: username,
        password: password,
      });

      // Nếu đăng nhập thành công, lưu token vào localStorage hoặc sessionStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Hàm để kiểm tra xem token có hợp lệ không
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return token ? true : false;
  },

  // Hàm để lấy token từ localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Hàm logout: xóa token khỏi localStorage
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default loginService;
