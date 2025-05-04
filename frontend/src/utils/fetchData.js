import { getDepartments } from '~/services/departmentService';
import { getEmployees } from '~/services/employeeService';
import { getPositions } from '~/services/positionService';
import { getSalaryConfigList } from '~/services/salaryConfigService';
import { getSalarySlipsByMonth } from '~/services/salarySlipService';

import moment from 'moment';

export const fetchAllDataForSalary = async (month) => {
  try {
    const [employeesData, departmentsData, positionsData, salarySlipData] = await Promise.all([
      getEmployees(),
      getDepartments(),
      getPositions(),
      getSalarySlipsByMonth(month),
    ]);

    const selectedMonth = moment(month, 'YYYY-MM'); // Chuyển tháng dạng '2024-04' thành đối tượng moment

    const mappedEmployees = employeesData
      .filter((emp) => {
        // Kiểm tra ngày gia nhập
        if (!emp.hireDate) return false;
        const hireDate = moment(emp.hireDate);
        return hireDate.isSameOrBefore(selectedMonth, 'month');
      })
      .map((emp) => {
        const department = departmentsData.find((d) => d.departmentId === emp.departmentId);
        const position = positionsData.find((p) => p.positionId === emp.positionId);
        const salarySlip = salarySlipData.find((slip) => slip.userId === emp.userId && slip.month === month);

        return {
          id: emp.userId,
          name: emp.fullName || 'No Name',
          department: department ? department.departmentName : 'Chưa có phòng ban',
          position: position ? position.positionName : 'Chưa có chức vụ',
          basicSalary: salarySlip ? salarySlip.basicSalary : 0,
          otherAllowance: salarySlip ? salarySlip.otherAllowances : 0,
          overTimePay: salarySlip ? salarySlip.overTimePay : 0,
          bonus: salarySlip ? salarySlip.bonus : 0,
          deduction: salarySlip ? salarySlip.deductions : 0,
          totalSalary: salarySlip ? salarySlip.totalSalary : 0,
          month: salarySlip ? salarySlip.month : 'Thiếu dữ liệu tính lương',
          paymentDate: salarySlip ? salarySlip.paymentDate : 'Chưa có ngày thanh toán',
        };
      });

    return [mappedEmployees, departmentsData, positionsData];
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    throw error;
  }
};


export const fetchAllDataForSalaryManagement = async (month) => {
  try {
    const [employeesData, departmentsData, positionsData, salaryConfigData] = await Promise.all([
      getEmployees(),
      getDepartments(),
      getPositions(),
      getSalaryConfigList(),
    ]);

    const salaryConfigMap = Object.fromEntries(salaryConfigData.map((s) => [s.userId, s]));

    const selectedMonth = moment(month, 'YYYY-MM'); // Chuyển tháng dạng '2024-04' thành đối tượng moment

    const mappedEmployees = employeesData
    .filter((emp) => {
      // Kiểm tra ngày gia nhập
      if (!emp.hireDate) return false;
      const hireDate = moment(emp.hireDate);
      return hireDate.isSameOrBefore(selectedMonth, 'month');
    })
    .map((emp) => {
      const department = departmentsData.find((d) => d.departmentId === emp.departmentId);
      const position = positionsData.find((p) => p.positionId === emp.positionId);
      const salaryConfig = salaryConfigMap[emp.userId];

      return {
        id: emp.userId,
        name: emp.fullName || 'No Name',
        department: department ? department.departmentName : 'Chưa có phòng ban',
        position: position ? position.positionName : 'Chưa có chức vụ',
        basicSalary: typeof salaryConfig?.basicSalary === 'number' ? salaryConfig.basicSalary : 0,
        status: emp.status,
      };
    });

    console.log(mappedEmployees);

    return [mappedEmployees, departmentsData, positionsData];
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    throw error;
  }
};

export const fetchEmpDepPos = async () => {
  try {
    const [employeesData, departmentsData, positionsData] = await Promise.all([
      getEmployees(),
      getDepartments(),
      getPositions(),
    ]);

    // Map employees to required format
    const mappedEmployees = employeesData.map((employee) => {
      const department = departmentsData.find((d) => d.departmentId === employee.departmentId);
      const position = positionsData.find((p) => p.positionId === employee.positionId);

      return {
        userId: employee.userId,
        fullName: employee.fullName || 'No Name',
        departmentName: department ? department.departmentName : 'Chưa có phòng ban',
        positionName: position ? position.positionName : 'Chưa có chức vụ',
        hireDate: employee.hireDate,
        status: employee.status,
      };
    });

    // Trả về
    return { employeesData, departmentsData, positionsData, mappedEmployees };
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    throw error; // Hoặc có thể trả về giá trị mặc định như { employeesData: [], departmentMap: {}, positionMap: {} }
  }
};
