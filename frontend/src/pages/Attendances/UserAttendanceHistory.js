import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  DatePicker,
  Button,
  Card,
  Badge,
  Modal,
  message,
  Row,
  Col,
  Typography,
  Space,
  Popconfirm,
  Select,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { deleteAttendance, getUserAttendanceByRange } from '~/services/attendanceService';
import { getEmployees } from '~/services/employeeService';
import Loading from '~/components/Loading/Loading';
import AttendanceForm from '~/components/AttendanceForm/AttendanceForm';

const { Text } = Typography;

const UserAttendanceHistory = () => {
  const [employees, setEmployees] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month'),
  });
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState({ visible: false, message: '' });

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch {
      message.error('Lỗi khi tải danh sách nhân viên');
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    if (!selectedUser) {
      setModal({ visible: true, message: 'Vui lòng chọn nhân viên.' });
      return;
    }
    setLoading(true);
    try {
      const startDate = dateRange.start.format('YYYY-MM-DD');
      const endDate = dateRange.end.format('YYYY-MM-DD');
      const data = await getUserAttendanceByRange(selectedUser.userId, startDate, endDate);
      setAttendances(data || []);
    } catch {
      message.error('Không thể tải dữ liệu chấm công');
    } finally {
      setLoading(false);
    }
  }, [selectedUser, dateRange]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (selectedUser) fetchAttendance();
  }, [selectedUser, dateRange, fetchAttendance]);

  const handleSelectEmployee = (userId) => {
    const user = employees.find((emp) => emp.userId === userId);
    setSelectedUser(user);
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange({
        start: dates[0].startOf('day'),
        end: dates[1].endOf('day'),
      });
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setFormMode('edit');
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      message.success('Xóa thành công!');
      fetchAttendance();
    } catch {
      message.error('Xóa thất bại!');
    }
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingId(null);
    fetchAttendance();
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
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
            title="Xác nhận xóa?"
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
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Lịch sử chấm công</h2>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} md={10}>
            <Select
              showSearch
              allowClear
              placeholder="Chọn nhân viên"
              style={{ width: '100%' }}
              optionFilterProp="children"
              value={selectedUser?.userId}
              onChange={handleSelectEmployee}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {employees.map((emp) => (
                <Select.Option key={emp.userId} value={emp.userId}>
                  {emp.fullName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={10}>
            <DatePicker.RangePicker
              value={[dateRange.start, dateRange.end]}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={4}>
            <Button type="primary" block disabled={!selectedUser} onClick={() => setFormVisible(true)}>
              Tạo chấm công
            </Button>
          </Col>
        </Row>
      </Card>

      <Card title={selectedUser ? `Chấm công - ${selectedUser.fullName}` : 'Chọn nhân viên để xem dữ liệu'}>
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            dataSource={attendances}
            rowKey="attendanceId"
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              defaultPageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} trên tổng ${total} bản ghi`,
            }}
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: 'Không có dữ liệu chấm công' }}
          />
        )}
      </Card>

      <Modal
        title="Thông báo"
        open={modal.visible}
        onOk={() => setModal({ visible: false, message: '' })}
        onCancel={() => setModal({ visible: false, message: '' })}
        okText="Đóng"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>{modal.message}</p>
      </Modal>

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
