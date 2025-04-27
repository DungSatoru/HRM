import React, { useState, useEffect } from 'react';
import { getUserAttendanceByRange } from '~/services/attendanceService';
import { getEmployees } from '~/services/employeeService';
import { Table, Input, DatePicker, Button, Card, AutoComplete, Badge, Modal, message } from 'antd';
import Loading from '~/components/Loading/Loading';
import dayjs from 'dayjs';

const UserAttendanceHistory = () => {
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

  const handleSearch = async () => {
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

  const options = employees.map((emp) => ({
    value: emp.fullName,
    label: `${emp.fullName} (${emp.userId})`,
    userId: emp.userId,
  }));

  const handleSelectEmployee = (value, option) => {
    setUserId(option.userId);
    setSearchTerm(value);
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
        checkOut ? (
          <Badge status="success" text="Đã checkout" />
        ) : (
          <Badge status="error" text="Chưa checkout" />
        ),
    },
  ];

  return (
    <div className="page-container">
      <h2 className="page-title">Lịch sử chấm công nhân viên</h2>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <AutoComplete
            style={{ width: 300 }}
            options={options}
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setUserId('');
            }}
            onSelect={handleSelectEmployee}
            placeholder="Tìm nhân viên..."
            filterOption={(inputValue, option) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
          <DatePicker
            picker="month"
            value={month}
            onChange={(value) => setMonth(value)}
            style={{ width: 180 }}
          />
          <Button type="primary" onClick={handleSearch}>
            Xem lịch sử
          </Button>
        </div>
      </Card>

      <Card>
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            dataSource={attendances?.map((item) => ({
              key: item.attendanceId,
              ...item,
            }))}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        title="Thông báo"
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText="Đóng"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default UserAttendanceHistory;
