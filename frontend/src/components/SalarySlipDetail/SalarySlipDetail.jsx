import React from 'react';
import { Card, Descriptions, Table, Divider, Row, Col } from 'antd';

const SalarySlipDetail = ({ data }) => {
  if (!data) return <div>Không có dữ liệu</div>;

  const { salarySlip, bonusDetails, deductionDetails } = data;

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
    <div className="">
      <Row gutter={16}>
        <Col md={6}>
          <Card title="Thông tin nhân viên">
            <Descriptions column={1}>
              <Descriptions.Item label="ID Nhân viên">{salarySlip.userId}</Descriptions.Item>
              <Descriptions.Item label="Họ tên">{salarySlip.fullName}</Descriptions.Item>
              <Descriptions.Item label="Phòng ban">
                {salarySlip.department?.departmentName || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Chức vụ">
                {salarySlip.position?.positionName || 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col md={18}>
          <Card title="Chi tiết bảng lương">
            <Descriptions column={3}>
              {/* 1. Thông tin cơ bản về thời gian */}
              <Descriptions.Item label="Tháng lương">{salarySlip.salaryPeriod}</Descriptions.Item>
              <Descriptions.Item label="Ngày tính lương">{salarySlip.calculationDate}</Descriptions.Item>
              <Descriptions.Item label="Ngày thanh toán">{salarySlip.paymentDate}</Descriptions.Item>

              {/* 2. Thông tin ngày công */}
              <Descriptions.Item label="Số ngày công chuẩn">{salarySlip.standardWorkingDays}</Descriptions.Item>
              <Descriptions.Item label="Số ngày công thực tế">{salarySlip.actualWorkingDays}</Descriptions.Item>
              <Descriptions.Item label="Số giờ công chuẩn">{salarySlip.standardWorkingHours}</Descriptions.Item>
              <Descriptions.Item label="Số giờ công thực tế">{salarySlip.actualWorkingHours}</Descriptions.Item>

              {/* 3. Các khoản thu nhập */}
              <Descriptions.Item label="Lương cơ bản">
                {salarySlip.actualBasicSalary.toLocaleString()}₫
              </Descriptions.Item>
              <Descriptions.Item label="Phụ cấp">{salarySlip.otherAllowances.toLocaleString()}₫</Descriptions.Item>
              <Descriptions.Item label="Lương làm thêm ngày">
                {salarySlip.dayOvertimePay.toLocaleString()}₫
              </Descriptions.Item>
              <Descriptions.Item label="Lương làm thêm đêm">
                {salarySlip.nightOvertimePay.toLocaleString()}₫
              </Descriptions.Item>
              <Descriptions.Item label="Tổng thưởng">{salarySlip.totalBonus.toLocaleString()}₫</Descriptions.Item>

              {/* 4. Các khoản khấu trừ */}
              <Descriptions.Item label="Tổng khấu trừ">
                {salarySlip.totalDeductions.toLocaleString()}₫
              </Descriptions.Item>

              {/* 5. Tổng kết */}
              <Descriptions.Item label="Tổng thu nhập" span={2} style={{ fontWeight: 'bold' }}>
                {Math.round(salarySlip.grossIncome).toLocaleString()}₫
              </Descriptions.Item>
              <Descriptions.Item label="Lương thực nhận" span={2} style={{ fontWeight: 'bold', color: '#1890ff' }}>
                {Math.round(salarySlip.netSalary).toLocaleString()}₫
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col md={12}>
          <Card title="Chi tiết thưởng">
            <Table columns={bonusColumns} dataSource={bonusDetails} pagination={false} rowKey="bonusId" />
          </Card>
        </Col>
        <Col md={12}>
          <Card title="Chi tiết khấu trừ">
            <Table columns={deductionColumns} dataSource={deductionDetails} pagination={false} rowKey="deductionId" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalarySlipDetail;
