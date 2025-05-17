import axiosClient from './axiosClient';
import { toast } from 'react-toastify'; // Thêm toast

export const getDepartments = async () => {
  try {
    const response = await axiosClient.get('/departments');
    return response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};

export const getDepartmentById = async (id) => {
  try {
    const response = await axiosClient.get(`/departments/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};

export const addDepartment = async (departmentData) => {
  try {
    const response = await axiosClient.post('/departments', departmentData);
    toast.success('Thêm phòng ban thành công!');
    return response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};

export const updateDepartment = async (id, updatedData) => {
  try {
    const response = await axiosClient.put(`/departments/${id}`, updatedData);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await axiosClient.delete(`/departments/${id}`);
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};
