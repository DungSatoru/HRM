import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, DatePicker, message, Card, Spin } from 'antd';
import { addEmployee, updateEmployee, getEmployeeById } from '~/services/employeeService';
import { getDepartments } from '~/services/departmentService';
import { getPositions } from '~/services/positionService';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import moment from 'moment';
import './EmployeeForm.css';
import { getRoleById } from '~/services/roleService';

const { Option } = Select;

const EmployeeForm = ({ isEdit = false, employeeId = null }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchData();
  }, [employeeId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [depData, posData] = await Promise.all([getDepartments(), getPositions()]);
      setDepartments(depData || []);
      setPositions(posData || []);

      if (isEdit && employeeId) {
        const employeeData = await getEmployeeById(employeeId);
        if (employeeData) {
          const role = await getRoleById(employeeData.roleId);
          if (employeeData.profileImageUrl) {
            setImageUrl(`${SERVER_URL}${employeeData.profileImageUrl}`);
          }

          form.setFieldsValue({
            username: employeeData.username,
            fullName: employeeData.fullName,
            identity: employeeData.identity,
            email: employeeData.email,
            phone: employeeData.phone,
            roleName: role.roleName,
            positionId: employeeData.positionId,
            departmentId: employeeData.departmentId,
            status: employeeData.status,
            hireDate: employeeData.hireDate ? moment(employeeData.hireDate.split('T')[0]) : null,
            gender: employeeData.gender,
            dateOfBirth: employeeData.dateOfBirth ? moment(employeeData.dateOfBirth) : null,
            address: employeeData.address,
            profileImageUrl: employeeData.profileImageUrl,
            emergencyContactName: employeeData.emergencyContactName,
            emergencyContactPhone: employeeData.emergencyContactPhone,
            contractType: employeeData.contractType,
            educationLevel: employeeData.educationLevel,
          });
        } else {
          message.error('Không tìm thấy thông tin nhân viên');
          navigate('/employees');
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    const selectedPosition = positions.find((pos) => pos.positionId === values.positionId);
    const selectedDepartment = departments.find((dep) => dep.departmentId === values.departmentId);

    const data = {
      username: values.username,
      identity: values.identity,
      email: values.email,
      phone: values.phone,
      fullName: values.fullName,
      roleId: values.roleId,
      departmentId: selectedDepartment?.departmentId,
      positionId: selectedPosition?.positionId,
      status: values.status,
      hireDate: values.hireDate.format('YYYY-MM-DD'),
      gender: values.gender,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      address: values.address,
      profileImageUrl: values.profileImageUrl,
      emergencyContactName: values.emergencyContactName,
      emergencyContactPhone: values.emergencyContactPhone,
      contractType: values.contractType,
      educationLevel: values.educationLevel,
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateEmployee(employeeId, data, imageFile);
        message.success('Cập nhật thông tin nhân viên thành công!');
      } else {
        await addEmployee(data, imageFile);
        message.success('Thêm nhân viên thành công!');
      }
      // navigate('/employees');
    } catch (error) {
      console.error(`Lỗi khi ${isEdit ? 'cập nhật' : 'thêm'} nhân viên:`, error);
      message.error(`${isEdit ? 'Cập nhật' : 'Thêm'} nhân viên thất bại!`);
    } finally {
      setSubmitting(false);
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="page-container employees-container">
      <h2 className="page-title">{isEdit ? 'Chỉnh Sửa Thông Tin Nhân Viên' : 'Thêm Nhân Viên'}</h2>
      <Card>
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            // initialValues={{
            //   roleName: 'Nhân viên',
            //   status: 'ACTIVE',
            // }}
          >
            {/* Ảnh đại diện */}
            <div className="row">
              <div className="col-md-6">
                <Form.Item label="Ảnh đại diện">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={async (file) => {
                      const base64 = await getBase64(file);
                      setImageUrl(base64);
                      setImageFile(file);
                      return false; // Không upload ngay
                    }}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </div>
            </div>

            {/* Thông tin cá nhân */}
            <div className="form-section">
              <h6 className="section-title">
                <i className="fas fa-id-card section-icon"></i>Thông tin cá nhân
              </h6>
              <div className="row">
                <div className="col-md-4">
                  <Form.Item
                    label="Tên tài khoản"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
                  >
                    <Input placeholder="Tên tài khoản" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    label="Họ và Tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                  >
                    <Input placeholder="Họ và Tên" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    label="Căn cước công dân"
                    name="identity"
                    rules={[{ required: true, message: 'Vui lòng nhập căn cước công dân' }]}
                  >
                    <Input placeholder="Căn cước công dân" />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div className="form-section">
              <h6 className="section-title">
                <i className="fas fa-address-book section-icon"></i>Thông tin liên hệ
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email', type: 'email' }]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input placeholder="Số điện thoại" />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Thông tin công việc */}
            <div className="form-section">
              <h6 className="section-title">
                <i className="fas fa-briefcase section-icon"></i>Thông tin công việc
              </h6>
              <div className="row">
                <div className="col-md-4">
                  <Form.Item label="Vai trò" name="roleName">
                    <Input value="Nhân viên" disabled />
                  </Form.Item>
                </div>
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
                <div className="col-md-6">
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
                <div className="col-md-6">
                  <Form.Item
                    label="Ngày vào làm"
                    name="hireDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Thông tin bổ sung */}
            <div className="form-section">
              <h6 className="section-title">
                <i className="fas fa-user section-icon"></i>Thông tin bổ sung
              </h6>
              <div className="row">
                <div className="col-md-4">
                  <Form.Item label="Ngày sinh" name="dateOfBirth">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item label="Giới tính" name="gender">
                    <Select placeholder="Chọn giới tính">
                      <Option value={true}>Nam</Option>
                      <Option value={false}>Nữ</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item label="Địa chỉ" name="address">
                    <Input placeholder="Địa chỉ" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item label="Người liên hệ khẩn" name="emergencyContactName">
                    <Input placeholder="Tên người liên hệ" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item label="SĐT người liên hệ" name="emergencyContactPhone">
                    <Input placeholder="Số điện thoại" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item label="Loại hợp đồng" name="contractType">
                    <Input placeholder="Loại hợp đồng" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item label="Trình độ học vấn" name="educationLevel">
                    <Input placeholder="Trình độ học vấn" />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <Button type="primary" htmlType="submit" loading={submitting} className="submit-button">
                {isEdit ? 'Lưu thay đổi' : 'Lưu'}
              </Button>
              <Button onClick={() => navigate('/employees')} disabled={submitting}>
                Hủy
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default EmployeeForm;
