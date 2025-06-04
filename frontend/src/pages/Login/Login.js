import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '~/services/authService';
import { Form, Input, Button, Typography, Alert, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const role = localStorage.getItem('roleName');
      const userId = localStorage.getItem('userId');
      if (role === 'ROLE_HR') navigate('/attendances');
      else navigate(`/attendances/user/${userId}`);
    }
  }, [navigate]);

  const onFinish = async ({ username, password }) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await authService.login(username, password);
    } catch (error) {
      // setErrorMsg('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row style={{ minHeight: '100vh' }}>
      {/* Bên trái - Màu xanh + thông tin */}
      <Col xs={0} md={12} style={{ backgroundColor: '#1677ff', color: 'white', padding: 64 }}>
        <Title style={{ color: 'white', marginBottom: 16 }}>HRM System</Title>
        <Text style={{ color: 'white', fontSize: 18 }}>Hệ thống quản lý nhân sự chuyên nghiệp</Text>
        <ul style={{ marginTop: 32, listStyle: 'none', padding: 0 }}>
          <li>
            <CheckCircleFilled /> Quản lý thông tin nhân viên
          </li>
          <li>
            <CheckCircleFilled /> Theo dõi thời gian làm việc
          </li>
          <li>
            <CheckCircleFilled /> Tạo báo cáo tùy chỉnh
          </li>
          <li>
            <CheckCircleFilled /> Quản lý lương và phúc lợi
          </li>
        </ul>
      </Col>

      {/* Bên phải - Form login */}
      <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 400, width: '100%', padding: 24 }}>
          <Title level={2}>Đăng nhập</Title>
          <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>

          {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginTop: 16 }} />}

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            style={{ marginTop: 24 }}
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
            </Form.Item>

            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Bạn quên mật khẩu? </Text>
            <Link onClick={() => console.log('Liên hệ quản trị viên')}>Liên hệ quản trị viên</Link>
          </div>
        </div>
      </Col>
    </Row>
  );
}
