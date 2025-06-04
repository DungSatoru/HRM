import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { getEmployees } from '~/services/employeeService';
import { getRoles } from '~/services/roleService';
import { getDepartments } from '~/services/departmentService';
import { assignRole } from '~/services/employeeService'; // Import assignRole

const UserPermission = () => {
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRolesAndUsers = async () => {
      try {
        setLoading(true);
        const fetchedRoles = await getRoles();
        setRoles(fetchedRoles);

        const fetchedUsers = await getEmployees();
        setUsers(fetchedUsers);

        const fetchedDepartments = await getDepartments();
        setDepartments(fetchedDepartments);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

  // Lấy các vai trò và người dùng khi component mount
  useEffect(() => {
    

    fetchRolesAndUsers();
  }, []);

  // Hàm xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Hàm thay đổi quyền người dùng (gọi assignRole từ service)
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Gọi assignRole từ service để phân quyền cho nhân viên
      const updatedUser = await assignRole(userId, newRole);

      // Cập nhật danh sách người dùng sau khi thay đổi quyền
      const updatedUsers = users.map((user) =>
        user.userId === userId ? { ...user, roleId: updatedUser.roleId } : user
      );
      setUsers(updatedUsers);
      fetchRolesAndUsers();
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật quyền');
    }
  };

  // Lọc người dùng theo tên hoặc email
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Columns cho bảng
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'departmentId',
      key: 'departmentId',
      render: (departmentId) => {
        const department = departments.find((d) => d.departmentId === departmentId);
        return department ? department.departmentName : 'Chưa có phòng ban';
      },
      filters: departments.map((dept) => ({
        text: dept.departmentName,
        value: dept.departmentId,
      })),
      onFilter: (value, record) => record.departmentId === value, // So sánh departmentId
    },
    {
      title: 'Quyền hiện tại',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId) => {
        const role = roles.find((r) => r.roleId === roleId); // Sửa so sánh đúng với roleId
        return role ? role.roleName : 'Chưa có quyền';
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => (
        <Select
          defaultValue={record.roleId} // Thay role thành roleId để hợp lý với dữ liệu
          style={{ width: 120 }}
          onChange={(value) => handleRoleChange(record.userId, value)} // Sử dụng userId thay vì id
        >
          {roles.map((role) => (
            <Select.Option key={role.roleId} value={role.roleId}>
              {role.roleName}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div className="page-container user-permission-container" style={{ padding: '20px' }}>
      <h2 className="page-title">Phân quyền người dùng</h2>

      {/* Tìm kiếm người dùng */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Tìm kiếm người dùng"
          value={search}
          onChange={handleSearchChange}
          style={{ width: '80%', padding: '8px' }}
        />
      </div>

      {/* Bảng danh sách người dùng */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="userId" // Sửa lại rowKey cho đúng với dữ liệu người dùng
        pagination={false}
        loading={loading}
        style={{ marginBottom: '20px' }}
      />
    </div>
  );
};

export default UserPermission;
