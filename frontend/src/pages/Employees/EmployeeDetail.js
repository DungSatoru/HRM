import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartmentById } from '~/services/departmentService';
import { getEmployeeById } from '~/services/employeeService';
import { getPositionById } from '~/services/positionService';
import { getRoleById } from '~/services/roleService';
import { Card, Avatar, Tag, Button, Spin, Divider, Descriptions, Space, Row, Col, Typography } from 'antd';
import {
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
  ArrowLeftOutlined,
  EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [positionName, setPositionName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeDetail();
  }, [id]);

  const fetchEmployeeDetail = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeById(id);
      const departmentData = await getDepartmentById(data.departmentId);
      const positionData = await getPositionById(data.positionId);
      const roleData = await getRoleById(data.roleId);
      setDepartmentName(departmentData.departmentName);
      setPositionName(positionData.positionName);
      setRoleName(roleData.roleName);
      setEmployee(data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải thông tin nhân viên:', error);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );

  if (!employee) return <div>Không tìm thấy thông tin nhân viên</div>;

  const statusColor =
    {
      ACTIVE: 'green',
      PROBATION: 'blue',
      ON_LEAVE: 'gold',
      RESIGNED: 'orange',
      TERMINATED: 'red',
      RETIRED: 'gray',
    }[employee.status] || 'default';

  const statusText =
    {
      ACTIVE: 'Đang làm việc',
      PROBATION: 'Đang thử việc',
      ON_LEAVE: 'Đang nghỉ phép',
      RESIGNED: 'Đã nghỉ việc',
      TERMINATED: 'Bị sa thải',
      RETIRED: 'Nghỉ hưu',
    }[employee.status] || 'Không xác định';

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Row align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/employees')}
            style={{ marginRight: 16 }}
          >
            Quay lại
          </Button>
        </Col>
        <Col flex="auto">
          <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
            Hồ sơ nhân viên
          </Title>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 24,
          }}
        >
          <Space size={24} align="center">
            <Avatar
              size={100}
              src={employee.profileImageUrl ? `${process.env.REACT_APP_SERVER_URL}${employee.profileImageUrl}` : null}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#f5f5f5', border: '2px solid #d9d9d9' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Title level={3} style={{ margin: 0, marginRight: 12 }}>
                  {employee.fullName}
                </Title>
                <Tag color={statusColor} style={{ fontSize: 14, padding: '2px 8px' }}>
                  {statusText}
                </Tag>
              </div>
              <Text strong style={{ display: 'block', color: '#666', fontSize: 16 }}>
                {positionName}
              </Text>
              <Text type="secondary" style={{ display: 'block', fontSize: 14 }}>
                {departmentName}
              </Text>
            </div>
          </Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/employees/${id}/edit`)}>
            Chỉnh sửa
          </Button>
        </div>

        <Divider orientation="left" style={{ margin: '24px 0' }}>
          Thông tin cá nhân
        </Divider>
        <Descriptions bordered column={2}>
          <Descriptions.Item
            label={
              <span>
                <IdcardOutlined /> Tên tài khoản
              </span>
            }
          >
            {employee.username}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <IdcardOutlined /> CCCD
              </span>
            }
          >
            {employee.identity}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <MailOutlined /> Email
              </span>
            }
          >
            {employee.email}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <PhoneOutlined /> Số điện thoại
              </span>
            }
          >
            {employee.phone}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <CalendarOutlined /> Ngày sinh
              </span>
            }
          >
            {employee.dateOfBirth ? dayjs(employee.dateOfBirth).format('DD/MM/YYYY') : 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label={<span>{employee.gender ? <ManOutlined /> : <WomanOutlined />} Giới tính</span>}>
            {employee.gender ? 'Nam' : 'Nữ'}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <HomeOutlined /> Địa chỉ
              </span>
            }
            span={2}
          >
            {employee.address || 'Chưa cập nhật'}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left" style={{ margin: '24px 0' }}>
          Thông tin công việc
        </Divider>
        <Descriptions bordered column={2}>
          <Descriptions.Item
            label={
              <span>
                <SolutionOutlined /> Vai trò
              </span>
            }
          >
            {roleName}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <StarOutlined /> Chức vụ
              </span>
            }
          >
            {positionName}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <TeamOutlined /> Phòng ban
              </span>
            }
          >
            {departmentName}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <CalendarOutlined /> Ngày vào làm
              </span>
            }
          >
            {dayjs(employee.hireDate).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <ContactsOutlined /> Người liên hệ khẩn
              </span>
            }
          >
            {employee.emergencyContactName || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <PhoneOutlined /> SĐT liên hệ khẩn
              </span>
            }
          >
            {employee.emergencyContactPhone || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <FileTextOutlined /> Loại hợp đồng
              </span>
            }
          >
            {employee.contractType || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <BookOutlined /> Trình độ học vấn
              </span>
            }
          >
            {employee.educationLevel || 'Chưa cập nhật'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default EmployeeDetail;
