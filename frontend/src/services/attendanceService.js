import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

// Sử dụng template literals để chèn biến vào chuỗi
const API_URL = `${apiUrl}/attendance`; // URL API của bạn

// Lấy danh sách chấm công theo ngày
export const getAttendances = async (date) => {
  try {
    const response = await axios.get(`${API_URL}?date=${date}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chấm công:', error);
    throw error;
  }
};

// Lấy danh sách chấm công theo ID
export const getAttendanceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin chấm công ID: ${id}`, error);
    throw error;
  }
};

// Lấy danh sách chấm công theo khoảng thời gian của một người dùng
export const getUserAttendanceByRange = async (userId, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      params: {
        start: startDate,
        end: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chấm công theo khoảng thời gian:', error);
    throw error;
  }
};

// Cập nhật thông tin chấm công
export const updateAttendance = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật chấm công ID: ${id}`, error);
    throw error;
  }
};
// Xóa chấm công
export const deleteAttendance = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa chấm công ID: ${id}`, error);
    throw error;
  }
};
