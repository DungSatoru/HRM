import { useEffect, useState, useCallback } from 'react';
import { Table, Input, Button, Modal, Form, Card, Space, Badge, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getDepartments, deleteDepartment, addDepartment, updateDepartment } from '~/services/departmentService';
import Loading from '~/components/Loading/Loading';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(''); // 'Add' | 'Edit' | 'Delete'
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [form] = Form.useForm();

  const role = localStorage.getItem('roleName');
  const isAdmin = role === 'ROLE_ADMIN';

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data || []);
    } catch (error) {
      message.error('Không thể tải danh sách phòng ban');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const openModal = (action, department = null) => {
    setModalAction(action);
    setSelectedDepartment(department);
    setIsModalOpen(true);
    if (action === 'Edit' && department) {
      form.setFieldsValue({ departmentName: department.departmentName });
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const { departmentName } = await form.validateFields();
      if (modalAction === 'Add') {
        await addDepartment({ departmentName });
        message.success('Thêm phòng ban thành công!');
      } else if (modalAction === 'Edit') {
        await updateDepartment(selectedDepartment.departmentId, { departmentName });
        message.success('Cập nhật phòng ban thành công!');
      }
      fetchDepartments();
      closeModal();
    } catch (error) {
      console.error('Lỗi xử lý phòng ban:', error);
      message.error('Xử lý thất bại!');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment(selectedDepartment.departmentId);
      message.success('Xóa phòng ban thành công!');
      fetchDepartments();
    } catch (error) {
      console.error('Lỗi khi xóa phòng ban:', error);
      message.error('Xóa thất bại!');
    } finally {
      closeModal();
    }
  };

  const filteredDepartments = departments.filter((dep) =>
    dep.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'departmentId',
      key: 'departmentId',
      width: 80,
      sorter: (a, b) => a.departmentId - b.departmentId,
    },
    {
      title: 'Tên phòng ban',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (text) => <b>{text}</b>,
      sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
    },
    {
      title: 'Trưởng phòng',
      dataIndex: 'departmentManager',
      key: 'departmentManager',
      render: (manager) => manager || 'Chưa có',
      sorter: (a, b) => (a.departmentManager || '').localeCompare(b.departmentManager || ''),
    },
    {
      title: 'Số nhân viên',
      dataIndex: 'totalEmployees',
      key: 'totalEmployees',
      render: (count) => <Badge count={count || 0} style={{ backgroundColor: '#1890ff' }} />,
      sorter: (a, b) => a.totalEmployees - b.totalEmployees,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) =>
        isAdmin && (
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
    <div className="page-container department-container">
      <h2 className="page-title">Quản lý phòng ban</h2>

      <Card style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          {isAdmin && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('Add')}>
              Thêm phòng ban
            </Button>
          )}
        </Space>
      </Card>

      <Card>
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredDepartments}
            rowKey="departmentId"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        title={modalAction === 'Delete' ? 'Xóa phòng ban' : modalAction === 'Edit' ? 'Sửa phòng ban' : 'Thêm phòng ban'}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={modalAction === 'Delete' ? handleDelete : handleSubmit}
        okText={modalAction === 'Delete' ? 'Xóa' : 'Lưu'}
        cancelText="Hủy"
      >
        {modalAction === 'Delete' ? (
          <p>
            Bạn có chắc chắn muốn xóa phòng ban <b>{selectedDepartment?.departmentName}</b> không?
          </p>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item
              label="Tên phòng ban"
              name="departmentName"
              rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban' }]}
            >
              <Input placeholder="Nhập tên phòng ban..." />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Departments;