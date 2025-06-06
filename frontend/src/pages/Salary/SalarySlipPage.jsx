import React, { useEffect, useState } from 'react';
import { Spin, Alert, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import SalarySlipDetail from '~/components/SalarySlipDetail/SalarySlipDetail';
import { getSalarySlipByEmployeeIdAndMonth } from '~/services/salarySlipService';
import { useParams } from 'react-router-dom';

const SalarySlipPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const routeParams = useParams(); // chỉ gọi 1 lần duy nhất ở đầu component

  const role = localStorage.getItem('roleName');
  const userId = role === 'ROLE_HR' ? routeParams.userId : localStorage.getItem('userId');

  const [selectedMonth, setSelectedMonth] = useState(dayjs()); // mặc định là tháng hiện tại

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      const formattedMonth = selectedMonth.format('YYYY-MM');

      try {
        const response = await getSalarySlipByEmployeeIdAndMonth(userId, formattedMonth);
        setData(response);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phiếu lương:', error);
        setError(error.message || 'Không thể lấy dữ liệu phiếu lương.');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selectedMonth, userId]);

  const handleMonthChange = (value) => {
    if (value) setSelectedMonth(value);
  };

  return (
    <div className="page-container employees-container">
      <h2 className="page-title">Chi tiết bảng lương</h2>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            allowClear={false}
            format="YYYY-MM"
          />
        </Space>

        {loading ? (
          <Spin tip="Đang tải bảng lương..." />
        ) : error ? (
          <Alert type="info" message={'Không có phiếu lương cho tháng này'} showIcon />
        ) : data ? (
          <SalarySlipDetail data={data} />
        ) : (
          <Alert type="info" message="Không có dữ liệu bảng lương cho tháng này." showIcon />
        )}
      </Space>
    </div>
  );
};

export default SalarySlipPage;
