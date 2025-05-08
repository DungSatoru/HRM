import axiosClient from './axiosClient';
import { toast } from 'react-toastify'; // Thêm toast

export const getDepartments = async () => {
  try {
    const response = await axiosClient.get('/departments');
    return response.data.data;
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi lấy danh sách phòng ban!');
    console.error('Lỗi khi lấy danh sách phòng ban:', error);
    throw error;
  }
};

export const getDepartmentById = async (id) => {
  try {
    const response = await axiosClient.get(`/departments/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error(`Lỗi khi lấy thông tin phòng ban với ID: ${id}`);
    console.error(`Lỗi khi lấy thông tin phòng ban với ID: ${id}`, error);
    throw error;
  }
};

export const addDepartment = async (departmentData) => {
  try {
    const response = await axiosClient.post('/departments', departmentData);
    toast.success('Thêm phòng ban thành công!');
    return response.data.data;
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi thêm phòng ban!');
    console.error('Lỗi khi thêm phòng ban:', error);
    throw error;
  }
};

export const updateDepartment = async (id, updatedData) => {
  try {
    const response = await axiosClient.put(`/departments/${id}`, updatedData);
    toast.success(`Cập nhật phòng ban với ID: ${id} thành công!`);
    return response.data.data;
  } catch (error) {
    toast.error(`Đã xảy ra lỗi khi cập nhật phòng ban với ID: ${id}`);
    console.error(`Lỗi khi cập nhật phòng ban với ID: ${id}`, error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await axiosClient.delete(`/departments/${id}`);
    if (response.status === 200) {
      toast.success('Xóa phòng ban thành công!');
      return { message: 'Xóa phòng ban thành công' };
    }
    throw new Error('Xóa phòng ban thất bại');
  } catch (error) {
    toast.error(`Đã xảy ra lỗi khi xóa phòng ban với ID: ${id}`);
    console.error(`Lỗi khi xóa phòng ban với ID: ${id}`, error);
    throw error;
  }
};
