import { Table, Button, Select, Card, Space, Empty } from 'antd';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useState } from 'react';
import { getSalarySlipsByMonth } from '~/services/salarySlipService';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function Salary() {
  const [salarySlips, setSalarySlips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MM'));
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));

  const navigate = useNavigate();

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
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: 'Nhân viên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (text, record) => (
        <Button type="link" onClick={() => navigate(`/salary/employee/${record.userId}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Tháng',
      dataIndex: 'salaryPeriod',
      key: 'salaryPeriod',
      sorter: (a, b) => a.salaryPeriod.localeCompare(b.salaryPeriod),
    },
    {
      title: 'Lương cứng',
      dataIndex: 'actualBasicSalary',
      key: 'actualBasicSalary',
      sorter: (a, b) => a.actualBasicSalary - b.actualBasicSalary,
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
      sorter: (a, b) => a.otherAllowances - b.otherAllowances,
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
      sorter: (a, b) => a.dayOvertimePay - b.dayOvertimePay,
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
      sorter: (a, b) => a.nightOvertimePay - b.nightOvertimePay,
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
      sorter: (a, b) => a.totalBonus - b.totalBonus,
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
      sorter: (a, b) => a.totalDeductions - b.totalDeductions,
      render: (deduction) => (
        <span style={{ color: 'red' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(deduction)}
        </span>
      ),
    },
    {
      title: 'Thực nhận',
      dataIndex: 'netSalary',
      key: 'netSalary',
      sorter: (a, b) => a.netSalary - b.netSalary,
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
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: '#999', fontSize: 14 }}>
                    Không có nhân viên nào được tính lương cho tháng này.
                  </span>
                }
              />
            ),
          }}
        />
      </Card>
    </div>
  );
}

export default Salary;
