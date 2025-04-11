import React, { useEffect, useState } from 'react';
import './EditAttendanceForm.css';
import { getAttendanceById, updateAttendance } from '~/services/attendanceService';
import { useNavigate } from 'react-router-dom';

const EditAttendanceForm = ({ visible, onClose, attendanceId }) => {
  const [show, setShow] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: '',
    checkIn: '',
    checkOut: '',
    note: '',
  });

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAttendanceById(attendanceId);
        setAttendance(data);
        setForm({
          date: data.date,
          checkIn: data.checkIn || '',
          checkOut: data.checkOut || '',
          note: data.note || '',
        });
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu chấm công:', error);
      } finally {
        setLoading(false);
      }
    };

    if (attendanceId) {
      fetchData();
    }
  }, [attendanceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAttendance(attendanceId, form);
      alert('Cập nhật chấm công thành công!');
      onClose();
    } catch (error) {
      console.error('Lỗi khi cập nhật chấm công:', error);
      alert('Đã có lỗi xảy ra khi cập nhật');
    }
  };

  const shouldHide = !visible && !show;

  return (
    <>
      {!shouldHide && (
        <>
          <div className={`overlay-backdrop ${show ? 'show' : ''}`} onClick={onClose} />
          <div className={`edit-offcanvas ${show ? 'show' : ''}`}>
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Chỉnh sửa chấm công</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="offcanvas-body">
              <h3>Chỉnh sửa chấm công</h3>
              {loading ? (
                <p>Đang tải dữ liệu...</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label>Ngày</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={form.date}
                      onChange={handleChange}
                      readOnly
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
                  <div className="form-group mb-3">
                    <label>Ghi chú</label>
                    <textarea
                      name="note"
                      className="form-control"
                      value={form.note}
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Lưu thay đổi
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

export default EditAttendanceForm;
