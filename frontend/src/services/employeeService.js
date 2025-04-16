import axiosClient from "./axiosClient";
const apiUrl = process.env.REACT_APP_API_URL;

export const getEmployees = async () => {
  const response = await axiosClient.get("/users");
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await axiosClient.get(`/users/${id}`);
  return response.data;
};

export const addEmployee = async (employeeData) => {
  const response = await axiosClient.post("/users", employeeData);
  return response.data;
};


export const updateEmployee = async (id, updatedData) => {
  const response = await axiosClient.put(`/users/${id}`, updatedData);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axiosClient.delete(`/users/${id}`);
  if (response.status === 200) {
    return { message: "Xóa nhân viên thành công" };
  }
  throw new Error("Xóa nhân viên thất bại");
};
