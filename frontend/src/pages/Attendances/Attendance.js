import { useEffect, useState } from 'react';
import { Table, Card, DatePicker, Space, Badge, Button, Popconfirm, message } from 'antd';
import { getAttendances, deleteAttendance } from '~/services/attendanceService';
import Loading from '~/components/Loading/Loading';
import dayjs from 'dayjs';
import { CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import AttendanceForm from '~/components/AttendanceForm/AttendanceForm';
import { getEmployees } from '~/services/employeeService';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empData, attData] = await Promise.all([
          getEmployees(),
          getAttendances(selectedDate.format('YYYY-MM-DD')),
        ]);
        setEmployees(empData);
        setAttendances(attData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const getEmployeeName = (userId) => {
    const employee = employees.find((emp) => emp.userId === userId);
    return employee ? employee.fullName : 'Không tên';
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return null;
    const [h1, m1, s1] = checkIn.split(':').map(Number);
    const [h2, m2, s2] = checkOut.split(':').map(Number);

    const start = new Date(0, 0, 0, h1, m1, s1);
    const end = new Date(0, 0, 0, h2, m2, s2);
    const diff = new Date(end - start);

    const hours = diff.getUTCHours().toString().padStart(2, '0');
    const minutes = diff.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setFormMode('edit');
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      message.success('Xóa chấm công thành công!');
      fetchAttendancesByDate(selectedDate.format('YYYY-MM-DD'));
    } catch (error) {
      console.error('Lỗi xóa chấm công:', error);
      message.error('Xóa thất bại!');
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormMode('create');
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingId(null);
  };

  const fetchAttendancesByDate = async (date) => {
    setLoading(true);
    try {
      const data = await getAttendances(date);
      setAttendances(data || []);
    } catch (error) {
      console.error('Error fetching attendances:', error);
      message.error('Không thể tải dữ liệu chấm công');
    } finally {
      setLoading(false);
    }
  };

  const mappedData = (Array.isArray(attendances) ? attendances : []).map((item, index) => ({
    key: item.attendanceId || 'Không có ID',
    stt: index + 1,
    fullName: item.userId ? getEmployeeName(item.userId) : 'Tên không có',
    checkIn: item.checkIn ? item.checkIn : '-',
    checkOut: item.checkOut ? item.checkOut : '-',
    duration: item.checkIn && item.checkOut ? calculateDuration(item.checkIn, item.checkOut) : 'Dữ liệu chưa đủ',
    status: item.checkOut ? 'Đã chấm công' : item.checkIn ? 'Chưa checkout' : 'Chưa chấm công',
  }));

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 60,
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Thời gian vào',
      dataIndex: 'checkIn',
      key: 'checkIn',
      align: 'center',
    },
    {
      title: 'Thời gian ra',
      dataIndex: 'checkOut',
      key: 'checkOut',
      align: 'center',
    },
    {
      title: 'Tổng giờ',
      dataIndex: 'duration',
      key: 'duration',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) =>
        status === 'Đã chấm công' ? (
          <Badge status="success" text="Đã checkout" />
        ) : (
          <Badge status="error" text="Chưa checkout" />
        ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record.key)}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa chấm công này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container attendance-container">
      <h2 className="page-title">Theo dõi chấm công theo ngày</h2>

      <Card style={{ marginBottom: 24 }}>
        <Space direction="horizontal" size="middle">
          <DatePicker
            value={selectedDate}
            format="DD/MM/YYYY"
            onChange={(date) => setSelectedDate(date)}
            suffixIcon={<CalendarOutlined />}
          />
          <Badge count={`${attendances.length} bản ghi`} style={{ backgroundColor: '#1890ff' }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo mới chấm công
          </Button>
        </Space>
      </Card>

      <Card>
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            dataSource={mappedData}
            rowKey="key"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: 'Không có dữ liệu chấm công' }}
          />
        )}
      </Card>

      <AttendanceForm
        visible={formVisible}
        onClose={closeForm}
        onSuccess={() => fetchAttendancesByDate(selectedDate.format('YYYY-MM-DD'))}
        attendanceId={editingId}
        mode={formMode}
      />
    </div>
  );
};

export default Attendance;
