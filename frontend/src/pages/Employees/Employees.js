import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmpDepPos } from '~/utils/fetchData';
import { Table, Button, Input, Tag, Space } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import Loading from '~/components/Loading/Loading';

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const { mappedEmployees, departmentsData, positionsData } = await fetchEmpDepPos();
      setEmployees(mappedEmployees);
      setFilteredEmployees(mappedEmployees);
      setDepartments(departmentsData);
      setPositions(positionsData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    setFilteredEmployees(employees.filter((emp) => emp.fullName?.toLowerCase().includes(keyword)));
  };

  const renderStatusTag = (status) => {
    const statusMap = {
      ACTIVE: { color: 'green', label: 'Đang làm việc' },
      ON_LEAVE: { color: 'gold', label: 'Đang nghỉ phép' },
      PROBATION: { color: 'blue', label: 'Đang thử việc' },
      RESIGNED: { color: 'orange', label: 'Đã nghỉ việc (tự nguyện)' },
      TERMINATED: { color: 'red', label: 'Bị cho nghỉ việc' },
      RETIRED: { color: 'cyan', label: 'Nghỉ hưu' },
    };
    const item = statusMap[status] || { color: 'default', label: status };
    return <Tag color={item.color}>{item.label}</Tag>;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
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
      filters: departments.map((dep) => ({
        text: dep.departmentName,
        value: dep.departmentName,
      })),
      filterMultiple: true,
      filterSearch: true,
      onFilter: (value, record) => record.departmentName === value,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'positionName',
      key: 'positionName',
      filters: positions.map((pos) => ({
        text: pos.positionName,
        value: pos.positionName,
      })),
      filterMultiple: true,
      filterSearch: true,
      onFilter: (value, record) => record.positionName === value,
    },
    {
      title: 'Ngày gia nhập',
      dataIndex: 'hireDate',
      key: 'hireDate',
      sorter: (a, b) => new Date(a.hireDate) - new Date(b.hireDate),
      render: (date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '—'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang làm việc', value: 'ACTIVE' },
        { text: 'Đang nghỉ phép', value: 'ON_LEAVE' },
        { text: 'Đang thử việc', value: 'PROBATION' },
        { text: 'Đã nghỉ việc (tự nguyện)', value: 'RESIGNED' },
        { text: 'Bị cho nghỉ việc', value: 'TERMINATED' },
        { text: 'Nghỉ hưu', value: 'RETIRED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: renderStatusTag,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="default" icon={<EditOutlined />} onClick={() => navigate(`/employees/${record.userId}/edit`)}>
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
              pagination={{
                pageSizeOptions: ['5', '10', '20', '50'],
                defaultPageSize: 10,
                showSizeChanger: true,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
