import React, { useState, useEffect } from 'react';
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
  Row,
  Col,
  InputNumber,
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
import { getSalaryConfigByUserId, getSalaryConfigList, updateSalaryConfig } from '~/services/salaryConfigService';
import { fetchAllDataForSalary, fetchAllDataForSalaryManagement } from '~/utils/fetchData';
import { createSalaryBonus } from '~/services/salaryBonusService';
import { createSalaryDeduction } from '~/services/deductionService';
import { calculateSalary } from '~/services/salarySlipService';

const { TabPane } = Tabs;
const { Option } = Select;

const SalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [mappedEmployees, setMappedEmployees] = useState([]);
  const [salaryConfig, setSalaryConfig] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1); // 1 - 12
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [salaryConfigModalVisible, setSalaryConfigModalVisible] = useState(false);
  const [bonusModalVisible, setBonusModalVisible] = useState(false);
  const [deductionModalVisible, setDeductionModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form] = Form.useForm();

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i); // 5 năm trước và sau

  useEffect(() => {
    const monthString = `${selectedYear}-${selectedMonth}`;
    const loadData = async () => {
      try {
        const [mappedEmployees, dept, posi] = await fetchAllDataForSalaryManagement(monthString);
        setMappedEmployees(mappedEmployees);
        setDepartments(dept);
        setPositions(posi);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSalaryConfigClick = async (employee) => {
    setSelectedEmployee(employee);
    setSalaryConfigModalVisible(true);

    try {
      const salaryConfig = await getSalaryConfigByUserId(employee.id);

      form.setFieldsValue({
        basicSalary: salaryConfig.basicSalary || 0,
        standardWorkingDays: salaryConfig.standardWorkingDays || 0,
        dayOvertimeRate: salaryConfig.dayOvertimeRate || 0,
        nightOvertimeRate: salaryConfig.nightOvertimeRate || 0,
        insuranceBaseSalary: salaryConfig.insuranceBaseSalary,
        overtimeRate: salaryConfig.overtimeRate || 0,
        otherAllowances: salaryConfig.otherAllowances || 0,
        bonusRate: salaryConfig.bonusRate || 0,
        breakDurationMinutes: salaryConfig.breakDurationMinutes || 0,
        workStartTime: salaryConfig.workStartTime,
        workEndTime: salaryConfig.workEndTime,
        holidayOvertimeRate: salaryConfig.holidayOvertimeRate || 0,
      });
    } catch (error) {
      message.error('Không thể lấy cấu hình lương cho nhân viên');
    }
  };

  const employeeColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      filters: departments.map((dept) => ({ text: dept.departmentName, value: dept.departmentName })),
      onFilter: (value, record) => record.department.indexOf(value) === 0,
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      filters: positions.map((pos) => ({ text: pos.positionName, value: pos.positionName })),
      onFilter: (value, record) => record.position.indexOf(value) === 0,
    },
    {
      title: 'Lương cơ bản',
      dataIndex: 'basicSalary',
      key: 'basicSalary',
      render: (salary) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salary),
      sorter: (a, b) => a.basicSalary - b.basicSalary,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang làm việc', value: 'ACTIVE' },
        { text: 'Đã nghỉ việc', value: 'INACTIVE' },
        { text: 'Đang nghỉ phép', value: 'ON_LEAVE' },
        { text: 'Đang thử việc', value: 'PROBATION' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        switch (status) {
          case 'ACTIVE':
            return <Tag color="green">Đang làm việc</Tag>;
          case 'INACTIVE':
            return <Tag color="red">Đã nghỉ việc</Tag>;
          case 'ON_LEAVE':
            return <Tag color="gold">Đang nghỉ phép</Tag>;
          case 'PROBATION':
            return <Tag color="blue">Đang thử việc</Tag>;
          default:
            return <Tag color="default">{status}</Tag>;
        }
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Cấu hình lương">
            <Button
              type="primary"
              icon={<SettingOutlined />}
              size="small"
              onClick={() => {
                handleSalaryConfigClick(record);
                setSalaryConfigModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Thêm thưởng">
            <Button
              type="default"
              icon={<TrophyOutlined />}
              size="small"
              style={{ backgroundColor: '#52c41a', color: 'white' }}
              onClick={() => {
                setSelectedEmployee(record);
                setBonusModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Thêm khấu trừ">
            <Button
              danger
              icon={<DollarOutlined />}
              size="small"
              onClick={() => {
                setSelectedEmployee(record);
                setDeductionModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button type="default" icon={<FileTextOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleCalculateSalary = async () => {
    try {
      setLoading(true);

      // Kết hợp tháng và năm thành định dạng YYYY-MM
      const formattedMonth = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;

      for (let employee of mappedEmployees) {
        if ((employee.status === 'ACTIVE' || employee.status === 'PROBATION') && employee.basicSalary > 0) {
          const salaryData = {
            userId: employee.id,
            month: formattedMonth,
          };

          try {
            const result = await calculateSalary(salaryData.userId, salaryData.month);
          } catch (error) {
            message.error(`Lỗi khi tính lương cho nhân viên ${employee.name}`);
          }
        }
      }

      message.success('Đã tính toán lương cho tất cả nhân viên có lương cơ bản hợp lệ!');
    } catch (error) {
      message.error('Đã xảy ra lỗi khi tính toán lương cho nhân viên.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalaryConfigSubmit = async (values) => {
    const monthString = `${selectedYear}-${selectedMonth}`;
    try {
      await updateSalaryConfig(selectedEmployee.id, values);
      message.success('Cấu hình lương đã được cập nhật cho ' + selectedEmployee.name);
      fetchAllDataForSalaryManagement(monthString);
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật cấu hình lương cho ' + selectedEmployee.name);
    }
    setSalaryConfigModalVisible(false);
  };

  const handleBonusSubmit = async (values) => {
    try {
      const monthString = `${selectedYear}-${selectedMonth}`;
      const payload = { ...values, userId: selectedEmployee.id };
      await createSalaryBonus(payload);
      fetchAllDataForSalaryManagement(monthString);
    } catch (error) {
      message.error('Đã xảy ra lỗi khi thêm thưởng cho ' + selectedEmployee.name);
    }
    setBonusModalVisible(false);
  };

  const handleDeductionSubmit = async (values) => {
    try {
      const payload = { ...values, userId: selectedEmployee.id };
      await createSalaryDeduction(payload);
    } catch (error) {
      message.success('Đã thêm khoản khấu trừ cho ' + selectedEmployee.name);
    }
    setDeductionModalVisible(false);
  };

  return (
    <div className="Salary-management p-3">
      <h1>Quản lý lương và phúc lợi</h1>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Nhân viên & Lương
            </span>
          }
          key="1"
        >
          <Card title="Tính lương tháng" style={{ marginBottom: 16 }}>
            <Space align="center">
              <Select
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(value)}
                placeholder="Chọn tháng"
                style={{ width: 100 }}
              >
                {months.map((month) => (
                  <Option key={month} value={month}>
                    Tháng {month}
                  </Option>
                ))}
              </Select>

              <Select
                value={selectedYear}
                onChange={(value) => setSelectedYear(value)}
                placeholder="Chọn năm"
                style={{ width: 100 }}
              >
                {years.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>

              <Button type="primary" icon={<CalculatorOutlined />} onClick={handleCalculateSalary}>
                Tính lương
              </Button>
            </Space>
          </Card>

          <Card title="Danh sách nhân viên">
            <Space style={{ marginBottom: 16 }}>
              <Input.Search placeholder="Tìm kiếm nhân viên" style={{ width: 300 }} />
            </Space>

            <Table
              columns={employeeColumns}
              dataSource={mappedEmployees}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SettingOutlined />
              Cấu hình hệ thống
            </span>
          }
          key="3"
        >
          <Card title="Thiết lập cấu hình lương">
            <Form layout="vertical">
              <Form.Item label="Ngày trả lương trong tháng">
                <Input type="number" min={1} max={31} defaultValue={25} />
              </Form.Item>

              <Form.Item label="Tỷ lệ làm thêm giờ mặc định">
                <Input type="number" min={1} step={0.1} defaultValue={1.5} addonAfter="lần mức lương giờ" />
              </Form.Item>

              <Form.Item label="Tỷ lệ làm thêm giờ ngày nghỉ">
                <Input type="number" min={1} step={0.1} defaultValue={2} addonAfter="lần mức lương giờ" />
              </Form.Item>

              <Form.Item label="Tỷ lệ làm thêm giờ ngày lễ">
                <Input type="number" min={1} step={0.1} defaultValue={3} addonAfter="lần mức lương giờ" />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button type="primary">Lưu cấu hình</Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
      {/* Modal for Salary Config */}
      <Modal
        title={`Cấu hình lương cho ${selectedEmployee?.name}`}
        open={salaryConfigModalVisible}
        onCancel={() => setSalaryConfigModalVisible(false)}
        footer={null}
        width={800} // ✅ tăng chiều rộng modal
      >
        <Form form={form} onFinish={handleSalaryConfigSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Lương cơ bản"
                name="basicSalary"
                rules={[{ required: true, message: 'Vui lòng nhập lương cơ bản' }]}
              >
                <Input type="number" min={0} step={1000} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số ngày làm việc tiêu chuẩn"
                name="standardWorkingDays"
                rules={[{ required: true, message: 'Vui lòng nhập số ngày làm việc tiêu chuẩn' }]}
              >
                <Input type="number" min={0} step={1} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Mức lương đóng BHXH" name="insuranceBaseSalary">
                <Input type="number" min={0} step={50000} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Phụ cấp khác" name="otherAllowances">
                <Input type="number" min={0} step={10000} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tỷ lệ OT ngày thường"
                name="dayOvertimeRate"
                rules={[{ required: true, message: 'Nhập tỷ lệ OT ngày thường' }]}
              >
                <Input type="number" min={0} step={0.1} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tỷ lệ OT ban đêm"
                name="nightOvertimeRate"
                rules={[{ required: true, message: 'Nhập tỷ lệ OT ban đêm' }]}
              >
                <Input type="number" min={0} step={0.1} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tỷ lệ OT ngày lễ"
                name="holidayOvertimeRate"
                rules={[{ required: true, message: 'Nhập tỷ lệ OT ngày lễ' }]}
              >
                <Input type="number" min={0} step={0.1} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Thời gian bắt đầu làm việc"
                name="workStartTime"
                rules={[{ required: true, message: 'Nhập giờ bắt đầu' }]}
              >
                <Input type="text" placeholder="HH:mm:ss" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Thời gian kết thúc làm việc"
                name="workEndTime"
                rules={[{ required: true, message: 'Nhập giờ kết thúc' }]}
              >
                <Input type="text" placeholder="HH:mm:ss" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Thời gian nghỉ (phút)"
                name="breakDurationMinutes"
                rules={[{ required: true, message: 'Nhập số phút nghỉ' }]}
              >
                <Input type="number" min={0} step={5} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginTop: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu cấu hình
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal for Bonus */}
      <Modal
        title={`Thêm thưởng cho ${selectedEmployee?.name}`}
        open={bonusModalVisible}
        onCancel={() => setBonusModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleBonusSubmit} layout="vertical">
          <Form.Item
            label="Loại thưởng"
            name="bonusType"
            rules={[{ required: true, message: 'Vui lòng chọn loại thưởng' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày thưởng"
            name="bonusDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày thưởng' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Số tiền thưởng"
            name="amount"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền thưởng' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm thưởng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal for Deduction */}
      <Modal
        title={`Thêm khấu trừ cho ${selectedEmployee?.name}`}
        open={deductionModalVisible}
        onCancel={() => setDeductionModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleDeductionSubmit} layout="vertical">
          <Form.Item
            label="Loại khấu trừ"
            name="deductionType"
            rules={[{ required: true, message: 'Vui lòng chọn loại khấu trừ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày khấu trừ"
            name="deductionDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày khấu trừ' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Số tiền khấu trừ"
            name="amount"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền khấu trừ' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm khấu trừ
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalaryManagement;
