import { Table, Button, Select, Card, Space } from 'antd';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useState } from 'react';
import { fetchAllDataForSalary } from '~/utils/fetchData';
import { getSalarySlipsByMonth } from '~/services/salarySlipService';

const { Option } = Select;

function Salary() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [salarySlips, setSalarySlips] = useState([]);
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
      const fetchData = await getSalarySlipsByMonth(monthString);
      setSalarySlips(fetchData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const salarySlipsColumns = [
    {
      title: 'ID Nhân viên',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Tháng',
      dataIndex: 'salaryPeriod',
      key: 'salaryPeriod',
    },
    {
      title: 'Lương cứng',
      dataIndex: 'actualBasicSalary',
      key: 'actualBasicSalary',
      render: (salary) => (
        <span style={{ color: 'blue' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary)}
        </span>
      ),
    },
    {
      title: 'Phụ cấp',
      dataIndex: 'otherAllowances',
      key: 'otherAllowances',
      render: (allowance) => (
        <span style={{ color: 'blue' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(allowance)}
        </span>
      ),
    },
    {
      title: 'Lương thêm giờ(Ban ngày)',
      dataIndex: 'dayOvertimePay',
      key: 'dayOvertimePay',
      render: (salary) => (
        <span style={{ color: 'orange' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary)}
        </span>
      ),
    },
    {
      title: 'Lương thêm giờ(Ban đêm)',
      dataIndex: 'nightOvertimePay',
      key: 'nightOvertimePay',
      render: (salary) => (
        <span style={{ color: 'orange' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary)}
        </span>
      ),
    },
    {
      title: 'Thưởng',
      dataIndex: 'totalBonus',
      key: 'totalBonus',
      render: (bonus) => (
        <span style={{ color: 'green' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bonus)}
        </span>
      ),
    },
    {
      title: 'Khấu trừ',
      dataIndex: 'totalDeductions',
      key: 'totalDeductions',
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
          dataSource={salarySlips}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default Salary;
