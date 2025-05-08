import React from 'react';
import { Card, Descriptions, Table, Divider } from 'antd';

const SalarySlipDetail = ({ data }) => {
  if (!data) return <div>Không có dữ liệu</div>;
  const { employee, salarySlip, bonusDetails, deductionDetails, attendanceSummary, totalOvertimeHour } = data;

  const bonusColumns = [
    { title: 'Loại thưởng', dataIndex: 'bonusType', key: 'bonusType' },
    { title: 'Số tiền', dataIndex: 'amount', key: 'amount', render: (val) => `${val.toLocaleString()}₫` },
    { title: 'Ngày thưởng', dataIndex: 'bonusDate', key: 'bonusDate' },
  ];

  const deductionColumns = [
    { title: 'Loại khấu trừ', dataIndex: 'deductionType', key: 'deductionType' },
    { title: 'Số tiền', dataIndex: 'amount', key: 'amount', render: (val) => `${val.toLocaleString()}₫` },
    { title: 'Ngày khấu trừ', dataIndex: 'deductionDate', key: 'deductionDate' },
  ];

  return (
    <div className="p-4 space-y-6">
      <Card title="Thông tin nhân viên">
        <Descriptions column={2}>
          <Descriptions.Item label="Họ tên">{employee.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{employee.phone}</Descriptions.Item>
          <Descriptions.Item label="Ngày vào làm">{employee.hireDate}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Chi tiết bảng lương">
        <Descriptions column={2}>
          <Descriptions.Item label="Lương cơ bản">{salarySlip.basicSalary.toLocaleString()}₫</Descriptions.Item>
          <Descriptions.Item label="Lương thực nhận">{Math.round(salarySlip.totalSalary).toLocaleString()}₫</Descriptions.Item>
          <Descriptions.Item label="Phụ cấp">{salarySlip.otherAllowances.toLocaleString()}₫</Descriptions.Item>
          <Descriptions.Item label="Lương làm thêm">{Math.round(salarySlip.overTimePay).toLocaleString()}₫</Descriptions.Item>
          <Descriptions.Item label="Tổng thưởng">{salarySlip.bonus.toLocaleString()}₫</Descriptions.Item>
          <Descriptions.Item label="Tổng khấu trừ">{salarySlip.deductions.toLocaleString()}₫</Descriptions.Item>
          <Descriptions.Item label="Tháng">{salarySlip.month}</Descriptions.Item>
          <Descriptions.Item label="Ngày thanh toán">{salarySlip.paymentDate}</Descriptions.Item>
          <Descriptions.Item label="Tổng số ngày công">{attendanceSummary}</Descriptions.Item>
          <Descriptions.Item label="Số giờ tăng ca">{Math.round(totalOvertimeHour)} giờ</Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Card title="Chi tiết thưởng">
        <Table columns={bonusColumns} dataSource={bonusDetails} pagination={false} rowKey="bonusId" />
      </Card>

      <Card title="Chi tiết khấu trừ">
        <Table columns={deductionColumns} dataSource={deductionDetails} pagination={false} rowKey="deductionId" />
      </Card>
    </div>
  );
};

export default SalarySlipDetail;
