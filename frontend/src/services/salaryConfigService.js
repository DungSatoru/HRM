import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

// Lấy danh sách cấu hình lương
export const getSalaryConfigList = async () => {
  try {
    const response = await axiosClient.get('/salary-config');
    if (response.status !== 200) {
      throw new Error('Không thể lấy danh sách cấu hình lương');
    }
    return response.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi lấy danh sách cấu hình lương.');
    console.error('Lỗi khi lấy danh sách cấu hình lương:', error);
    throw error;
  }
}

// Lấy cấu hình lương theo ID
export const getSalaryConfigByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(`/salary-config/${userId}`);
    if (response.status !== 200) {
      throw new Error('Không thể lấy cấu hình lương');
    }
    return response.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi lấy cấu hình lương.');
    console.error('Lỗi khi lấy cấu hình lương:', error);
    throw error;
  }
};

// Tạo mới cấu hình lương
export const createSalaryConfig = async (salaryConfigData) => {
  try {
    const response = await axiosClient.post('/salary-config', salaryConfigData);
    if (response.status !== 201) {
      throw new Error('Không thể tạo cấu hình lương mới');
    }
    toast.success('Tạo cấu hình lương thành công!');
    return response.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi tạo cấu hình lương.');
    console.error('Lỗi khi tạo cấu hình lương:', error);
    throw error;
  }
};


// Cập nhật cấu hình lương
export const updateSalaryConfig = async (id, updatedData) => {
  try {
    const response = await axiosClient.put(`/salary-config/${id}`, updatedData);
    if (response.status !== 200) {
      throw new Error('Không thể cập nhật cấu hình lương');
    }
    toast.success('Cập nhật cấu hình lương thành công!');
    return response.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi cập nhật cấu hình lương.');
    console.error(`Lỗi khi cập nhật cấu hình lương ID: ${id}`, error);
    throw error;
  }
};

// Xóa cấu hình lương
export const deleteSalaryConfigByUserId = async (id) => {
  try {
    const response = await axiosClient.delete(`/salary-config/${id}`);
    if (response.status !== 200) {
      throw new Error('Không thể xóa cấu hình lương');
    }
    toast.success('Xóa cấu hình lương thành công!');
    return response.data;
  } catch (error) {
    toast.error(error.message || 'Đã xảy ra lỗi khi xóa cấu hình lương.');
    console.error(`Lỗi khi xóa cấu hình lương ID: ${id}`, error);
    throw error;
  }
}