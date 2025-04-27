import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, DatePicker, message, Card, Spin } from 'antd';
import { addEmployee } from '~/services/employeeService';
import { getDepartments } from '~/services/departmentService';
import { getPositions } from '~/services/positionService';
import './EmployeeCreate.css'; // Nếu bạn có CSS phụ trợ

const { Option } = Select;

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [depData, posData] = await Promise.all([getDepartments(), getPositions()]);
      setDepartments(depData || []);
      setPositions(posData || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmployee = async (values) => {
    const selectedPosition = positions.find((pos) => pos.positionId === values.positionId);
    const selectedDepartment = departments.find((dep) => dep.departmentId === values.departmentId);

    const data = {
      username: values.username,
      identity: values.identity,
      email: values.email,
      phone: values.phone,
      fullName: values.fullName,
      roleId: 5,
      departmentId: selectedDepartment?.departmentId,
      positionId: selectedPosition?.positionId,
      status: values.status,
      hireDate: values.hireDate.format('YYYY-MM-DD'), // Format ngày
    };

    try {
      await addEmployee(data);
      message.success('Thêm nhân viên thành công!');
      navigate('/employees');
    } catch (error) {
      console.error('Lỗi khi thêm nhân viên:', error);
      message.error('Thêm nhân viên thất bại!');
    }
  };

  return (
    <div className="page-container employees-container">
      <h2 className="page-title">Thêm Nhân Viên</h2>

      <Card>
        {loading ? (
          <Spin />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveEmployee}
            initialValues={{
              roleName: 'Nhân viên',
              status: 'ACTIVE',
            }}
          >
            <div className="row">
              {/* Tên tài khoản */}
              <div className="col-md-4">
                <Form.Item
                  label="Tên tài khoản"
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
                >
                  <Input placeholder="Tên tài khoản" />
                </Form.Item>
              </div>

              {/* Họ và tên */}
              <div className="col-md-4">
                <Form.Item
                  label="Họ và Tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                >
                  <Input placeholder="Họ và Tên" />
                </Form.Item>
              </div>

              {/* Căn cước công dân */}
              <div className="col-md-4">
                <Form.Item
                  label="Căn cước công dân"
                  name="identity"
                  rules={[{ required: true, message: 'Vui lòng nhập căn cước công dân' }]}
                >
                  <Input placeholder="Căn cước công dân" />
                </Form.Item>
              </div>

              {/* Email */}
              <div className="col-md-4">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Vui lòng nhập email', type: 'email' }]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </div>

              {/* Số điện thoại */}
              <div className="col-md-4">
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </div>

              {/* Vai trò */}
              <div className="col-md-4">
                <Form.Item label="Vai trò" name="roleName">
                  <Input value="Nhân viên" disabled />
                </Form.Item>
              </div>

              {/* Chức vụ */}
              <div className="col-md-4">
                <Form.Item
                  label="Chức vụ"
                  name="positionId"
                  rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                >
                  <Select placeholder="Chọn chức vụ">
                    {positions.map((pos) => (
                      <Option key={pos.positionId} value={pos.positionId}>
                        {pos.positionName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Phòng ban */}
              <div className="col-md-4">
                <Form.Item
                  label="Phòng ban"
                  name="departmentId"
                  rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                >
                  <Select placeholder="Chọn phòng ban">
                    {departments.map((dep) => (
                      <Option key={dep.departmentId} value={dep.departmentId}>
                        {dep.departmentName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Trạng thái */}
              <div className="col-md-4">
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                  <Select>
                    <Option value="ACTIVE">Đang làm việc</Option>
                    <Option value="INACTIVE">Nghỉ việc</Option>
                    <Option value="BANNED">Cấm hoạt động</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Ngày vào làm */}
              <div className="col-md-4">
                <Form.Item
                  label="Ngày vào làm"
                  name="hireDate"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </div>
            </div>

            {/* Button actions */}
            <Form.Item style={{ textAlign: 'center', marginTop: 20 }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
                Lưu
              </Button>
              <Button onClick={() => navigate('/employees')}>Hủy</Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default EmployeeCreate;
