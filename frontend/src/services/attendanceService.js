import axiosClient from './axiosClient';
import { toast } from 'react-toastify'; // Thêm toast

// Lấy danh sách chấm công theo ngày
export const getAttendances = async (date) => {
  try {
    console.log(localStorage.getItem('token'));
    
    const response = await axiosClient.get(`/attendance?date=${date}`);
    toast.success("Lấy danh sách chấm công theo ngày thành công!");
    return response.data;
  } catch (error) {
    toast.error("Đã xảy ra lỗi khi lấy danh sách chấm công!");
    console.error('Lỗi khi lấy danh sách chấm công:', error);
    throw error;
  }
};

// Lấy danh sách chấm công theo ID
export const getAttendanceById = async (id) => {
  try {
    const response = await axiosClient.get(`/attendance/${id}`);
    toast.success(`Lấy thông tin chấm công thành công!`);
    return response.data;
  } catch (error) {
    toast.error(`Lỗi khi lấy thông tin chấm công`);
    console.error(`Lỗi khi lấy thông tin chấm công`, error);
    throw error;
  }
};

// Lấy danh sách chấm công theo khoảng thời gian của một người dùng
export const getUserAttendanceByRange = async (userId, startDate, endDate) => {
  try {
    const response = await axiosClient.get(`/attendance/user/${userId}`, {
      params: {
        start: startDate,
        end: endDate,
      },
    });
    toast.success("Lấy danh sách chấm công theo khoảng thời gian thành công!");
    return response.data;
  } catch (error) {
    toast.error("Đã xảy ra lỗi khi lấy chấm công theo khoảng thời gian!");
    console.error('Lỗi khi lấy chấm công theo khoảng thời gian:', error);
    throw error;
  }
};

// Cập nhật thông tin chấm công
export const updateAttendance = async (id, data) => {
  try {
    const response = await axiosClient.put(`/attendance/${id}`, data);
    toast.success(`Cập nhật chấm công với ID: ${id} thành công!`);
    return response.data;
  } catch (error) {
    toast.error(`Đã xảy ra lỗi khi cập nhật chấm công ID: ${id}`);
    console.error(`Lỗi khi cập nhật chấm công ID: ${id}`, error);
    throw error;
  }
};

// Tạo mới chấm công
export const createAttendance = async (data) => {
  try {
    const response = await axiosClient.post('/attendance', data);
    toast.success("Tạo mới chấm công thành công!");
    return response.data;
  } catch (error) {
    toast.error("Đã xảy ra lỗi khi tạo mới chấm công!");
    console.error('Lỗi khi tạo mới chấm công:', error);
    throw error;
  }
};

// Xóa chấm công
export const deleteAttendance = async (id) => {
  try {
    const response = await axiosClient.delete(`/attendance/${id}`);
    toast.success(`Xóa chấm công với ID: ${id} thành công!`);
    return response.data;
  } catch (error) {
    toast.error(`Đã xảy ra lỗi khi xóa chấm công ID: ${id}`);
    console.error(`Lỗi khi xóa chấm công ID: ${id}`, error);
    throw error;
  }
};
