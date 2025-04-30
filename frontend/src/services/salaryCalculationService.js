import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

// Tính toán lương
export const calculateSalary = async (userId, month) => {
    try {
        // Gửi yêu cầu với query params (userId và month)
        const response = await axiosClient.post('/salaries/calculate', null, {
            params: {
                userId,  // ID của nhân viên
                month,   // Tháng tính lương (yyyy-MM)
            }
        });

        if (response.status === 200) {
            toast.success('Tính toán lương thành công!');
            return response.data;  // Trả về dữ liệu thành công từ backend
        } else {
            throw new Error(response.data.message || 'Không thể tính toán lương');
        }
    } catch (error) {
        // Xử lý lỗi từ backend hoặc lỗi mạng
        const errorMessage = error.response ? error.response.data.message : error.message;
        toast.error(errorMessage || 'Đã xảy ra lỗi khi tính toán lương.');
        console.error('Lỗi khi tính toán lương:', errorMessage);
        throw error;  // Ném lại lỗi để frontend có thể xử lý nếu cần
    }
}
