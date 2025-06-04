import React, { useState, useEffect, useCallback } from 'react';
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
  Space,
  Tag,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  CalculatorOutlined,
  SettingOutlined,
  TrophyOutlined,
  FileTextOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { getSalaryConfigByUserId, updateSalaryConfig } from '~/services/salaryConfigService';
import { fetchAllDataForSalaryManagement } from '~/utils/fetchData';
import { createSalaryBonus } from '~/services/salaryBonusService';
import { createSalaryDeduction } from '~/services/deductionService';
import { calculateSalary } from '~/services/salarySlipService';

const { TabPane } = Tabs;
const { Option } = Select;



const SalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1); // 1 - 12
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [salaryConfigModalVisible, setSalaryConfigModalVisible] = useState(false);
  const [bonusModalVisible, setBonusModalVisible] = useState(false);
  const [deductionModalVisible, setDeductionModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryConfigForm] = Form.useForm(); // Đổi tên form để rõ ràng hơn
  const [bonusForm] = Form.useForm();
  const [deductionForm] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i); // 5 năm trước và 4 năm sau

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const monthString = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
      const [fetchedEmployees, fetchedDepartments, fetchedPositions] = await fetchAllDataForSalaryManagement(monthString);
      setEmployees(fetchedEmployees);
      setDepartments(fetchedDepartments);
      setPositions(fetchedPositions);
      setFilteredEmployees(fetchedEmployees); // Cập nhật lại filteredEmployees khi dữ liệu được tải
    } catch (error) {
      message.error('Không thể tải dữ liệu quản lý lương.');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]); // Dependency array

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    const filtered = employees.filter((emp) => emp.fullName?.toLowerCase().includes(value.toLowerCase()));
    setFilteredEmployees(filtered);
  };

  const handleSalaryConfigClick = async (employee) => {
    setSelectedEmployee(employee);
    setSalaryConfigModalVisible(true);
    salaryConfigForm.resetFields(); // Reset form trước khi set giá trị mới

    try {
      const salaryConfig = await getSalaryConfigByUserId(employee.id);

      salaryConfigForm.setFieldsValue({
        basicSalary: salaryConfig?.basicSalary || 0,
        standardWorkingDays: salaryConfig?.standardWorkingDays || 0,
        dayOvertimeRate: salaryConfig?.dayOvertimeRate || 0,
        nightOvertimeRate: salaryConfig?.nightOvertimeRate || 0,
        insuranceBaseSalary: salaryConfig?.insuranceBaseSalary || 0,
        otherAllowances: salaryConfig?.otherAllowances || 0,
        holidayOvertimeRate: salaryConfig?.holidayOvertimeRate || 0,
        breakDurationMinutes: salaryConfig?.breakDurationMinutes || 0,
        workStartTime: salaryConfig?.workStartTime,
        workEndTime: salaryConfig?.workEndTime,
        numberOfDependents: salaryConfig?.numberOfDependents || 0,
      });
    } catch (error) {
      message.error('Không thể lấy cấu hình lương cho nhân viên.');
      console.error('Error fetching salary config:', error);
    }
  };

  const employeeColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' }, // Sửa từ 'fullname' thành 'fullName'
    {
      title: 'Phòng ban',
      dataIndex: 'departmentName',
      key: 'departmentName',
      filters: departments.map((dept) => ({ text: dept.departmentName, value: dept.departmentName })),
      onFilter: (value, record) => record.departmentName.indexOf(value) === 0, // Sửa record.department
    },
    {
      title: 'Vị trí',
      dataIndex: 'positionName',
      key: 'positionName',
      filters: positions.map((pos) => ({ text: pos.positionName, value: pos.positionName })),
      onFilter: (value, record) => record.positionName.indexOf(value) === 0, // Sửa record.position
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
              onClick={() => handleSalaryConfigClick(record)}
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
                bonusForm.resetFields();
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
                deductionForm.resetFields();
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
    setLoading(true);
    try {
      const formattedMonth = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

      for (const employee of employees) { // Sử dụng 'employees' state
        if ((employee.status === 'ACTIVE' || employee.status === 'PROBATION') && employee.basicSalary > 0) {
          try {
            await calculateSalary(employee.id, formattedMonth);
            message.success(`Đã tính lương cho nhân viên ${employee.fullName}`);
          } catch (error) {
            message.error(`Lỗi khi tính lương cho nhân viên ${employee.fullName}`);
            console.error(`Error calculating salary for ${employee.fullName}:`, error);
          }
        }
      }
      message.success('Hoàn tất tính toán lương cho các nhân viên hợp lệ!');
    } catch (error) {
      message.error('Đã xảy ra lỗi tổng quát khi tính toán lương.');
      console.error('General error during salary calculation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalaryConfigSubmit = async (values) => {
    if (!selectedEmployee) return;
    try {
      await updateSalaryConfig(selectedEmployee.id, values);
      message.success(`Cấu hình lương đã được cập nhật cho ${selectedEmployee.fullName}`);
      setSalaryConfigModalVisible(false);
      loadAllData(); // Tải lại dữ liệu sau khi cập nhật
    } catch (error) {
      message.error(`Đã xảy ra lỗi khi cập nhật cấu hình lương cho ${selectedEmployee.fullName}`);
      console.error('Error updating salary config:', error);
    }
  };

  const handleBonusSubmit = async (values) => {
    if (!selectedEmployee) return;
    try {
      const payload = { ...values, userId: selectedEmployee.id, bonusDate: values.bonusDate };
      await createSalaryBonus(payload);
      message.success(`Đã thêm thưởng cho ${selectedEmployee.fullName}`);
      setBonusModalVisible(false);
      loadAllData(); // Tải lại dữ liệu sau khi thêm thưởng
    } catch (error) {
      message.error(`Đã xảy ra lỗi khi thêm thưởng cho ${selectedEmployee.fullName}`);
      console.error('Error creating bonus:', error);
    }
  };

  const handleDeductionSubmit = async (values) => {
    if (!selectedEmployee) return;
    try {
      const payload = { ...values, userId: selectedEmployee.id, deductionDate: values.deductionDate };
      await createSalaryDeduction(payload);
      message.success(`Đã thêm khoản khấu trừ cho ${selectedEmployee.fullName}`); // Sửa thông báo thành công
      setDeductionModalVisible(false);
      loadAllData(); // Tải lại dữ liệu sau khi thêm khấu trừ
    } catch (error) {
      message.error(`Đã xảy ra lỗi khi thêm khoản khấu trừ cho ${selectedEmployee.fullName}`); // Sửa thông báo lỗi
      console.error('Error creating deduction:', error);
    }
  };

  return (
    <div className="salary-management p-3">
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

              <Button type="primary" icon={<CalculatorOutlined />} onClick={handleCalculateSalary} loading={loading}>
                Tính lương
              </Button>
            </Space>
          </Card>

          <Card title="Danh sách nhân viên">
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder="Tìm kiếm nhân viên"
                value={searchTerm}
                onChange={handleSearch}
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
              />
            </Space>

            <Table
              columns={employeeColumns}
              dataSource={filteredEmployees}
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
          <Card title="Thiết lập cấu hình lương mặc định"> {/* Đổi tên title cho rõ ràng */}
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
        title={`Cấu hình lương cho ${selectedEmployee?.fullName || ''}`}
        open={salaryConfigModalVisible}
        onCancel={() => setSalaryConfigModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={salaryConfigForm} onFinish={handleSalaryConfigSubmit} layout="vertical">
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
            <Col span={12}>
              <Form.Item
                label="Số người phụ thuộc"
                name="numberOfDependents"
                rules={[{ required: true, message: 'Nhập số người phụ thuộc' }]}
              >
                <Input type="number" min={0} step={1} />
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
        title={`Thêm thưởng cho ${selectedEmployee?.fullName || ''}`} 
        open={bonusModalVisible}
        onCancel={() => setBonusModalVisible(false)}
        footer={null}
      >
        <Form form={bonusForm} onFinish={handleBonusSubmit} layout="vertical">
          <Form.Item
            label="Loại thưởng"
            name="bonusType"
            rules={[{ required: true, message: 'Vui lòng nhập loại thưởng' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày thưởng"
            name="bonusDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày thưởng' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
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
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Deduction */}
      <Modal
        title={`Thêm khấu trừ cho ${selectedEmployee?.fullName || ''}`} 
        open={deductionModalVisible}
        onCancel={() => setDeductionModalVisible(false)}
        footer={null}
      >
        <Form form={deductionForm} onFinish={handleDeductionSubmit} layout="vertical">
          <Form.Item
            label="Loại khấu trừ"
            name="deductionType"
            rules={[{ required: true, message: 'Vui lòng nhập loại khấu trừ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày khấu trừ"
            name="deductionDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày khấu trừ' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /> 
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
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalaryManagement;