import { useEffect, useState } from 'react';
// import { getPositions, deletePosition, addPosition, updatePosition } from '~/services/positionService';
import './Positions.css';
import Loading from '~/components/Loading/Loading';
import DataTable from '~/components/DataTable/DataTable';
import { useNavigate } from 'react-router-dom';
import Modal from '~/components/Modal/Modal';
import { addPosition, deletePosition, getPositions, updatePosition } from '~/services/positionService';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newPositionName, setNewPositionName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const data = await getPositions();
      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSavePosition = async (e) => {
    e.preventDefault();
    if (!newPositionName.trim()) {
      alert('Please enter a position name');
      return;
    }

    const positionData = {
      positionName: newPositionName,
    };

    try {
      await addPosition(positionData);
      setNewPositionName('');
      fetchPositions();
    } catch (error) {
      console.error('Error adding position:', error);
    }
  };

  const filteredPositions = positions.filter((position) =>
    (position.positionName ? position.positionName.toLowerCase() : '').includes(searchTerm.toLowerCase()),
  );

  console.log('Filtered Positions:', filteredPositions);

  // Định nghĩa cấu trúc cột
  const columns = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'positionId',
      width: '10%',
      centerAlign: true,
    },
    {
      key: 'name',
      title: 'Tên phòng ban',
      dataIndex: 'positionName',
      width: '30%',
      type: 'link',
      defaultValue: 'No Name',
      idField: 'positionId',
    },
    {
      key: 'manager',
      title: 'Trưởng phòng',
      dataIndex: 'positionManager',
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
      idField: 'positionId',
    },
  ];
  const [modalAction, setModalAction] = useState(""); // Lưu hành động hiện tại (Edit hoặc Delete)
  const [positionId, setPositionId] = useState(null); // Thêm state lưu id của nhân viên cần xóa
  const [positionName, setPositionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (actionType, id, name = "") => {
    setModalAction(actionType);
    setPositionId(id);
    setPositionName(name); // Nếu là sửa, đặt tên phòng ban vào input
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (modalAction === "Edit") {
      if (!positionName.trim()) {
        alert("Vui lòng nhập tên phòng ban mới");
        return;
      }
  
      try {
        await updatePosition(positionId, { positionName });
        fetchPositions(); // Reload danh sách phòng ban
      } catch (error) {
        console.error("Lỗi khi cập nhật phòng ban:", error);
      }
    } else if (modalAction === "Delete") {
      try {
        await deletePosition(positionId);
        fetchPositions();
      } catch (error) {
        console.error("Lỗi khi xóa phòng ban:", error);
      }
    }
    closeModal();
  };
  

  return (
    <div className="page-container position-container">
      <h2 className="page-title">Quản lý phòng ban</h2>

      {/* Modal Component */}
      <Modal
        title="Chỉnh sửa phòng ban"
        showModal={isModalOpen}
        onClose={closeModal}
        onSave={() => handleSave(positionName)}
        saveButtonText="Xóa phòng ban"
        closeButtonText="Hủy"
      >
        <label htmlFor="positionName">Nhập tên phòng ban mới:</label>
        <input
          type="text"
          id="positionName"
          value={positionName}
          onChange={(e) => setPositionName(e.target.value)}
          className="border rounded p-2 w-full mt-2"
          placeholder="Nhập tên phòng ban..."
        />
      </Modal>

      <div className="card-container">
        <div className="row">
          {/* Add New Position Card */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Thêm phòng ban mới</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSavePosition}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên phòng ban..."
                      value={newPositionName}
                      onChange={(e) => setNewPositionName(e.target.value)}
                    />
                    <button type="submit" className="btn-save m-0">
                      <i className="fas fa-save me-1"></i> Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Search Position Card */}
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

      {/* Position Table Card */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title m-0">Danh sách phòng ban</h5>
          <span className="badge bg-primary">{filteredPositions.length} phòng ban</span>
        </div>
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : (
            <DataTable
              columns={columns}
              data={filteredPositions}
              emptyMessage={{
                icon: 'fas fa-folder-open',
                text: 'Không tìm thấy phòng ban',
              }}
              onEdit={(id) => openModal("Edit", id)}
              onDelete={(id) => openModal("Delete", id)}
              detailsPath="/positions"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Positions;
