import { getDepartments } from '~/services/departmentService';
import { getEmployees } from '~/services/employeeService';
import { getPositions } from '~/services/positionService';
import { getSalaryConfigList } from '~/services/salaryConfigService';

export const fetchAllDataForPayroll = async () => {
  try {
    const [employeesData, departmentsData, positionsData, salaryConfigData] = await Promise.all([
      getEmployees(),
      getDepartments(),
      getPositions(),
      getSalaryConfigList(),
    ]);

    const salaryConfigMap = Object.fromEntries(salaryConfigData.map((s) => [s.userId, s]));

    const mappedEmployees = employeesData.map((emp) => {
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
