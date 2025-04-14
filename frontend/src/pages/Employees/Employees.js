import { useEffect, useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '~/services/employeeService';
import './Employees.css';
import Loading from '~/components/Loading/Loading';
import DataTable from '~/components/DataTable/DataTable';
import Modal from '~/components/Modal/Modal';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null); // Thêm state lưu id của nhân viên cần xóa
  const [token, setToken] = useState(localStorage.getItem('token')); // Lưu token vào state

  if (!token) {
    // Nếu không có token, điều hướng đến trang đăng nhập
    navigate('/login');
  } else {
    // Nếu có token, kiểm tra xem nó có hợp lệ không
    console.log('Token:', token);
  }

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation(); // Hook to track current location (URL)

  // Calculate the range of employees for current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const handleNextPage = () => {
    if (currentPage * rowsPerPage < employees.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải danh sách nhân viên:', error);
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.fullName ? emp.fullName.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
      (emp.email ? emp.email.toLowerCase() : '').includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'userId',
      width: '10%',
      centerAlign: true,
    },
    {
      key: 'name',
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      width: '20%',
      type: 'link',
      defauleValue: 'No Name',
      idField: 'userId',
    },
    {
      key: 'position',
      title: 'Chức vụ',
      dataIndex: 'position',
      width: '20%',
      render: (value) => (value ? value.positionName : 'Chưa có chức vụ'), // Lấy giá trị của positionName từ đối tượng position
    },
    {
      key: 'hireDate',
      title: 'Ngày gia nhập',
      dataIndex: 'hireDate',
      width: '20%',
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '20%',
      centerAlign: true,
      render: (value) => (value === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ việc'),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '10%',
      centerAlign: true,
      type: 'actions',
      showEdit: true,
      showDelete: true,
      idField: 'userId',
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (id) => {
    setEmployeeIdToDelete(id); // Lưu id nhân viên vào state khi mở modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (employeeIdToDelete) => {
    try {
      await deleteEmployee(employeeIdToDelete);
      fetchEmployees();
    } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
    }
    setEmployeeIdToDelete(null); // Reset lại id sau khi xóa
    closeModal();
  };

  return (
    <div className="page-container employees-container">
      <h2 className="page-title">Danh sách nhân viên</h2>

      {/* Modal Component */}
      <Modal
        title="Modal title"
        showModal={isModalOpen}
        onClose={closeModal}
        onSave={() => handleSave(employeeIdToDelete)}
        saveButtonText="Save changes"
        closeButtonText="Close"
      >
        Xác nhận xóa nhân viên này?
      </Modal>

      <div className="card-container">
        <div className="row">
          {/* Search Department Card */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Tìm kiếm nhân viên</h5>
              </div>
              <div className="card-body">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-search mx-2"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên nhân viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add New Employee Card */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Thêm mới nhân viên</h5>
              </div>
              <div className="card-body">
                <button className="btn btn-primary" onClick={() => navigate('/employees/add')}>
                  Tới trang thêm nhân viên...
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Table Card */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title m-0">Danh sách nhân viên</h5>
          <span className="badge bg-primary">{filteredEmployees.length} nhân viên</span>
        </div>
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : (
            <DataTable
              columns={columns}
              data={filteredEmployees}
              emptyMessage={{
                icon: 'fas fa-folder-open',
                text: 'Không tìm thấy nhân viên',
              }}
              onEdit={(id) => navigate(`/employees/${id}/edit`)}
              onDelete={openModal}
              detailsPath="/employees"
            />
          )}
          {/* Pagination Controls */}
          <div className="pagination">
            <span>Số nhân viên mỗi trang: </span>
            <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Trang trước
            </button>
            <button onClick={handleNextPage} disabled={currentPage * rowsPerPage >= filteredEmployees.length}>
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
