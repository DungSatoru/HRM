import axios from 'axios';
import { toast } from 'react-toastify';
import { getPositionById } from './positionService';

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/auth/login`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authService = {
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post('', {
        username: username,
        password: password,
      });
      const data = response.data.data;

      if (data.token) {
        // Lưu thông tin cơ bản trước
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.userId || '');
        localStorage.setItem('fullName', data.user.fullName || '');

        const position = await getPositionById(data.user.positionId);
        localStorage.setItem('positionName', position.positionName || '');
        localStorage.setItem('roleName', data.roleName || '');

        toast.success(data.message);
        if (data.roleName === 'ROLE_HR') window.location.href = `/attendances`;
        else window.location.href = `/attendances/user/${data.user.userId}`;
        return data.token;
      } else {
        toast.error('Không nhận được token từ máy chủ!');
        throw new Error('Không nhận được token từ máy chủ.');
      }
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message);
      console.error('Login failed:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  logout: () => {
    // Xóa từng key thay vì dùng localStorage.clear() (tránh ảnh hưởng các key khác)
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('positionName');
    localStorage.removeItem('roleName');

    // 🔁 Phát sự kiện để các tab khác bắt được
    localStorage.setItem('logout', Date.now());
    window.location.href = '/login'; // điều hướng lại trang login
  },
};

export default authService;
