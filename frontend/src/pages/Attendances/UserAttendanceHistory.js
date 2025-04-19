import React, { useEffect, useState, useRef } from 'react';
import { deleteAttendance, getAttendances, getUserAttendanceByRange } from '~/services/attendanceService';
import { getEmployees } from '~/services/employeeService';
import { getDepartments } from '~/services/departmentService';
import Loading from '~/components/Loading/Loading';
import Modal from '~/components/Modal/Modal';
import EditAttendanceForm from './EditAttendanceForm';
import DataTable from '~/components/DataTable/DataTable';

const UserAttendanceHistory = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Sử dụng useRef để chắc chắn rằng hàm xóa chỉ được gọi một lần
  const isDeleting = useRef(false);

  // Lấy danh sách nhân viên và phòng ban
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await getEmployees();
        setEmployees(empData || []);
        const deptData = await getDepartments();
        setDepartments(deptData || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };
    fetchData();
  }, []);

  // Tính start và end date theo tháng
  useEffect(() => {
    if (month) {
      const [year, mon] = month.split('-');
      const lastDay = new Date(year, parseInt(mon), 0).getDate();
      const start = `${year}-${mon}-01`;
      const end = `${year}-${mon}-${lastDay}`;
      setStartDate(start);
      setEndDate(end);

      // Fetch data again if employee is selected
      if (selectedEmployee) {
        fetchUserAttendanceData(selectedEmployee.userId, start, end);
      }
    }
  }, [month]);

  // Khi thay đổi nhân viên được chọn
  useEffect(() => {
    if (selectedEmployee && startDate && endDate) {
      fetchUserAttendanceData(selectedEmployee.userId, startDate, endDate);
    }
  }, [selectedEmployee]);

  // ✅ Fetch lại dữ liệu sau khi thêm, sửa
  const refreshData = () => {
    if (selectedEmployee) {
      fetchUserAttendanceData(selectedEmployee.userId, startDate, endDate);
    }
  };


  const fetchUserAttendanceData = async (userId, start, end) => {
    try {
      setLoading(true);
      const data = await getUserAttendanceByRange(userId, start, end);
      setAttendances(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu chấm công:', error);
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingId(null);
  };

  const handleDeleteConfirm = async () => {
    // Kiểm tra xem đang trong quá trình xóa hay không để tránh gọi hàm 2 lần
    if (isDeleting.current) return;

    try {
      isDeleting.current = true;
      setLoading(true);

      // Chỉ gọi hàm xóa một lần
      await deleteAttendance(deleteId);

      // Làm mới dữ liệu sau khi xóa
      await refreshData();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Lỗi khi xóa chấm công:', error);
    } finally {
      setLoading(false);
      isDeleting.current = false;
    }
  };

  // Xử lý khi chọn nhân viên
  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
  };

  const filteredEmployees = selectedDept
    ? employees.filter((emp) => emp.department.departmentId.toString() === selectedDept.toString())
    : employees;

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return null;
    const [h1, m1, s1] = checkIn.split(':').map(Number);
    const [h2, m2, s2] = (checkOut?.split(':') || [0, 0, 0]).map(Number);

    const start = new Date(0, 0, 0, h1, m1, s1);
    const end = new Date(0, 0, 0, h2, m2, s2);
    const diff = new Date(end - start);

    const hours = diff.getUTCHours().toString().padStart(2, '0');
    const minutes = diff.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Chuyển đổi dữ liệu để hiển thị trong bảng
  const mappedData = attendances?.map((item, index) => ({
    key: item.attendanceId,
    stt: index + 1,
    date: item.date ? new Date(item.date).toLocaleDateString('vi-VN') : '-',
    fullName: item.fullName || 'Không tên',
    userId: item.userId,
    checkIn: item.checkIn || '-',
    checkOut: item.checkOut || '-',
    duration: item.checkIn && item.checkOut ? calculateDuration(item.checkIn, item.checkOut) : 'Dữ liệu chưa đủ',
    status: item.checkOut ? 'Đã chấm công' : 'Chưa checkout',
  }));

  // UserAttendanceHistory
  const handleEditSuccess = () => {
    refreshData(); // Gọi lại hàm refreshData sau khi sửa thành công
    closeEditForm();
  };

  const columns = [
    {
      key: 'stt',
      title: 'STT',
      dataIndex: 'stt',
      width: '5%',
      centerAlign: true,
    },
    {
      key: 'date',
      title: 'Ngày',
      dataIndex: 'date',
      width: '10%',
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
      width: '15%',
      centerAlign: true,
      type: 'actions',
      showEdit: true,
      showDelete: true,
      idField: 'key',
    },
  ];

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowEditForm(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lịch sử chấm công nhân viên</h2>

      <div className="row">
        {/* Cột trái 3/12 */}
        <div className="col-md-3">
          <div className="mb-3">
            <label>Lọc theo phòng ban:</label>
            <select className="form-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="">Tất cả phòng ban</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="m-0">Danh sách nhân viên</h5>
            </div>
            <ul className="list-group list-group-flush" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <li
                    key={emp.userId}
                    className={`list-group-item list-group-item-action ${
                      selectedEmployee?.userId === emp.userId ? 'active' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectEmployee(emp)}
                  >
                    {emp.fullName}
                  </li>
                ))
              ) : (
                <li className="list-group-item">Không có nhân viên trong phòng ban này</li>
              )}
            </ul>
          </div>
        </div>

        {/* Cột phải 9/12 */}
        <div className="col-md-9">
          <div className="card mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <strong>Nhân viên:</strong> {selectedEmployee ? selectedEmployee.fullName : 'Chưa chọn'}
              </div>
              <div className="d-flex align-items-center">
                <label className="me-2">Tháng:</label>
                <input type="month" className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0">Dữ liệu chấm công</h5>
              <span className="badge bg-primary">{attendances.length} bản ghi</span>
            </div>
            <div className="card-body">
              {loading ? (
                <Loading />
              ) : (
                <DataTable
                  columns={columns}
                  data={mappedData}
                  emptyMessage={{
                    icon: 'fas fa-folder-open',
                    text: 'Không có dữ liệu',
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal thông báo */}
      <Modal
        title="Thông báo"
        showModal={showModal}
        onClose={() => setShowModal(false)}
        saveButtonText="Đóng"
        onSave={() => setShowModal(false)}
      >
        <p>{modalMessage}</p>
      </Modal>

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

export default UserAttendanceHistory;
