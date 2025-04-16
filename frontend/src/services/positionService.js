import axios from 'axios';
import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

export const getPositions = async () => {
  const response = await axiosClient.get('/positions');
  return response.data; // Dữ liệu danh sách vị trí
};

export const getPositionById = async (id) => {
  const response = await axiosClient.get(`/positions/${id}`);
  return response.data; // Dữ liệu vị trí theo ID
}

export const addPosition = async (positionData) => {
  try {
    const response = await axiosClient.post('/positions', positionData);
    return response.data; // Dữ liệu vị trí mới sau khi thêm
  }
  catch (error) {
    toast.error(error.message || "Đã xảy ra lỗi.");
    console.error('Lỗi khi thêm vị trí:', error);
    throw error;
  }
}

export const updatePosition = async (id, updatedData) => {
  const response = await axiosClient.put(`/positions/${id}`, updatedData);
  return response.data; // Dữ liệu vị trí đã cập nhật
}

export const deletePosition = async (id) => {
  const response = await axiosClient.delete(`/positions/${id}`);
  if (response.status === 200) {
    return { message: 'Xóa vị trí thành công' };
  }
  throw new Error('Xóa vị trí thất bại');
}

// Thêm vị trí mới
// export const addPosition = async (positionData) => {
//   try {
//     const response = await axios.post(API_URL, positionData);
//     return response.data; // Dữ liệu vị trí mới sau khi thêm
//   } catch (error) {
//     console.error('Lỗi khi thêm vị trí:', error);
//     throw error;
//   }
// };

// // Cập nhật thông tin chức vụ
// export const updatePosition = async (id, updatedData) => {
//   try {
//     const response = await axios.put(`${API_URL}/${id}`, updatedData);
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi khi cập nhật vị trí ID: ${id}`, error);
//     throw error;
//   }
// };

// // Xóa vị trí
// export const deletePosition = async (id) => {
//   try {
//     await axios.delete(`${API_URL}/${id}`);
//     return { message: 'Xóa vị trí thành công' };
//   } catch (error) {
//     console.error(`Lỗi khi xóa vị trí ID: ${id}`, error);
//     throw error;
//   }
// };
