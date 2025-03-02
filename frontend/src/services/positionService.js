import axios from "axios";

// API endpoint để lấy danh sách vị trí
const API_URL = "http://localhost:8080/api/positions"; // Thay đổi URL nếu cần

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
