import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

// Sử dụng template literals để chèn biến vào chuỗi
const API_URL = `${apiUrl}/departments`; // URL API của bạn

// Lấy danh sách phòng ban
export const getDepartments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Trả về danh sách phòng ban
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng ban:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết phòng ban theo ID
export const getDepartmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin phòng ban ID: ${id}`, error);
    throw error;
  }
};

// Thêm phòng ban mới
export const addDepartment = async (departmentData) => {
  try {
    const response = await axios.post(API_URL, departmentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('User created:', response.data); // Dữ liệu trả về là UserDTO
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

// Cập nhật thông tin phòng ban
export const updateDepartment = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật phòng ban ID: ${id}`, error);
    throw error;
  }
};

// Xóa phòng ban
export const deleteDepartment = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { message: 'Xóa phòng ban thành công' };
  } catch (error) {
    console.error(`Lỗi khi xóa phòng ban ID: ${id}`, error);
    throw error;
  }
};

/*
Các hàm này sẽ gọi API từ server để thực hiện các thao tác CRUD với dữ liệu phòng ban.
- getDepartments(): Lấy danh sách phòng ban
- getDepartmentById(id): Lấy thông tin chi tiết phòng ban theo ID
- addDepartment(departmentData): Thêm phòng ban mới
- updateDepartment(id, updatedData): Cập nhật thông tin phòng ban
- deleteDepartment(id): Xóa phòng ban

Trong mỗi hàm, chúng ta sử dụng thư viện axios để gọi API từ server.
import { useEffect, useState } from "react";
import { getDepartments, deleteDepartment } from "../services/departmentService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import Sidebar from "../layouts/Sidebar";

const Departments = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Không thể tải danh sách phòng ban.");
      }
    };
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) {
      try {
        await deleteDepartment(id);
        setDepartments(departments.filter((emp) => emp.id !== id)); // Cập nhật UI sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa phòng ban.");
      }
    }
  };

  return (
    <div className="departments">
      <Sidebar />
      <div className="content">
        <h1>Danh sách phòng ban</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" href={`/departments/${emp.id}`}>
                      Xem chi tiết
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(emp.id)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Departments;

*/
