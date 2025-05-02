import axios from 'axios';
import { toast } from 'react-toastify';
import { getPositions } from './positionService';

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/auth/login`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const loginService = {
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post('', {
        username: username,
        password: password,
      });

      if (response.data.token) {
        // Lưu thông tin cơ bản trước
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('fullName', response.data.user.fullName || '');

        // Lấy và lưu thông tin position nếu có
        if (response.data.user.positionId) {
          try {
            const positions = await getPositions();
            const position = positions.find(pos => pos.positionId === response.data.user.positionId);
            if (position) {
              localStorage.setItem('positionId', position.positionId);
              localStorage.setItem('positionName', position.positionName || '');
            }
          } catch (error) {
            console.error('Error fetching positions:', error);
            // Không làm gì cả, vẫn cho đăng nhập dù không lấy được position
          }
        }

        toast.success('Đăng nhập thành công!');
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
    localStorage.clear();
    toast.info('Đã đăng xuất!');
  },

  // Thêm hàm helper để lấy thông tin position
  getPosition: () => {
    return {
      positionId: localStorage.getItem('positionId'),
      positionName: localStorage.getItem('positionName')
    };
  }
};

export default loginService;