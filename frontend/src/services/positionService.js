import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

export const getPositions = async () => {
  try {
    const response = await axiosClient.get('/positions');
    if (response.status !== 200) {
      throw new Error('Không thể lấy danh sách vị trí');
    }
    return response.data.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi lấy danh sách vị trí.');
    console.error('Lỗi khi lấy danh sách vị trí:', error);
    throw error;
  }
};

export const getPositionById = async (id) => {
  try {
    const response = await axiosClient.get(`/positions/${id}`);
    if (response.status !== 200) {
      throw new Error('Không thể lấy vị trí theo ID');
    }
    return response.data.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi lấy vị trí.');
    console.error('Lỗi khi lấy vị trí theo ID:', error);
    throw error;
  }
};

export const addPosition = async (positionData) => {
  try {
    const response = await axiosClient.post('/positions', positionData);
    if (response.status === 201) {
      toast.success(response.data.message);
    }
    return response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};

export const updatePosition = async (id, updatedData) => {
  try {
    const response = await axiosClient.put(`/positions/${id}`, updatedData);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};

export const deletePosition = async (id) => {
  try {
    const response = await axiosClient.delete(`/positions/${id}`);
    if (response.status !== 200) {
      throw new Error('Không thể xóa vị trí');
    }
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};
