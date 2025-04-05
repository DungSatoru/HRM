import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

// Sử dụng template literals để chèn biến vào chuỗi
const API_URL = `${apiUrl}/positions`; // URL API của bạn

// Lấy tất cả các vị trí
export const getPositions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Dữ liệu vị trí
  } catch (error) {
    console.error("Lỗi khi tải danh sách vị trí:", error);
    throw error;
  }
};

// Thêm vị trí mới
export const addPosition = async (positionData) => {
  try {
    const response = await axios.post(API_URL, positionData);
    return response.data; // Dữ liệu vị trí mới sau khi thêm
  } catch (error) {
    console.error("Lỗi khi thêm vị trí:", error);
    throw error;
  }
};


// Cập nhật thông tin chức vụ
export const updatePosition = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật vị trí ID: ${id}`, error);
    throw error;
  }
};

// Xóa vị trí
export const deletePosition = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { message: 'Xóa vị trí thành công' };
  } catch (error) {
    console.error(`Lỗi khi xóa vị trí ID: ${id}`, error);
    throw error;
  }
};
