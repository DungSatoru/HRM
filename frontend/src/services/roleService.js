import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

export const getRoles = async () => {
  try {
    const response = await axiosClient.get('/roles');
    if (response.status !== 200) {
      throw new Error('Không thể lấy danh sách vai trò');
    }
    return response.data.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi lấy danh sách vai trò.');
    console.error('Lỗi khi lấy danh sách vai trò:', error);
    throw error;
  }
};

export const getRoleById = async (id) => {
  try {
    const response = await axiosClient.get(`/roles/${id}`);
    if (response.status !== 200) {
      throw new Error('Không thể lấy vai trò theo ID');
    }
    toast.success('Lấy thông tin vai trò thành công!');
    return response.data.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi lấy vai trò.');
    console.error('Lỗi khi lấy vai trò theo ID:', error);
    throw error;
  }
};

export const addRole = async (roleData) => {
  try {
    const response = await axiosClient.post('/roles', roleData);
    if (response.status !== 201) {
      throw new Error('Không thể thêm vai trò mới');
    }
    toast.success('Thêm vai trò thành công!');
    return response.data.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi thêm vai trò.');
    console.error('Lỗi khi thêm vai trò:', error);
    throw error;
  }
};

export const updateRole = async (id, updatedData) => {
  try {
    const response = await axiosClient.put(`/roles/${id}`, updatedData);
    if (response.status !== 200) {
      throw new Error('Không thể cập nhật vai trò');
    }
    toast.success('Cập nhật vai trò thành công!');
    return response.data.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi cập nhật vai trò.');
    console.error(`Lỗi khi cập nhật vai trò ID: ${id}`, error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axiosClient.delete(`/roles/${id}`);
    if (response.status === 200) {
      toast.success('Xóa vai trò thành công!');
      return { message: 'Xóa vai trò thành công' };
    }
    throw new Error('Xóa vai trò thất bại');
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi xóa vai trò.');
    console.error(`Lỗi khi xóa vai trò ID: ${id}`, error);
    throw error;
  }
};
