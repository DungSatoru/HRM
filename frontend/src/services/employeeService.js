import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

// Sử dụng template literals để chèn biến vào chuỗi
const API_URL = `${apiUrl}/users`; // URL API của bạn

// Lấy danh sách nhân viên
export const getEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Trả về danh sách nhân viên
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên:", error);
    throw error;
  }
};

// Lấy thông tin chi tiết nhân viên theo ID
export const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin nhân viên ID: ${id}`, error);
    throw error;
  }
};


// Lấy thông tin chi tiết nhân viên theo ID
export const getEmployeesByDepartmentId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/department/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách nhân viên với ID phòng ban là: ${id}`, error);
    throw error;
  }
};

// Thêm nhân viên mới
export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/users",
      employeeData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("User created:", response.data); // Dữ liệu trả về là UserDTO
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

export const updateEmployee = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: {
        "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật nhân viên ID: ${id}`, error);
    throw error;
  }
};

// Xóa nhân viên
export const deleteEmployee = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { message: "Xóa nhân viên thành công" };
  } catch (error) {
    console.error(`Lỗi khi xóa nhân viên ID: ${id}`, error);
    throw error;
  }
};

/*
Các hàm này sẽ gọi API từ server để thực hiện các thao tác CRUD với dữ liệu nhân viên.
- getEmployees(): Lấy danh sách nhân viên
- getEmployeeById(id): Lấy thông tin chi tiết nhân viên theo ID
- addEmployee(employeeData): Thêm nhân viên mới
- updateEmployee(id, updatedData): Cập nhật thông tin nhân viên
- deleteEmployee(id): Xóa nhân viên

Trong mỗi hàm, chúng ta sử dụng thư viện axios để gọi API từ server.
import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import Sidebar from "../layouts/Sidebar";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Không thể tải danh sách nhân viên.");
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await deleteEmployee(id);
        setEmployees(employees.filter((emp) => emp.id !== id)); // Cập nhật UI sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên.");
      }
    }
  };

  return (
    <div className="employees">
      <Sidebar />
      <div className="content">
        <h1>Danh sách nhân viên</h1>
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
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" href={`/employees/${emp.id}`}>
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

export default Employees;

*/
