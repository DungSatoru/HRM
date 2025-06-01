import React, { useState, useEffect } from 'react';
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
  Input,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { deleteAttendance, getUserAttendanceByRange } from '~/services/attendanceService';
import { getEmployees } from '~/services/employeeService';
import Loading from '~/components/Loading/Loading';
import AttendanceForm from '~/components/AttendanceForm/AttendanceForm';

const { Title, Text } = Typography;

const UserAttendanceHistory = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month'),
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!userId) {
      setModalMessage('Vui lòng chọn nhân viên.');
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);
      const startDate = dateRange.start.format('YYYY-MM-DD');
      const endDate = dateRange.end.format('YYYY-MM-DD');
      const data = await getUserAttendanceByRange(userId, startDate, endDate);
      setAttendances(data || []);
    } catch (error) {
      console.error('Lỗi lấy lịch sử chấm công:', error);
      message.error('Không thể tải dữ liệu chấm công');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmployee = (employee) => {
    setSelectedUser(employee);
    fetchAttendance(employee.userId);
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      setDateRange({
        start: start.startOf('day'),
        end: end.endOf('day'),
      });

      if (selectedUser) {
        fetchAttendance(selectedUser.userId);
      }
    }
  };

  const handleEdit = (id) => {
    setFormMode('edit');
    setEditingId(id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      message.success('Xóa chấm công thành công!');
      if (selectedUser) {
        fetchAttendance(selectedUser.userId);
      }
    } catch (error) {
      console.error('Lỗi xóa chấm công:', error);
      message.error('Xóa thất bại!');
    }
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingId(null);
    if (selectedUser) {
      fetchAttendance(selectedUser.userId);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      align: 'center',
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
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
      key: 'status',
      align: 'center',
      render: (_, record) =>
        record.checkOut ? <Badge status="success" text="Đã checkout" /> : <Badge status="error" text="Chưa checkout" />,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.attendanceId)} />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa chấm công này?"
            onConfirm={() => handleDelete(record.attendanceId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container user-attendances-container">
      <h2 className="page-title">Lịch sử chấm công nhân viên</h2>
      <Title level={3}></Title>

      <Row gutter={16} style={{ overflow: 'hidden' }}>
        {/* Danh sách nhân viên */}
        <Col span={6}>
          <Card title="Danh sách nhân viên" style={{ height: '100%' }}>
            <Input.Search
              placeholder="Tìm nhân viên"
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ marginBottom: 12 }}
            />
            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
              <List
                dataSource={filteredEmployees}
                loading={!employees.length}
                renderItem={(emp) => (
                  <List.Item
                    style={{
                      cursor: 'pointer',
                      background: selectedUser?.userId === emp.userId ? '#e6f7ff' : '',
                      padding: '12px 16px',
                    }}
                    onClick={() => handleSelectEmployee(emp)}
                  >
                    <Text strong>{emp.fullName}</Text>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>

        {/* Bảng chấm công */}
        <Col span={18}>
          <Card
            title={selectedUser ? `Chấm công của ${selectedUser.fullName}` : 'Chọn một nhân viên để xem dữ liệu'}
            extra={
              <Space>
                <DatePicker.RangePicker
                  value={[dateRange.start, dateRange.end]}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                />
              </Space>
            }
          >
            {loading ? (
              <Loading />
            ) : (
              <Table
                columns={columns}
                dataSource={attendances}
                rowKey="attendanceId"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
                locale={{ emptyText: 'Không có dữ liệu chấm công' }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal thông báo */}
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

      {/* AttendanceForm */}
      <AttendanceForm
        visible={formVisible}
        onClose={closeForm}
        onSuccess={closeForm}
        attendanceId={editingId}
        mode={formMode}
        userId={selectedUser?.userId}
      />
    </div>
  );
};

export default UserAttendanceHistory;
