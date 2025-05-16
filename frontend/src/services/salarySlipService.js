import axiosClient from './axiosClient';
import { toast } from 'react-toastify';

// Lấy danh sách phiếu lương theo tháng
export const getSalarySlipsByMonth = async (month) => {
    try {
        // Gửi yêu cầu với query params (month)
        const response = await axiosClient.get('/salaries', {
            params: { month }  // Tháng cần lấy phiếu lương (yyyy-MM)
        });

        if (response.status === 200) {
            return response.data.data;  // Trả về danh sách phiếu lương
        } else {
            throw new Error(response.data.message || 'Không thể lấy danh sách phiếu lương');
        }
    } catch (error) {
        // Xử lý lỗi từ backend hoặc lỗi mạng
        const errorMessage = error.response ? error.response.data.message : error.message;
        toast.error(errorMessage || 'Đã xảy ra lỗi khi lấy danh sách phiếu lương.');
        console.error('Lỗi khi lấy danh sách phiếu lương:', errorMessage);
        throw error;  // Ném lại lỗi để frontend có thể xử lý nếu cần
    }
}

export const getSalarySlipByEmployeeIdAndMonth = async (userId, month) => {
    try {
        // Gửi yêu cầu với query params (userId và month)
        const response = await axiosClient.get(`/salaries/employee/${userId}`, {
            params: { month }  // Tháng cần lấy phiếu lương (yyyy-MM)
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Không thể lấy phiếu lương của nhân viên');
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message;
        console.error('Lỗi khi lấy phiếu lương của nhân viên:', errorMessage);
        throw error; 
    }
}



// Tính toán lương
export const calculateSalary = async (userId, month) => {
    try {
        const response = await axiosClient.post('/salaries/calculate', null, {
            params: {
                userId, 
                month,  // (yyyy-MM)
            }
        });

        if (response.status === 200) {
            toast.success('Tính toán lương thành công!');
            return response.data.data; 
        } else {
            throw new Error(response.data.message || 'Không thể tính toán lương');
        }
    } catch (error) {
        // Xử lý lỗi từ backend hoặc lỗi mạng
        const errorMessage = error.response ? error.response.data.message : error.message;
        toast.error(errorMessage || 'Đã xảy ra lỗi khi tính toán lương.');
        console.error('Lỗi khi tính toán lương:', errorMessage);
        throw error; 
    }
}
