import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Tabs,
  Card,
  Modal,
  Form,
  message,
  Tooltip,
  Badge,
  Space,
  Tag,
  Divider,
} from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  CalculatorOutlined,
  SettingOutlined,
  TrophyOutlined,
  FileTextOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { fetchAllDataForPayroll } from '~/utils/fetchData';

const { RangePicker } = DatePicker;
const { Option } = Select;

function Payroll() {
  // States
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [mappedEmployees, setMappedEmployees] = useState([]);
  const [salaryConfig, setSalaryConfig] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [salaryConfigModalVisible, setSalaryConfigModalVisible] = useState(false);
  const [bonusModalVisible, setBonusModalVisible] = useState(false);
  const [deductionModalVisible, setDeductionModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mappedEmployees, dept, posi] = await fetchAllDataForPayroll();
        setMappedEmployees(mappedEmployees);
        setDepartments(dept);
        setPositions(posi);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  // Render salary slips table
  const salarySlipsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Lương cơ bản',
      dataIndex: 'basicSalary',
      key: 'basicSalary',
      render: (salary) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary),
    },
    {
      title: 'Lương thêm giờ',
      dataIndex: 'overtimeSalary',
      key: 'overtimeSalary',
      render: (salary) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary),
    },
    {
      title: 'Thưởng',
      dataIndex: 'bonus',
      key: 'bonus',
      render: (bonus) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bonus),
    },
    {
      title: 'Khấu trừ',
      dataIndex: 'deduction',
      key: 'deduction',
      render: (deduction) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(deduction),
    },
    {
      title: 'Tổng lương',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      render: (salary) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'APPROVED' ? 'success' : status === 'PENDING' ? 'processing' : 'default'}
          text={status === 'APPROVED' ? 'Đã phê duyệt' : status === 'PENDING' ? 'Chờ phê duyệt' : 'Bản nháp'}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<FileTextOutlined />}>
            Xuất PDF
          </Button>
          {record.status === 'PENDING' && (
            <Button
              type="default"
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ backgroundColor: 'green', color: 'white' }}
            >
              Phê duyệt
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="payroll p-3">
      <Card title="Danh sách phiếu lương">
        <Space style={{ marginBottom: 16 }}>
          <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
          <Select defaultValue="" style={{ width: 200 }}>
            <Option value="">Tất cả trạng thái</Option>
            <Option value="APPROVED">Đã phê duyệt</Option>
            <Option value="PENDING">Chờ phê duyệt</Option>
            <Option value="DRAFT">Bản nháp</Option>
          </Select>
          <Button type="primary">Tìm kiếm</Button>
        </Space>

        <Table columns={salarySlipsColumns} dataSource={mappedEmployees} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}

export default Payroll;
