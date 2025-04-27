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
import { fetchAllDataForPayroll } from '~/utils/fetchData';
import { createSalaryBonus } from '~/services/salaryBonusService';
import { createSalaryDeduction } from '~/services/deductionService';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PayrollManagement = () => {
  // Các trạng thái
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

  const [form] = Form.useForm();

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

  const handleSalaryConfigClick = async (employee) => {
    setSelectedEmployee(employee);
    setSalaryConfigModalVisible(true);

    try {
      // Lấy cấu hình lương cho nhân viên khi nhấn vào
      const salaryConfig = await getSalaryConfigByUserId(employee.id);

      // Chỉnh sửa trạng thái để hiển thị dữ liệu cấu hình lương
      form.setFieldsValue({
        basicSalary: salaryConfig.basicSalary || 0,
        overtimeRate: salaryConfig.overtimeRate || 0,
        otherAllowances: salaryConfig.otherAllowances || 0,
        bonusRate: salaryConfig.bonusRate || 0,
      });
    } catch (error) {
      console.error('Không thể lấy cấu hình lương cho nhân viên:', error);
      message.error('Không thể lấy cấu hình lương cho nhân viên');
    }
  };

  // Cột bảng nhân viên
  const employeeColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
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
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ'}</Tag>
      ),
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

  // Tính toán lương
  const handleCalculatePayroll = () => {
    message.loading('Đang tính toán lương cho tháng ' + selectedMonth);

    // Giả lập cuộc gọi API
    setTimeout(() => {
      message.success('Đã hoàn thành tính lương cho ' + employees.length + ' nhân viên');
    }, 2000);
  };

  // Mẫu cấu hình lương
  const handleSalaryConfigSubmit = async (values) => {
    try {
      await updateSalaryConfig(selectedEmployee.id, values);
      message.success('Cấu hình lương đã được cập nhật cho ' + selectedEmployee.name);
      fetchAllDataForPayroll();
    } catch (error) {
      console.error('Error saving salary config:', error);
      message.error('Đã xảy ra lỗi khi cập nhật cấu hình lương cho ' + selectedEmployee.name);
    }
    setSalaryConfigModalVisible(false);
  };

  // Mẫu thưởng
  const handleBonusSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        userId: selectedEmployee.id, // Thêm dòng này
      };
      await createSalaryBonus(payload);
      fetchAllDataForPayroll();
    } catch (error) {
      console.error('Error creating salary bonus:', error);
      message.error('Đã xảy ra lỗi khi thêm thưởng cho ' + selectedEmployee.name);
    }
    setBonusModalVisible(false);
  };

  // Mẫu khấu trừ
  const handleDeductionSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        userId: selectedEmployee.id, // Thêm dòng này
      };
      await createSalaryDeduction(payload);
    } catch (error) {
      console.log('Deduction values:', values);
      message.success('Đã thêm khoản khấu trừ cho ' + selectedEmployee.name);
    }
    setDeductionModalVisible(false);
  };

  return (
    <div className="payroll-management p-3">
      <h1>Quản lý lương và phúc lợi</h1>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: (
              <span>
                <UserOutlined />
                Nhân viên & Lương
              </span>
            ),
            key: '1',
            children: (
              <div>
                <Card title="Tính lương tháng" style={{ marginBottom: 16 }}>
                  <Space align="center">
                    <DatePicker.MonthPicker
                      value={moment(selectedMonth)}
                      onChange={(date) => setSelectedMonth(date.format('YYYY-MM'))}
                      format="MM/YYYY"
                      placeholder="Chọn tháng"
                    />
                    <Button type="primary" icon={<CalculatorOutlined />} onClick={handleCalculatePayroll}>
                      Tính lương
                    </Button>
                  </Space>
                </Card>

                <Card title="Danh sách nhân viên">
                  <Space style={{ marginBottom: 16 }}>
                    <Input.Search placeholder="Tìm kiếm nhân viên" style={{ width: 300 }} />
                    <Select placeholder="Phòng ban" style={{ width: 200 }}>
                      <Option value="">Tất cả phòng ban</Option>
                      {departments.map((dept) => (
                        <Option key={dept.departmentId} value={dept.id}>
                          {dept.departmentName}
                        </Option>
                      ))}
                    </Select>
                    <Select placeholder="Vị trí" style={{ width: 200 }}>
                      <Option value="">Tất cả vị trí</Option>
                      {positions.map((pos) => (
                        <Option key={pos.positionId} value={pos.positionId}>
                          {pos.positionName}
                        </Option>
                      ))}
                    </Select>
                  </Space>

                  <Table
                    columns={employeeColumns}
                    dataSource={mappedEmployees}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </div>
            ),
          },
          {
            label: (
              <span>
                <SettingOutlined />
                Cấu hình hệ thống
              </span>
            ),
            key: '3',
            children: (
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
            ),
          },
        ]}
      />
      {/* Cấu hình lương Modal */}
      <Modal
        title={`Cấu hình lương - ${selectedEmployee?.name || ''}`}
        open={salaryConfigModalVisible} // Thay 'visible' bằng 'open'
        onCancel={() => setSalaryConfigModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSalaryConfigSubmit}>
          <Form.Item name="basicSalary" label="Lương cơ bản" initialValue={selectedEmployee?.basicSalary || 0}>
            <Input type="number" min={0} addonAfter="VND" />
          </Form.Item>

          <Form.Item name="overtimeRate" label="Tỷ lệ làm thêm giờ" initialValue={0}>
            <Input type="number" min={1} step={0.1} addonAfter="x" />
          </Form.Item>

          <Form.Item name="otherAllowances" label="Phụ cấp khác" initialValue={0}>
            <Input type="number" min={0} addonAfter="VND" />
          </Form.Item>

          <Form.Item name="bonusRate" label="Tỷ lệ thưởng" initialValue={0}>
            <Input type="number" min={0} step={0.01} addonAfter="%" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Lưu cấu hình
              </Button>
              <Button onClick={() => setSalaryConfigModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bonus Modal */}
      <Modal
        title={`Thêm khoản thưởng - ${selectedEmployee?.name || ''}`}
        open={bonusModalVisible} // Thay 'visible' bằng 'open'
        onCancel={() => setBonusModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleBonusSubmit}>
          <Form.Item name="bonusType" label="Loại thưởng" rules={[{ required: true }]}>
            <Select>
              <Option value="PERFORMANCE">Thưởng hiệu suất</Option>
              <Option value="OVERTIME">Thưởng làm thêm giờ</Option>
              <Option value="HOLIDAY">Thưởng lễ</Option>
              <Option value="MONTHLY">Thưởng tháng</Option>
              <Option value="OTHER">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Số tiền" rules={[{ required: true }]}>
            <Input type="number" min={0} addonAfter="VND" />
          </Form.Item>

          <Form.Item name="bonusDate" label="Ngày thưởng" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Lưu thưởng
              </Button>
              <Button onClick={() => setBonusModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Deduction Modal */}
      <Modal
        title={`Thêm khoản khấu trừ - ${selectedEmployee?.name || ''}`}
        open={deductionModalVisible} // Thay 'visible' bằng 'open'
        onCancel={() => setDeductionModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleDeductionSubmit}>
          <Form.Item name="deductionType" label="Loại khấu trừ" rules={[{ required: true }]}>
            <Select>
              <Option value="TAX">Thuế</Option>
              <Option value="INSURANCE">Bảo hiểm</Option>
              <Option value="ABSENCE">Vắng mặt</Option>
              <Option value="ADVANCE">Tạm ứng</Option>
              <Option value="OTHER">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Số tiền" rules={[{ required: true }]}>
            <Input type="number" min={0} addonAfter="VND" />
          </Form.Item>

          <Form.Item name="deductionDate" label="Ngày khấu trừ" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Lý do">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Lưu khấu trừ
              </Button>
              <Button onClick={() => setDeductionModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PayrollManagement;
