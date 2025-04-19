import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '~/components/DataTable/DataTable';
import Loading from '~/components/Loading/Loading';
import { deleteAttendance, getAttendances } from '~/services/attendanceService';
import EditAttendanceForm from './EditAttendanceForm';
import Modal from '~/components/Modal/Modal';
import CreateAttendanceForm from './CreateAttendanceForm';
import { toast } from 'react-toastify';

const Attendance = () => {
  const today = new Date().toISOString().split('T')[0];
  const [attendances, setAttendances] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // ✅ Fetch lại dữ liệu sau khi thêm, sửa
  const refreshData = () => fetchAttendancesByDate(selectedDate);

  const handleAddSuccess = () => {
    refreshData();
    setShowAddModal(false);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowEditForm(true);
  };

  const handleEditSuccess = () => {
    refreshData();
    closeEditForm();
  };

  const handleDelete = (id) => {
    console.log('id', id);
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await deleteAttendance(deleteId);
      toast.success('Xóa chấm công thành công!');
      await refreshData();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting attendance:', error);
    } finally {
      setLoading(false);
    }
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
      badgeClass: (row) => (row.checkOut !== '-' ? 'bg-success' : 'bg-danger'),
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
                <h5 className="card-title">Chọn ngày</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="fas fa-calendar-day"></i>
                    </span>
                    <input
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

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  <i className="fas fa-plus-circle me-2"></i>
                  Thêm dữ liệu chấm công
                </button>
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
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Form thêm */}
      <CreateAttendanceForm
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Form sửa */}
      <EditAttendanceForm
        visible={showEditForm}
        onClose={closeEditForm}
        attendanceId={editingId}
        onSuccess={handleEditSuccess}
      />

      {/* Modal xác nhận xóa */}
      <Modal
        showModal={showDeleteModal}
        title="Xác nhận xóa"
        onClose={() => setShowDeleteModal(false)}
        onSave={handleDeleteConfirm}
        saveButtonText="Xóa"
        closeButtonText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa bản chấm công này không?</p>
      </Modal>
    </div>
  );
};

export default Attendance;
