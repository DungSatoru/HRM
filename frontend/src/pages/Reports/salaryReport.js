import { Card } from "antd";

function SalaryReport() {
  return (
    <div style={{ padding: '20px 0' }}>
      <Card title="Thống kê chi phí lương theo phòng ban" style={{ marginBottom: 20 }}>
        <p>Biểu đồ phân tích chi phí lương sẽ hiển thị ở đây</p>
      </Card>

      <Card title="Xu hướng lương theo thời gian">
        <p>Biểu đồ xu hướng lương sẽ hiển thị ở đây</p>
      </Card>
    </div>
  );
}

export default SalaryReport;
