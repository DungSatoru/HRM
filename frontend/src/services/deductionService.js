import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

// Lấy toàn bộ khoản khấu trừ
export const getListSalaryDeductionByUserId = async (userId) => {
    try {
        const response = await axiosClient.get(`/salary-deductions/${userId}`);
        if (response.status !== 200) {
            throw new Error('Không thể lấy danh sách khoản khấu trừ');
        }
        return response.data.data;
    } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi khi lấy danh sách khoản khấu trừ.');
        console.error('Lỗi khi lấy danh sách khoản khấu trừ:', error);
        throw error;
    }
}

// Thêm khoản khấu trừ
export const createSalaryDeduction = async (salaryDeductionData) => {
    try {
        const response = await axiosClient.post('/salary-deductions', salaryDeductionData);
        toast.success('Tạo khoản khấu trừ thành công!');
        return response.data.data;
    } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi khi tạo khoản khấu trừ.');
        console.error('Lỗi khi tạo khoản khấu trừ:', error);
        throw error;
    }
}

// Cập nhật khoản khấu trừ
export const updateSalaryDeduction = async (id, updatedData) => {
    try {
        const response = await axiosClient.put(`/salary-deductions/${id}`, updatedData);
        if (response.status !== 200) {
            throw new Error('Không thể cập nhật khoản khấu trừ');
        }
        toast.success('Cập nhật khoản khấu trừ thành công!');
        return response.data.data;
    } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi khi cập nhật khoản khấu trừ.');
        console.error('Lỗi khi cập nhật khoản khấu trừ:', error);
        throw error;
    }
}


// Xóa khoản khấu trừ
export const deleteSalaryDeduction = async (id) => {
    try {
        const response = await axiosClient.delete(`/salary-deductions/${id}`);
        if (response.status !== 200) {
            throw new Error('Không thể xóa khoản khấu trừ');
        }
        toast.success('Xóa khoản khấu trừ thành công!');
        return response.data.data;
    } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi khi xóa khoản khấu trừ.');
        console.error('Lỗi khi xóa khoản khấu trừ:', error);
        throw error;
    }
}

