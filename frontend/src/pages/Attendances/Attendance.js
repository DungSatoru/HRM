import { type } from '@testing-library/user-event/dist/type';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '~/components/DataTable/DataTable';
import Loading from '~/components/Loading/Loading';
import { getAttendances } from '~/services/attendanceService';
import EditAttendanceForm from './EditAttendanceForm';

const Attendance = () => {
  const today = new Date().toISOString().split('T')[0];
  const [attendances, setAttendances] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (id) => {
    setEditingId(id);
    setShowEditForm(true);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchAttendancesByDate(selectedDate);
  }, [selectedDate]);

  const fetchAttendancesByDate = async (date) => {
    try {
      setLoading(true);
      const data = await getAttendances(date);
      setAttendances(data || []);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
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

  const mappedData = attendances?.map((item, index) => ({
    key: item.attendanceId,
    stt: index + 1,
    fullName: item.fullName || 'Không tên',
    userId: item.userId,
    checkIn: item.checkIn || '-',
    checkOut: item.checkOut || '-',
    duration: item.checkIn && item.checkOut ? calculateDuration(item.checkIn, item.checkOut) : 'Dữ liệu chưa đủ',
    status: item.checkOut ? 'Đã chấm công' : 'Chưa checkout',
  }));

  // Định nghĩa cấu trúc cột
  const columns = [
    {
      key: 'stt',
      title: 'STT',
      dataIndex: 'stt',
      width: '5%',
      centerAlign: true,
    },
    {
      key: 'fullName',
      title: 'Họ tên',
      dataIndex: 'fullName',
      width: '20%',
    },
    {
      key: 'checkIn',
      title: 'Thời gian vào',
      dataIndex: 'checkIn',
      width: '15%',
      centerAlign: true,
    },
    {
      key: 'checkOut',
      title: 'Thời gian ra',
      dataIndex: 'checkOut',
      width: '15%',
      centerAlign: true,
    },
    {
      key: 'duration',
      title: 'Tổng giờ',
      dataIndex: 'duration',
      width: '15%',
      centerAlign: true,
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '15%',
      centerAlign: true,
      type: 'badge',
      badgeClass: (row) => (row.checkOut != '-' ? 'bg-success' : 'bg-danger'),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '20%',
      centerAlign: true,
      type: 'actions',
      showEdit: true,
      showDelete: true,
      idField: 'key',
    },
  ];

  return (
    <div className="page-container attendance-container">
      <h2 className="page-title">Theo dõi chấm công theo ngày</h2>

      <div className="card-container">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 htmlFor="date-picker" className="card-title">
                  Chọn ngày
                </h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="fas fa-calendar-day"></i>
                    </span>
                    <input
                      id="date-picker"
                      type="date"
                      className="form-control"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title m-0">Danh sách chấm công ngày {formatDate(selectedDate)}</h5>
          <span className="badge bg-primary">{attendances.length} Nhân viên</span>
        </div>
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : (
            <DataTable
              columns={columns}
              data={mappedData}
              emptyMessage={{
                icon: 'fas fa-clock',
                text: 'Không tìm thấy dữ liệu chấm công',
              }}
              onEdit={handleEdit}
              // onEdit={(id) => navigate(`/attendances/${id}/edit`)}
              //   onDelete={openModal}

              detailsPa
              th="/attendance"
            />
          )}
        </div>
      </div>
      <EditAttendanceForm visible={showEditForm} onClose={closeEditForm} attendanceId={editingId} />
    </div>
  );
};

export default Attendance;
