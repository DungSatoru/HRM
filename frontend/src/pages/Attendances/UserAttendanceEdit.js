import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAttendanceById, updateAttendance } from '~/services/attendanceService';
import Loading from '~/components/Loading/Loading';
import { toast } from 'react-toastify';

function UserAttendanceEdit() {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: '',
    checkIn: '',
    checkOut: '',
    note: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAttendanceById(id);
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

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAttendance(id, form);
      toast.success('Cập nhật thành công!');
      navigate('/attendance');
    } catch (error) {
      toast.error('Cập nhật thất bại!');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mt-4">
      <h3>Chỉnh sửa chấm công</h3>
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
        <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </form>
    </div>
  );
}

export default UserAttendanceEdit;
