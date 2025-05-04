import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getEmployees } from '~/services/employeeService';
import { getDepartments } from '~/services/departmentService';
import { getPositions } from '~/services/positionService';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ff8042'];

const Dashboard = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [positionData, setPositionData] = useState([]);

  const [departmentDistributionData, setDepartmentDistributionData] = useState([]);
  const [statusDistributionData, setStatusDistributionData] = useState([]);
  const [hireDateDistributionData, setHireDateDistributionData] = useState([]);
  const [positionDistributionData, setPositionDistributionData] = useState([]);

  useEffect(() => {
    getEmployees()
      .then((employees) => {
        setEmployeeData(employees);

        const departmentCounts = employees.reduce((acc, emp) => {
          acc[emp.departmentId] = (acc[emp.departmentId] || 0) + 1;
          return acc;
        }, {});

        const statusCounts = employees.reduce((acc, emp) => {
          acc[emp.status] = (acc[emp.status] || 0) + 1;
          return acc;
        }, {});

        const hireDateCounts = employees.reduce((acc, emp) => {
          const date = new Date(emp.hireDate).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const positionCounts = employees.reduce((acc, emp) => {
          acc[emp.positionId] = (acc[emp.positionId] || 0) + 1;
          return acc;
        }, {});

        setDepartmentDistributionData(
          Object.entries(departmentCounts).map(([id, count]) => ({ departmentId: id, count })),
        );

        setStatusDistributionData(Object.entries(statusCounts).map(([status, count]) => ({ status, count })));

        setHireDateDistributionData(Object.entries(hireDateCounts).map(([hireDate, count]) => ({ hireDate, count })));

        setPositionDistributionData(
          Object.entries(positionCounts).map(([positionId, count]) => ({ positionId, count })),
        );
      })
      .catch(console.error);

    getDepartments().then(setDepartmentData).catch(console.error);
    getPositions().then(setPositionData).catch(console.error);
  }, []);

  const departmentMap = Object.fromEntries(departmentData.map((dep) => [dep.departmentId, dep.departmentName]));

  const positionMap = Object.fromEntries(positionData.map((pos) => [pos.positionId, pos.positionName]));

  const departmentWithNames = departmentDistributionData.map((d) => ({
    ...d,
    name: departmentMap[d.departmentId] || 'Không xác định',
  }));

  const positionWithNames = positionDistributionData.map((p) => ({
    ...p,
    name: positionMap[p.positionId] || 'Không xác định',
  }));

  return (
    <div className="page-container dashboard-container">
      <h2 className="page-title">Tổng quan</h2>
      <section className="chart-container">
        <h2 className="chart-title">Phân bố nhân viên theo phòng ban</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={departmentWithNames} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {departmentWithNames.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-container">
        <h2 className="chart-title">Phân bổ nhân viên theo trạng thái</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusDistributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-container">
        <h2 className="chart-title">Phân bổ nhân viên theo ngày gia nhập</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hireDateDistributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hireDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-container">
        <h2 className="chart-title">Phân bổ nhân viên theo vị trí công việc</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={positionWithNames}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Dashboard;
