import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, DatePicker, Button, Card, Badge, Modal, message,
  List, Row, Col, Typography, Space, Popconfirm, Input
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { deleteAttendance, getUserAttendanceByRange } from '~/services/attendanceService';
import { getEmployees } from '~/services/employeeService';
import Loading from '~/components/Loading/Loading';
import AttendanceForm from '~/components/AttendanceForm/AttendanceForm';

const { Title, Text } = Typography;

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
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSelectEmployee = (employee) => setSelectedUser(employee);

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
        record.checkOut
          ? <Badge status="success" text="Đã checkout" />
          : <Badge status="error" text="Chưa checkout" />,
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
    <div className="page-container user-attendances-container">
      <h2 className="page-title">Lịch sử chấm công nhân viên</h2>

      <Row gutter={16}>
        <Col span={6}>
          <Card title="Danh sách nhân viên">
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

        <Col span={18}>
          <Card
            title={selectedUser ? `Chấm công của ${selectedUser.fullName}` : 'Chọn nhân viên'}
            extra={
              <DatePicker.RangePicker
                value={[dateRange.start, dateRange.end]}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
              />
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
