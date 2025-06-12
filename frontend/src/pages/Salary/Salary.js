import { Table, Button, Select, Card, Empty, Input, Row, Col, Space } from 'antd';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useState } from 'react';
import { getSalarySlipsByMonth } from '~/services/salarySlipService';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Option } = Select;
const { Search } = Input;

function Salary() {
  const [salarySlips, setSalarySlips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MM'));
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleMonthChange = (value) => setSelectedMonth(value);
  const handleYearChange = (value) => setSelectedYear(value);

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

  const filteredSlips = salarySlips.filter((item) => item.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

  const exportToExcel = () => {
    if (filteredSlips.length === 0) {
      return;
    }

    // Chuẩn bị dữ liệu
    const dataToExport = filteredSlips.map((item) => ({
      'ID Nhân viên': item.userId,
      'Họ tên': item.fullName,
      Tháng: item.salaryPeriod,
      'Lương cứng': item.actualBasicSalary,
      'Phụ cấp': item.otherAllowances,
      'Lương tăng ca (Ngày)': item.dayOvertimePay,
      'Lương tăng ca (Đêm)': item.nightOvertimePay,
      Thưởng: item.totalBonus,
      'Khấu trừ': item.totalDeductions,
      'Thực nhận': item.netSalary,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SalarySlip');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `salary_${selectedMonth}_${selectedYear}.xlsx`);
  };

  const salarySlipsColumns = [
    {
      title: 'IDNV',
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
      render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
    },
    {
      title: 'Phụ cấp',
      dataIndex: 'otherAllowances',
      key: 'otherAllowances',
      sorter: (a, b) => a.otherAllowances - b.otherAllowances,
      render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
    },
    {
      title: 'Lương thêm giờ (Ngày)',
      dataIndex: 'dayOvertimePay',
      key: 'dayOvertimePay',
      sorter: (a, b) => a.dayOvertimePay - b.dayOvertimePay,
      render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
    },
    {
      title: 'Lương thêm giờ (Đêm)',
      dataIndex: 'nightOvertimePay',
      key: 'nightOvertimePay',
      sorter: (a, b) => a.nightOvertimePay - b.nightOvertimePay,
      render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
    },
    {
      title: 'Thưởng',
      dataIndex: 'totalBonus',
      key: 'totalBonus',
      sorter: (a, b) => a.totalBonus - b.totalBonus,
      render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
    },
    {
      title: 'Khấu trừ',
      dataIndex: 'totalDeductions',
      key: 'totalDeductions',
      sorter: (a, b) => a.totalDeductions - b.totalDeductions,
      render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
    },
    {
      title: 'Thực nhận',
      dataIndex: 'netSalary',
      key: 'netSalary',
      sorter: (a, b) => a.netSalary - b.netSalary,
      render: (val) => (
        <span style={{ fontWeight: 'bold', color: 'green' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space wrap>
          <Button
            icon={<FileTextOutlined />}
            size="small"
            type="primary"
            onClick={exportToExcel}
            disabled={filteredSlips.length === 0}
          >
            Xuất Excel
          </Button>

          {record.status === 'PENDING' && (
            <Button size="small" icon={<CheckCircleOutlined />} style={{ backgroundColor: 'green', color: 'white' }}>
              Duyệt
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="Salary" style={{ padding: 12 }}>
      <Card title="Danh sách phiếu lương">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6}>
            <Select value={selectedMonth} onChange={handleMonthChange} style={{ width: '100%' }}>
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return (
                  <Option key={month} value={month}>
                    Tháng {month}
                  </Option>
                );
              })}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select value={selectedYear} onChange={handleYearChange} style={{ width: '100%' }}>
              {Array.from({ length: 10 }, (_, i) => {
                const year = (moment().year() - 5 + i).toString();
                return (
                  <Option key={year} value={year}>
                    Năm {year}
                  </Option>
                );
              })}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên"
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={setSearchTerm}
              style={{ width: '100%' }}
            />
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Button type="primary" block onClick={handleSearch} loading={loading}>
              Xem lương
            </Button>
          </Col>
        </Row>

        <div style={{ marginTop: 16 }}>
          <Table
            columns={salarySlipsColumns}
            dataSource={filteredSlips}
            rowKey="id"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              defaultPageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} trên tổng ${total} bản ghi`,
            }}
            scroll={{ x: 'max-content' }}
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
        </div>
      </Card>
    </div>
  );
}

export default Salary;
