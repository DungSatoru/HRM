import React from 'react';
import { Card, Descriptions, Table, Divider, Avatar } from 'antd';

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
          <Descriptions.Item label="ID Nhân viên">{salarySlip.userId}</Descriptions.Item>
          <Descriptions.Item label="Họ tên">{salarySlip.fullName}</Descriptions.Item>
          <Descriptions.Item label="Phòng ban">{salarySlip.department?.departmentName || 'Chưa cập nhật'}</Descriptions.Item>
          <Descriptions.Item label="Chức vụ">{salarySlip.position?.positionName || 'Chưa cập nhật'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Chi tiết bảng lương">
        <Descriptions column={2}>
          <Descriptions.Item label="Lương dựa trên ngày công thực tế">
            {salarySlip.actualBasicSalary.toLocaleString()}₫
          </Descriptions.Item>
          <Descriptions.Item label="Phụ cấp">
            {salarySlip.otherAllowances.toLocaleString()}₫
          </Descriptions.Item>
          <Descriptions.Item label="Lương làm thêm ban ngày">
            {salarySlip.dayOvertimePay.toLocaleString()}₫
          </Descriptions.Item>
          <Descriptions.Item label="Lương làm thêm ban đêm">
            {salarySlip.nightOvertimePay.toLocaleString()}₫
          </Descriptions.Item>
          <Descriptions.Item label="Tổng thưởng">
            {salarySlip.totalBonus.toLocaleString()}₫
          </Descriptions.Item>
          <Descriptions.Item label="Tổng khấu trừ">
            {salarySlip.totalDeductions.toLocaleString()}₫
          </Descriptions.Item>
          <Descriptions.Item label="Lương thực nhận">
            {Math.round(salarySlip.totalSalary).toLocaleString()}₫
          </Descriptions.Item>
          <Descriptions.Item label="Ngày thanh toán">
            {salarySlip.paymentDate}
          </Descriptions.Item>
          <Descriptions.Item label="Tháng lương">
            {salarySlip.salaryPeriod}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tính lương">
            {salarySlip.calculationDate}
          </Descriptions.Item>
          <Descriptions.Item label="Số ngày công chuẩn">
            {salarySlip.standardWorkingDays}
          </Descriptions.Item>
          <Descriptions.Item label="Số ngày công thực tế">
            {salarySlip.actualWorkingDays}
          </Descriptions.Item>
          <Descriptions.Item label="Số giờ công chuẩn">
            {salarySlip.standardWorkingHours}
          </Descriptions.Item>
          <Descriptions.Item label="Số giờ công thực tế">
            {salarySlip.actualWorkingHours}
          </Descriptions.Item>

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
