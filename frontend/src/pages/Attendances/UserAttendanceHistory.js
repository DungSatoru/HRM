import React, { useState, useEffect } from 'react';
import { getUserAttendanceByRange } from '~/services/attendanceService';
import { getEmployees } from '~/services/employeeService';
import Loading from '~/components/Loading/Loading';
import Modal from '~/components/Modal/Modal';

const UserAttendanceHistory = () => {
  const [userId, setUserId] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Lấy danh sách nhân viên
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Cập nhật startDate và endDate theo tháng
  useEffect(() => {
    if (month) {
      const [year, mon] = month.split('-');
      const start = `${year}-${mon}-01`;
      const end = new Date(year, mon, 0).toISOString().split('T')[0];
      setStartDate(start);
      setEndDate(end);
    }
  }, [month]);

  const handleSearch = async () => {
    if (!userId || !startDate || !endDate) {
      setModalMessage('Vui lòng chọn nhân viên và tháng.');
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserAttendanceByRange(userId, startDate, endDate);
      setAttendances(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmployee = (emp) => {
    setUserId(emp.userId);
    setSelectedName(emp.fullName);
    setSearchTerm('');
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lịch sử chấm công nhân viên</h2>

      <div className="form-group mb-3 position-relative">
        <label>Tìm kiếm nhân viên:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Nhập tên nhân viên..."
          value={searchTerm || selectedName}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedName('');
            setUserId('');
          }}
        />
        {searchTerm && filteredEmployees.length > 0 && (
          <ul
            className="list-group position-absolute z-1 w-100"
            style={{ maxHeight: 200, overflowY: 'auto' }}
          >
            {filteredEmployees.map((emp) => (
              <li
                key={emp.userId}
                className="list-group-item list-group-item-action"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectEmployee(emp)}
              >
                {emp.fullName} ({emp.userId})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="form-group mb-3">
        <label>Chọn tháng:</label>
        <input
          type="month"
          className="form-control"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <button className="btn btn-primary mb-4" onClick={handleSearch}>
        Xem lịch sử
      </button>

      {loading ? (
        <Loading />
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Thời gian vào</th>
              <th>Thời gian ra</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {attendances.length > 0 ? (
              attendances.map((item) => (
                <tr key={item.attendanceId}>
                  <td>{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                  <td>{item.checkIn || '-'}</td>
                  <td>{item.checkOut || '-'}</td>
                  <td>
                    {item.checkOut ? (
                      <span className="badge bg-success">Đã checkout</span>
                    ) : (
                      <span className="badge bg-danger">Chưa checkout</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal hiển thị thông báo */}
      <Modal
        title="Thông báo"
        showModal={showModal}
        onClose={() => setShowModal(false)}
        saveButtonText="Đóng"
        onSave={() => setShowModal(false)}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default UserAttendanceHistory;
