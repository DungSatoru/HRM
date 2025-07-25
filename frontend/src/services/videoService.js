import axios from 'axios';


const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/videos/upload`;

export const uploadVideo = async (file, userId) => {
  try {
    if (!file || !file.name.toLowerCase().endsWith('.mp4')) {
      throw new Error('Chỉ hỗ trợ định dạng .mp4!');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await axios.post(API_URL, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data', 
        'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải lên video:', error);
    throw error;
  }
};
