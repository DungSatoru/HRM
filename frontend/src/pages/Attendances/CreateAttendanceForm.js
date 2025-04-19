import React, { useEffect, useState } from 'react';
import './EditAttendanceForm.css';
import { createAttendance } from '~/services/attendanceService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '~/components/Loading/Loading';
import { getEmployees } from '~/services/employeeService';

const CreateAttendanceForm = ({ visible, onClose, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    attendanceId: '',
    userId: '',
    fullName: '',
    date: '',
    checkIn: '',
    checkOut: ''
  });

  const navigate = useNavigate();

  // Fetch nhân viên
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

  // Xử lý hiển thị form
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setShow(true), 10);
    } else {
      document.body.style.overflow = 'auto';
      setShow(false);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);

  // Khi chọn nhân viên
  const handleSelectEmployee = (emp) => {
    setSelectedName(emp.fullName);
    setSearchTerm('');
    setForm((prev) => ({
      ...prev,
      userId: emp.userId,
      fullName: emp.fullName
    }));
  };

  // Cập nhật input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId || !form.fullName) {
      toast.error('Vui lòng chọn nhân viên trước khi tạo chấm công.');
      return;
    }

    setLoading(true);
    try {
      await createAttendance(form);
      toast.success('Tạo chấm công thành công!');
      if (onClose) onClose();
      if (onSuccess) onSuccess(); // Gọi callback cập nhật lại bảng
    } catch (error) {
      // Xử lý lỗi trong service
    } finally {
      setLoading(false);
    }
  };

  const shouldHide = !visible && !show;

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {!shouldHide && (
        <>
          <div className={`overlay-backdrop ${show ? 'show' : ''}`} onClick={onClose} />
          <div className={`edit-offcanvas ${show ? 'show' : ''}`}>
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Tạo mới chấm công</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="offcanvas-body">
              {loading ? (
                <Loading />
              ) : (
                <form onSubmit={handleSubmit}>
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
                        setForm((prev) => ({
                          ...prev,
                          userId: '',
                          fullName: ''
                        }));
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
                    <label>Ngày</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Giờ vào</label>
                    <input
                      type="time"
                      name="checkIn"
                      className="form-control"
                      value={form.checkIn}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Giờ ra</label>
                    <input
                      type="time"
                      name="checkOut"
                      className="form-control"
                      value={form.checkOut}
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Tạo chấm công
                  </button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>
                    Quay lại
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateAttendanceForm;
