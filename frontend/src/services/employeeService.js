import axiosClient from './axiosClient';
import { toast } from 'react-toastify'; // Thêm toast

export const getEmployees = async () => {
  try {
    const response = await axiosClient.get('/users');
    return response.data.data;
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi lấy danh sách nhân viên!');
    console.error('Lỗi khi lấy danh sách nhân viên:', error);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axiosClient.get(`/users/${id}`);
    toast.success(`Lấy thông tin nhân viên ${id} thành công!`);
    return response.data.data;
  } catch (error) {
    toast.error(`Lỗi khi lấy thông tin nhân viên với ID: ${id}`);
    console.error(`Lỗi khi lấy thông tin nhân viên với ID: ${id}`, error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await axiosClient.post('/users', employeeData);
    toast.success('Thêm nhân viên thành công!');
    return response.data.data;
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi thêm nhân viên!');
    console.error('Lỗi khi thêm nhân viên:', error);
    throw error;
  }
};

export const updateEmployee = async (id, updatedData) => {
  try {
    const response = await axiosClient.put(`/users/${id}`, updatedData);
    toast.success(`Cập nhật thông tin nhân viên ${id} thành công!`);
    return response.data.data;
  } catch (error) {
    toast.error(`Đã xảy ra lỗi khi cập nhật nhân viên với ID: ${id}`);
    console.error(`Lỗi khi cập nhật nhân viên với ID: ${id}`, error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await axiosClient.delete(`/users/${id}`);
    if (response.status === 200) {
      toast.success('Xóa nhân viên thành công!');
      return { message: 'Xóa nhân viên thành công' };
    }
    throw new Error('Xóa nhân viên thất bại');
  } catch (error) {
    toast.error(`Đã xảy ra lỗi khi xóa nhân viên với ID: ${id}`);
    console.error(`Lỗi khi xóa nhân viên với ID: ${id}`, error);
    throw error;
  }
};
