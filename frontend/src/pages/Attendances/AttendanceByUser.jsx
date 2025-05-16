import React, { useState, useEffect } from 'react';
import {
  Table,
  DatePicker,
  Card,
  Badge,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { getUserAttendanceByRange } from '~/services/attendanceService';
import Loading from '~/components/Loading/Loading';

const AttendanceByUser = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month'),
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchAttendance();
  }, [dateRange]);

  const fetchAttendance = async () => {
    if (!userId) {
      message.error('Không tìm thấy userId trong localStorage');
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

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      setDateRange({
        start: start.startOf('day'),
        end: end.endOf('day'),
      });
    }
  };

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
  ];

  return (
    <div className="page-container user-attendances-container">
      <h2 className="page-title">Lịch sử chấm công của bạn</h2>
      <Card
        title="Bảng chấm công"
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
    </div>
  );
};

export default AttendanceByUser;
