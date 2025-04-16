import axiosClient from './axiosClient';

export const getDepartments = async () => {
  const response = await axiosClient.get('/departments');
  return response.data;
};

export const getDepartmentById = async (id) => {
  const response = await axiosClient.get(`/departments/${id}`);
  return response.data;
};

export const addDepartment = async (departmentData) => {
  const response = await axiosClient.post('/departments', departmentData);
  return response.data;
};

export const updateDepartment = async (id, updatedData) => {
  const response = await axiosClient.put(`/departments/${id}`, updatedData);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await axiosClient.delete(`/departments/${id}`);
  if (response.status === 200) {
    return { message: 'Xóa phòng ban thành công' };
  }
  throw new Error('Xóa phòng ban thất bại');
};
