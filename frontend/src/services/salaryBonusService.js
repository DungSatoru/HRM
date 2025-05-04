import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

// Lấy toàn bộ thưởng
export const getListSalaryBonusByUserId = async (userId) => {
    try {
        const response = await axiosClient.get(`/salary-bonuses/${userId}`);
        if (response.status !== 200) {
        throw new Error('Không thể lấy danh sách thưởng');
        }
        return response.data.data;
    } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi khi lấy danh sách thưởng.');
        console.error('Lỗi khi lấy danh sách thưởng:', error);
        throw error;
    }
}

// Thêm thưởng
export const createSalaryBonus = async (salaryBonusData) => {
    try {
        const response = await axiosClient.post('/salary-bonuses', salaryBonusData);
        toast.success('Tạo thưởng thành công!');
        return response.data.data;
    } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi khi tạo thưởng.');
        console.error('Lỗi khi tạo thưởng:', error);
        throw error;
    }
}

// Cập nhật thưởng
export const updateSalaryBonus = async (id, updatedData) => {
    try {
        const response = await axiosClient.put(`/salary-bonuses/${id}`, updatedData);
        if (response.status !== 200) {
            throw new Error('Không thể cập nhật thưởng');
        }
        toast.success('Cập nhật thưởng thành công!');
        return response.data.data;
    } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi khi cập nhật thưởng.');
        console.error('Lỗi khi cập nhật thưởng:', error);
        throw error;
    }
}

// Xóa thưởng
export const deleteSalaryBonus = async (id) => {
    try {
        const response = await axiosClient.delete(`/salary-bonuses/${id}`);
        if (response.status !== 200) {
            throw new Error('Không thể xóa thưởng');
        }
        toast.success('Xóa thưởng thành công!');
        return response.data.data;
    } catch (error) {
        toast.error(error.message || 'Đã xảy ra lỗi khi xóa thưởng.');
        console.error('Lỗi khi xóa thưởng:', error);
        throw error;
    }
}