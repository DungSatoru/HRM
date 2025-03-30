import { useNavigate } from 'react-router-dom';
import { addDepartment } from '~/services/departmentService';

const DepartmentCreate = () => {
  const navigate = useNavigate();

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const departmentData = {
      departmentName: formData.get('departmentName'), // Lấy tên phòng ban
    };

    try {
      await addDepartment(departmentData); // Gọi service để thêm phòng ban
      navigate('/departments'); // Chuyển hướng đến danh sách phòng ban
    } catch (error) {
      console.error('Lỗi khi thêm phòng ban:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Thêm Phòng ban</h2>
      <form onSubmit={handleSaveDepartment} className="shadow p-4 bg-light rounded">
        <div className="mb-3">
          <label className="form-label">Tên Phòng ban</label>
          <input type="text" name="departmentName" className="form-control" required />
        </div>

        <button type="submit" className="btn btn-primary">
          Lưu
        </button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/departments')}>
          Hủy
        </button>
      </form>
    </div>
  );
};

export default DepartmentCreate;
