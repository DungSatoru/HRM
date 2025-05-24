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
import SalaryManagement from '~/pages/Salary/SalaryManagement';
import Salary from '~/pages/Salary/Salary';
import SalaryReport from '~/pages/Reports/salaryReport';
import SalarySlipPage from '~/pages/Salary/SalarySlipPage';
import AttendanceByUser from '~/pages/Attendances/AttendanceByUser';
import UserPermission from '~/pages/Settings/UserPermission/UserPermission';

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
  { path: '/attendances/user/:id', component: AttendanceByUser },
  { path: '/attendance-history', component: UserAttendanceHistory },

  { path: '/Salary', component: Salary },
  { path: '/manage-Salary', component: SalaryManagement },
  { path: '/salary/employee/:id', component: SalarySlipPage },

  { path: '/salary-reports', component: SalaryReport },

  { path: '/settings', component: Settings },
  { path: '/settings/face-training', component: FaceTrainingWrapper },
  { path: '/settings/user-permissions', component: UserPermission },

];

export { publicRoutes, privateRoutes };
