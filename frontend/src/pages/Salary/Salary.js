import { Table, Button, Select, Card, Space } from 'antd';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useState } from 'react';
import { fetchAllDataForSalary } from '~/utils/fetchData';

const { Option } = Select;

function Salary() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [mappedEmployees, setMappedEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MM'));
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleSearch = async () => {
    const monthString = `${selectedYear}-${selectedMonth}`;
    setLoading(true);
    try {
      const [employees, dept, pos] = await fetchAllDataForSalary(monthString);
      setMappedEmployees(employees);
      setDepartments(dept);
      setPositions(pos);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

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
      render: (salary) => (
        <span style={{ color: 'blue' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary)}
        </span>
      ),
    },
    {
      title: 'Phụ cấp',
      dataIndex: 'otherAllowance',
      key: 'otherAllowance',
      render: (allowance) => (
        <span style={{ color: 'blue' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(allowance)}
        </span>
      ),
    },
    {
      title: 'Lương thêm giờ',
      dataIndex: 'overTimePay',
      key: 'overTimePay',
      render: (salary) => (
        <span style={{ color: 'orange' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary)}
        </span>
      ),
    },
    {
      title: 'Thưởng',
      dataIndex: 'bonus',
      key: 'bonus',
      render: (bonus) => (
        <span style={{ color: 'green' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bonus)}
        </span>
      ),
    },
    {
      title: 'Khấu trừ',
      dataIndex: 'deduction',
      key: 'deduction',
      render: (deduction) => (
        <span style={{ color: 'red' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(deduction)}
        </span>
      ),
    },
    {
      title: 'Tổng lương',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      render: (salary) => (
        <span style={{ color: 'green', fontWeight: 'bold' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary)}
        </span>
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
    <div className="Salary p-3">
      <Card title="Danh sách phiếu lương">
        <Space style={{ marginBottom: 16 }}>
          <Select value={selectedMonth} onChange={handleMonthChange} style={{ width: 120 }}>
            {Array.from({ length: 12 }, (_, i) => {
              const month = (i + 1).toString().padStart(2, '0');
              return (
                <Option key={month} value={month}>
                  Tháng {month}
                </Option>
              );
            })}
          </Select>

          <Select value={selectedYear} onChange={handleYearChange} style={{ width: 120 }}>
            {Array.from({ length: 10 }, (_, i) => {
              const year = (moment().year() - 5 + i).toString();
              return (
                <Option key={year} value={year}>
                  Năm {year}
                </Option>
              );
            })}
          </Select>

          <Button type="primary" onClick={handleSearch} loading={loading}>
            Tìm kiếm
          </Button>
        </Space>

        <Table
          columns={salarySlipsColumns}
          dataSource={mappedEmployees}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default Salary;
