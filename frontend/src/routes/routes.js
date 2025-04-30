import Employees from '~/pages/Employees/Employees';
import NotFoundPage from '~/pages/NotFoundPage/NotFoundPage';
import EmployeeCreate from '~/pages/Employees/EmployeeCreate';
import Departments from '~/pages/Departments/Departments.js';
import EmployeeDetail from '~/pages/Employees/EmployeeDetail';
import EmployeeEdit from '~/pages/Employees/EmployeeEdit';
import Settings from '~/pages/Settings/Settings.js';
import FaceTrainingWrapper from '~/pages/Settings/FaceTraining/FaceTraining.js';
import Dashboard from '~/pages/Dashboard/Dashboard';
import Role from '~/pages/Positions/Position';
import Attendance from '~/pages/Attendances/Attendance';
import UserAttendanceHistory from '~/pages/Attendances/UserAttendanceHistory';
import Login from '~/pages/Login/Login';
import PayrollManagement from '~/pages/Payroll/PayrollManagement';
import Payroll from '~/pages/Payroll/Payroll';
import SalaryReport from '~/pages/Reports/salaryReport';

// ✅ Các route không cần đăng nhập
const publicRoutes = [
  { path: '/login', component: Login },
  { path: '*', component: NotFoundPage }, // fallback 404
];

// ✅ Các route cần đăng nhập
const privateRoutes = [
  { path: '/', component: Dashboard },
  { path: '/dashboard', component: Dashboard },
  { path: '/employees', component: Employees },
  { path: '/employees/add', component: EmployeeCreate },
  { path: '/employees/:id', component: EmployeeDetail },
  { path: '/employees/:id/edit', component: EmployeeEdit },

  { path: '/departments', component: Departments },
  { path: '/roles', component: Role },

  { path: '/attendances', component: Attendance },
  { path: '/attendance-history', component: UserAttendanceHistory },

  { path: '/payroll', component: Payroll },
  { path: '/manage-payroll', component: PayrollManagement },

  { path: '/salary-reports', component: SalaryReport },

  

  { path: '/settings', component: Settings },
  { path: '/face-training', component: FaceTrainingWrapper },
];

export { publicRoutes, privateRoutes };
