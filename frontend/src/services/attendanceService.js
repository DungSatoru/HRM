import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

// Sử dụng template literals để chèn biến vào chuỗi
const API_URL = `${apiUrl}/attendance`; // URL API của bạn

// Lấy danh sách chấm công theo ngày
export const getAttendances = async (date) => {
  try {
    const response = await axios.get(`${API_URL}?date=${date}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chấm công:', error);
    throw error;
  }
};

// Lấy danh sách chấm công theo khoảng thời gian của một người dùng
export const getUserAttendanceByRange = async (userId, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      params: {
        start: startDate,
        end: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chấm công theo khoảng thời gian:', error);
    throw error;
  }
};

// // Lấy thông tin chi tiết phòng ban theo ID
// export const getDepartmentById = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi khi lấy thông tin phòng ban ID: ${id}`, error);
//     throw error;
//   }
// };

// // Thêm phòng ban mới
// export const addDepartment = async (departmentData) => {
//   try {
//     const response = await axios.post(API_URL, departmentData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     console.log('User created:', response.data); // Dữ liệu trả về là UserDTO
//   } catch (error) {
//     console.error('Error adding user:', error);
//   }
// };

// // Cập nhật thông tin phòng ban
// export const updateDepartment = async (id, updatedData) => {
//   try {
//     const response = await axios.put(`${API_URL}/${id}`, updatedData);
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi khi cập nhật phòng ban ID: ${id}`, error);
//     throw error;
//   }
// };

// // Xóa phòng ban
// export const deleteDepartment = async (id) => {
//   try {
//     await axios.delete(`${API_URL}/${id}`);
//     return { message: 'Xóa phòng ban thành công' };
//   } catch (error) {
//     console.error(`Lỗi khi xóa phòng ban ID: ${id}`, error);
//     throw error;
//   }
// };
