import React, { useState, useEffect } from 'react';
import { deleteAttendance, getUserAttendanceByRange } from '~/services/attendanceService';
import { getEmployees } from '~/services/employeeService';
import {
  Table,
  DatePicker,
  Button,
  Card,
  Badge,
  Modal,
  message,
  List,
  Row,
  Col,
  Typography,
  Space,
  Popconfirm,
} from 'antd';
import Loading from '~/components/Loading/Loading';
import dayjs from 'dayjs';
import EditAttendanceForm from './EditAttendanceForm';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserAttendanceHistory = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Lỗi lấy danh sách nhân viên:', error);
      }
    };
    fetchEmployees();
  }, []);

  const fetchAttendance = async (userId) => {
    if (!userId || !month) {
      setModalMessage('Vui lòng chọn nhân viên và tháng.');
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);
      const startDate = month.startOf('month').format('YYYY-MM-DD');
      const endDate = month.endOf('month').format('YYYY-MM-DD');
      const data = await getUserAttendanceByRange(userId, startDate, endDate);
      setAttendances(data || []);
    } catch (error) {
      console.error('Lỗi lấy lịch sử chấm công:', error);
      message.error('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmployee = (employee) => {
    setSelectedUser(employee);
    fetchAttendance(employee.userId);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      message.success('Xóa chấm công thành công!');
      fetchAttendance(selectedUser.userId);
    } catch (error) {
      console.error('Lỗi xóa chấm công:', error);
      message.error('Xóa thất bại!');
    }
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingId(null);
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      align: 'center',
    },
    {
      title: 'Thời gian vào',
      dataIndex: 'checkIn',
      key: 'checkIn',
      align: 'center',
      render: (text) => text || '-',
    },
    {
      title: 'Thời gian ra',
      dataIndex: 'checkOut',
      key: 'checkOut',
      align: 'center',
      render: (text) => text || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'checkOut',
      key: 'status',
      align: 'center',
      render: (checkOut) =>
        checkOut ? <Badge status="success" text="Đã checkout" /> : <Badge status="error" text="Chưa checkout" />,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="default" onClick={() => handleEdit(record.key)}></Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa chấm công này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} type="default" danger></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Title level={3}>Lịch sử chấm công nhân viên</Title>

      <Row gutter={16}>
        {/* Danh sách nhân viên */}
        <Col span={6}>
          <Card title="Danh sách nhân viên" style={{ height: '100%' }}>
            <List
              dataSource={employees}
              loading={!employees.length}
              renderItem={(emp) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    background: selectedUser?.userId === emp.userId ? '#e6f7ff' : '',
                  }}
                  onClick={() => handleSelectEmployee(emp)}
                >
                  <Text strong>{emp.fullName}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Bảng chấm công */}
        <Col span={18}>
          <Card
            title={selectedUser ? `Chấm công của ${selectedUser.fullName}` : 'Chọn một nhân viên để xem dữ liệu'}
            extra={
              <DatePicker
                picker="month"
                value={month}
                onChange={(value) => {
                  setMonth(value);
                  console.log(value);
                  
                  console.log('Selected month:', value.format('YYYY-MM-DD'));
                  
                  if (selectedUser) fetchAttendance(selectedUser.userId);
                }}
              />
            }
          >
            {loading ? (
              <Loading />
            ) : (
              <Table
                columns={columns}
                dataSource={attendances.map((item) => ({
                  key: item.attendanceId,
                  ...item,
                }))}
                pagination={{ pageSize: 10 }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title="Thông báo"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText="Đóng"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>{modalMessage}</p>
      </Modal>

      <EditAttendanceForm visible={showEditForm} onClose={closeEditForm} attendanceId={editingId} />
    </div>
  );
};

export default UserAttendanceHistory;
