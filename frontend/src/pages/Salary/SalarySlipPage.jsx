import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Alert, DatePicker, Typography, Space } from 'antd';
import dayjs from 'dayjs';
import SalarySlipDetail from '~/components/SalarySlipDetail/SalarySlipDetail';
import { getSalarySlipByEmployeeIdAndMonth } from '~/services/salarySlipService';

const { Title } = Typography;

const SalarySlipPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = 1;
  const [selectedMonth, setSelectedMonth] = useState(dayjs()); // mặc định là tháng hiện tại

  const fetchData = async (month) => {
    setLoading(true);  // Đặt trạng thái loading thành true khi bắt đầu lấy dữ liệu
    setError(null);    // Xóa lỗi cũ nếu có

    const formattedMonth = month.format('YYYY-MM');  // Định dạng lại tháng thành 'YYYY-MM'
    
    try {
        // Gọi API để lấy dữ liệu phiếu lương
        const response = await getSalarySlipByEmployeeIdAndMonth(userId, formattedMonth);
        console.log(response);  // Log dữ liệu để kiểm tra
        
        // Cập nhật dữ liệu vào state
        setData(response);
    } catch (error) {
        // Xử lý lỗi khi API trả về lỗi
        console.error("Lỗi khi lấy dữ liệu phiếu lương:", error);
        setError(error.message || 'Không thể lấy dữ liệu phiếu lương.');
    } finally {
        // Đảm bảo rằng loading luôn được tắt, bất kể có lỗi hay không
        setLoading(false);
    }
};


  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);

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
          <Alert type="error" message={error} showIcon />
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
