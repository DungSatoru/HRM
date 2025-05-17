import { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { deleteEmployee } from '~/services/employeeService';
import { fetchEmpDepPos } from '~/utils/fetchData';
import { Table, Button, Modal, Input, Tag, Space, message } from 'antd';
import Loading from '~/components/Loading/Loading';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Employees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { mappedEmployees, departmentsData, positionsData } = await fetchEmpDepPos();
        setEmployees(mappedEmployees);
        setDepartments(departmentsData);
        setPositions(positionsData);
        setFilteredEmployees(mappedEmployees);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    const filtered = employees.filter((emp) =>
      emp.fullName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Button type="link" onClick={() => navigate(`/employees/${record.userId}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Phòng ban',
      dataIndex: 'departmentName',
      key: 'departmentName',
      filters: departments.map((dep) => ({ text: dep.departmentName, value: dep.departmentName })),
      onFilter: (value, record) => record.departmentName === value,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'positionName',
      key: 'positionName',
      filters: positions.map((pos) => ({ text: pos.positionName, value: pos.positionName })),
      onFilter: (value, record) => record.positionName === value,
    },
    {
      title: 'Ngày gia nhập',
      dataIndex: 'hireDate',
      key: 'hireDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang làm việc', value: 'ACTIVE' },
        { text: 'Đã nghỉ việc', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) =>
        status === 'ACTIVE' ? (
          <Tag color="green">Đang làm việc</Tag>
        ) : (
          <Tag color="red">Đã nghỉ việc</Tag>
        ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/employees/${record.userId}/edit`)}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container employees-container">
      <h2 className="page-title">Danh sách nhân viên</h2>

      <div className="card mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <Input
            placeholder="Tìm kiếm theo tên nhân viên..."
            value={searchTerm}
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/employees/add')}>
            Thêm nhân viên mới
          </Button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredEmployees}
              rowKey="userId"
              pagination={{ pageSize: 10 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;