import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

export const getEmployees = async () => {
  try {
    const response = await axiosClient.get('/users');
    return response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
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
    toast.error(error.response.data.message);
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
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};