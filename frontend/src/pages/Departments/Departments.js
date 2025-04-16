import { useEffect, useState } from 'react';
import { getDepartments, deleteDepartment, addDepartment, updateDepartment } from '~/services/departmentService';
import './Departments.css';
import Loading from '~/components/Loading/Loading';
import DataTable from '~/components/DataTable/DataTable';
import { useNavigate } from 'react-router-dom';
import Modal from '~/components/Modal/Modal';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) {
      alert('Please enter a department name');
      return;
    }

    const departmentData = {
      departmentName: newDepartmentName,
    };

    try {
      await addDepartment(departmentData);
      setNewDepartmentName('');
      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const filteredDepartments = departments.filter((department) =>
    (department.departmentName ? department.departmentName.toLowerCase() : '').includes(searchTerm.toLowerCase()),
  );

  // Định nghĩa cấu trúc cột
  const columns = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'departmentId',
      width: '10%',
      centerAlign: true,
    },
    {
      key: 'name',
      title: 'Tên phòng ban',
      dataIndex: 'departmentName',
      width: '30%',
      type: 'link',
      defaultValue: 'No Name',
      idField: 'departmentId',
    },
    {
      key: 'manager',
      title: 'Trưởng phòng',
      dataIndex: 'departmentManager',
      width: '25%',
      defaultValue: 'Chưa có',
    },
    {
      key: 'employeeCount',
      title: 'Số nhân viên',
      dataIndex: 'totalEmployees',
      width: '15%',
      centerAlign: true,
      type: 'badge',
      badgeClass: 'bg-info',
      defaultValue: 0,
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '20%',
      centerAlign: true,
      type: 'actions',
      showEdit: true,
      showDelete: true,
      idField: 'departmentId',
    },
  ];
  const [modalAction, setModalAction] = useState(''); // Lưu hành động hiện tại (Edit hoặc Delete)
  const [departmentId, setDepartmentId] = useState(null); // Thêm state lưu id của nhân viên cần xóa
  const [departmentName, setDepartmentName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (actionType, id, name = '') => {
    setModalAction(actionType);
    setDepartmentId(id);
    setDepartmentName(name); // Nếu là sửa, đặt tên phòng ban vào input
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (modalAction === 'Edit') {
      if (!departmentName.trim()) {
        alert('Vui lòng nhập tên phòng ban mới');
        return;
      }

      try {
        await updateDepartment(departmentId, { departmentName });
        fetchDepartments(); // Reload danh sách phòng ban
      } catch (error) {
        console.error('Lỗi khi cập nhật phòng ban:', error);
      }
    } else if (modalAction === 'Delete') {
      try {
        await deleteDepartment(departmentId);
        fetchDepartments();
      } catch (error) {
        console.error('Lỗi khi xóa phòng ban:', error);
      }
    }
    closeModal();
  };

  return (
    <div className="page-container department-container">
      <h2 className="page-title">Quản lý phòng ban</h2>

      {/* Modal Component */}
      <Modal
        title="Chỉnh sửa phòng ban"
        showModal={isModalOpen}
        onClose={closeModal}
        onSave={() => handleSave(departmentName)}
        saveButtonText="Xóa phòng ban"
        closeButtonText="Hủy"
      >
        {modalAction === 'Edit' ? (
          <>
            <label htmlFor="departmentName">Nhập tên phòng ban mới:</label>
            <input
              type="text"
              id="departmentName"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="border rounded p-2 w-full mt-2"
              placeholder="Nhập tên phòng ban..."
            />
          </>
        ) : (
          <>Bạn chắc chắn muốn xóa phòng ban này</>
        )}
      </Modal>

      <div className="card-container">
        <div className="row">
          {/* Add New Department Card */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Thêm phòng ban mới</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSaveDepartment}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên phòng ban..."
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                    />
                    <button type="submit" className="btn-save m-0 border-0 btn btn-primary">
                      <i className="fas fa-save me-1"></i> Thêm mới
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Search Department Card */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Tìm kiếm phòng ban</h5>
              </div>
              <div className="card-body">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-search mx-2"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên phòng ban..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Table Card */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title m-0">Danh sách phòng ban</h5>
          <span className="badge bg-primary">{filteredDepartments.length} phòng ban</span>
        </div>
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : (
            <DataTable
              columns={columns}
              data={filteredDepartments}
              emptyMessage={{
                icon: 'fas fa-folder-open',
                text: 'Không tìm thấy phòng ban',
              }}
              onEdit={(id) => openModal('Edit', id)}
              onDelete={(id) => openModal('Delete', id)}
              detailsPath="/departments"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Departments;
