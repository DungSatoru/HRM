import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  message,
  Card,
  Spin,
  Upload,
  Row,
  Col,
  Divider,
  Typography,
  Avatar,
  Space,
} from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  HomeOutlined,
  SolutionOutlined,
  TeamOutlined,
  StarOutlined,
  ContactsOutlined,
  FileTextOutlined,
  BookOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { addEmployee, updateEmployee, getEmployeeById } from '~/services/employeeService';
import { getDepartments } from '~/services/departmentService';
import { getPositions } from '~/services/positionService';
import { getRoleById } from '~/services/roleService';
import moment from 'moment';

const { Option } = Select;
const { Title } = Typography;

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
            roleName: employeeId === null ? 'ROLE_EMPLOYEE' : role.roleName,
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
      roleId: employeeId === null ? 5 : values.roleId,
      departmentId: selectedDepartment?.departmentId,
      positionId: selectedPosition?.positionId,
      status: values.status,
      hireDate: values.hireDate.format('YYYY-MM-DD'),
      gender: values.gender,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      address: values.address,
      profileImageUrl: imageFile ? undefined : imageUrl.replace(SERVER_URL, ''),
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
      navigate('/employees');
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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        {isEdit ? 'Chỉnh Sửa Thông Tin Nhân Viên' : 'Thêm Nhân Viên'}
      </Title>

      <Card
        bordered={false}
        style={{
          boxShadow:
            '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
          borderRadius: 8,
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* Ảnh đại diện */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Ảnh đại diện">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={async (file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error('Bạn chỉ có thể tải lên file ảnh!');
                        return false;
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error('Ảnh phải nhỏ hơn 2MB!');
                        return false;
                      }
                      const base64 = await getBase64(file);
                      setImageUrl(base64);
                      setImageFile(file);
                      return false;
                    }}
                    style={{ width: '100%' }}
                  >
                    {imageUrl ? (
                      <Avatar src={imageUrl} size={100} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            {/* Thông tin cá nhân */}
            <Divider orientation="left" style={{ marginTop: 0 }}>
              <SolutionOutlined /> Thông tin cá nhân
            </Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Tên tài khoản"
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Tên tài khoản" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Họ và Tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Họ và Tên" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Căn cước công dân"
                  name="identity"
                  rules={[{ required: true, message: 'Vui lòng nhập căn cước công dân' }]}
                >
                  <Input prefix={<IdcardOutlined />} placeholder="Căn cước công dân" />
                </Form.Item>
              </Col>
            </Row>

            {/* Thông tin liên hệ */}
            <Divider orientation="left">
              <ContactsOutlined /> Thông tin liên hệ
            </Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Vui lòng nhập email', type: 'email' }]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
            </Row>

            {/* Thông tin công việc */}
            <Divider orientation="left">
              <TeamOutlined /> Thông tin công việc
            </Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Vai trò" name="roleName">
                  <Input prefix={<SolutionOutlined />} value="Nhân viên" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Chức vụ"
                  name="positionId"
                  rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn chức vụ"
                    suffixIcon={<StarOutlined />}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  >
                    {positions.map((pos) => (
                      <Option key={pos.positionId} value={pos.positionId}>
                        {pos.positionName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Phòng ban"
                  name="departmentId"
                  rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn phòng ban"
                    suffixIcon={<TeamOutlined />}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  >
                    {departments.map((dep) => (
                      <Option key={dep.departmentId} value={dep.departmentId}>
                        {dep.departmentName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="ACTIVE">Đang làm việc chính thức</Option>
                    <Option value="ON_LEAVE">Đang nghỉ phép</Option>
                    <Option value="PROBATION">Đang thử việc</Option>
                    <Option value="RESIGNED">Đã nghỉ việc (tự nguyện)</Option>
                    <Option value="TERMINATED">Bị cho nghỉ việc</Option>
                    <Option value="RETIRED">Nghỉ hưu</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Ngày vào làm"
                  name="hireDate"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm' }]}
                >
                  <DatePicker style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            {/* Thông tin bổ sung */}
            <Divider orientation="left">
              <UserOutlined /> Thông tin bổ sung
            </Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Ngày sinh" name="dateOfBirth">
                  <DatePicker style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Giới tính" name="gender">
                  <Select placeholder="Chọn giới tính">
                    <Option value={true}>
                      <ManOutlined /> Nam
                    </Option>
                    <Option value={false}>
                      <WomanOutlined /> Nữ
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Địa chỉ" name="address">
                  <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Người liên hệ khẩn" name="emergencyContactName">
                  <Input prefix={<ContactsOutlined />} placeholder="Tên người liên hệ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="SĐT người liên hệ" name="emergencyContactPhone">
                  <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Loại hợp đồng" name="contractType">
                  <Select placeholder="Chọn loại hợp đồng">
                    <Option value="PROBATION">Hợp đồng thử việc</Option>
                    <Option value="FIXED_TERM">Hợp đồng xác định thời hạn</Option>
                    <Option value="UNLIMITED_TERM">Hợp đồng không xác định thời hạn</Option>
                    <Option value="SEASONAL">Hợp đồng thời vụ</Option>
                    <Option value="PART_TIME">Hợp đồng bán thời gian</Option>
                    <Option value="INTERNSHIP">Hợp đồng thực tập</Option>
                    <Option value="FREELANCE">Hợp đồng khoán việc</Option>
                    <Option value="SERVICE">Hợp đồng dịch vụ</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Trình độ học vấn" name="educationLevel">
                  <Select placeholder="Chọn trình độ học vấn">
                    <Option value="PRIMARY">Tiểu học</Option>
                    <Option value="SECONDARY">Trung học cơ sở</Option>
                    <Option value="HIGH_SCHOOL">Trung học phổ thông</Option>
                    <Option value="VOCATIONAL">Trung cấp</Option>
                    <Option value="COLLEGE">Cao đẳng</Option>
                    <Option value="BACHELOR">Đại học</Option>
                    <Option value="MASTER">Thạc sĩ</Option>
                    <Option value="DOCTOR">Tiến sĩ</Option>
                    <Option value="OTHER">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Actions */}
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => navigate('/employees')} disabled={submitting} icon={<CloseOutlined />}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={submitting} icon={<SaveOutlined />}>
                  {isEdit ? 'Lưu thay đổi' : 'Lưu'}
                </Button>
              </Space>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default EmployeeForm;
