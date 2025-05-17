import axiosClient from './axiosClient';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    return response.data.data;
  } catch (error) {
    toast.error(`Lỗi khi lấy thông tin nhân viên với ID: ${id}`);
    console.error(`Lỗi khi lấy thông tin nhân viên với ID: ${id}`, error);
    throw error;
  }
};

export const addEmployee = async (employeeData, avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify(employeeData));

    if (avatarFile) {
      formData.append('image', avatarFile);
    }

    const response = await axiosClient.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    toast.success('Thêm nhân viên thành công!');
    return response.data.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi khi thêm nhân viên!';

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    toast.error(errorMessage);
    console.error('Lỗi khi thêm nhân viên:', error);
    throw error;
  }
};

export const updateEmployee = async (id, updatedData, avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify(updatedData)); // 👈 phần JSON - đã sửa từ employeeData sang updatedData

    if (avatarFile) {
      formData.append('image', avatarFile); // 👈 phần file
    }
    
    const response = await axiosClient.put(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    toast.success(`Cập nhật thông tin nhân viên thành công!`);
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