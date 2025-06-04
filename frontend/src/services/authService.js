import axios from 'axios';
import { toast } from 'react-toastify';
import { getPositionById } from './positionService';
import { getRoleById } from './roleService';

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

      if (response.data.token) {
        // Lưu thông tin cơ bản trước
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.userId || '');
        localStorage.setItem('fullName', response.data.user.fullName || '');

        const position = await getPositionById(response.data.user.positionId);
        localStorage.setItem('positionName', position.positionName || '');
        localStorage.setItem('roleName', response.data.roleName || '');

        toast.success('Đăng nhập thành công!');
        if (response.data.roleName === 'ROLE_HR') window.location.href = `/attendances`;
        else window.location.href = `/attendances/user/${response.data.user.userId}`;
        return response.data;
      } else {
        toast.error('Không nhận được token từ máy chủ!');
        throw new Error('Không nhận được token từ máy chủ.');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin!';
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
