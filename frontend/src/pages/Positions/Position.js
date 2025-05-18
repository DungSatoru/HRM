import { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, Card, Space, Badge, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getPositions, deletePosition, addPosition, updatePosition } from '~/services/positionService';
import { getEmployees } from '~/services/employeeService'; // Giả sử bạn có service này
import Loading from '~/components/Loading/Loading';
import './Positions.css';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(''); // 'Add', 'Edit', 'Delete'
  const [selectedPosition, setSelectedPosition] = useState({});
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách vị trí
      const positionData = await getPositions();
      setPositions(positionData || []);

      // Lấy danh sách nhân viên
      const employeeData = await getEmployees();
      setEmployees(employeeData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Không thể tải danh sách chức vụ hoặc nhân viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Gọi hàm fetchData trong useEffect
  }, []); // Chỉ gọi khi component mount

  // Lọc danh sách chức vụ theo tên
  const filteredPositions = positions.filter((pos) =>
    pos.positionName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Tính số nhân viên cho mỗi chức vụ
  const positionsWithEmployeeCount = filteredPositions.map((pos) => {
    const totalEmployees = employees.filter((emp) => emp.positionId === pos.positionId).length;
    return { ...pos, totalEmployees };
  });

  const openModal = (action, position = {}) => {
    setModalAction(action);
    setSelectedPosition(position);
    setIsModalOpen(true);
    if (action === 'Edit') {
      form.setFieldsValue({ positionName: position.positionName });
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPosition({});
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (modalAction === 'Add') {
        await addPosition({ positionName: values.positionName });
        message.success('Thêm chức vụ thành công!');
      } else if (modalAction === 'Edit') {
        await updatePosition(selectedPosition.positionId, { positionName: values.positionName });
        message.success('Cập nhật chức vụ thành công!');
      }
      fetchData(); // Gọi lại fetchData sau khi thêm hoặc sửa
      closeModal();
    } catch (error) {
      closeModal();
    }
  };

  const handleDelete = async () => {
    try {
      await deletePosition(selectedPosition.positionId);
      fetchData();
      closeModal();
    } catch (error) {
      closeModal();
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'positionId',
      key: 'positionId',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên chức vụ',
      dataIndex: 'positionName',
      key: 'positionName',
      align: 'center',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Số nhân viên',
      dataIndex: 'totalEmployees',
      key: 'totalEmployees',
      align: 'center',
      render: (count) => <Badge count={count || 0} style={{ backgroundColor: '#52c41a' }} />,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal('Edit', record)}>
            Sửa
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => openModal('Delete', record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container position-container">
      <h2 className="page-title">Quản lý chức vụ</h2>

      <Card style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm chức vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('Add')}>
            Thêm chức vụ
          </Button>
        </Space>
      </Card>

      <Card>
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            dataSource={positionsWithEmployeeCount}
            rowKey="positionId"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        title={modalAction === 'Delete' ? 'Xóa chức vụ' : modalAction === 'Edit' ? 'Sửa chức vụ' : 'Thêm chức vụ'}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={modalAction === 'Delete' ? handleDelete : handleSubmit}
        okText={modalAction === 'Delete' ? 'Xóa' : 'Lưu'}
        cancelText="Hủy"
      >
        {modalAction === 'Delete' ? (
          <p>
            Bạn có chắc chắn muốn xóa chức vụ <b>{selectedPosition.positionName}</b> không?
          </p>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item
              label="Tên chức vụ"
              name="positionName"
              rules={[{ required: true, message: 'Vui lòng nhập tên chức vụ' }]}
            >
              <Input placeholder="Nhập tên chức vụ..." />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Positions;
