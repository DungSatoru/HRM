import Employees from '~/pages/Employees/Employees';
import NotFoundPage from '~/pages/NotFoundPage/NotFoundPage';
import EmployeeCreate from '~/pages/Employees/EmployeeCreate';
import Departments from '~/pages/Departments/Departments.js';
import EmployeeDetail from '~/pages/Employees/EmployeeDetail';
import EmployeeEdit from '~/pages/Employees/EmployeeEdit';
import Settings from '~/pages/Settings/Settings.js';
import FaceTrainingWrapper from '~/pages/Settings/FaceTraining/FaceTraining.js';
import Dashboard from '~/pages/Dashboard/Dashboard';

// Router ko cần đăng nhập
const publicRoutes = [
  { path: '/', component: Dashboard },
  { path: '/employees', component: Employees },
  { path: '/employees/add', component: EmployeeCreate },
  { path: '/employees/:id', component: EmployeeDetail },
  { path: '/employees/:id/edit', component: EmployeeEdit },

  { path: '/departments', component: Departments },

  { path: '/settings', component: Settings },
  { path: '/face-training', component: FaceTrainingWrapper },

  { path: '*', component: NotFoundPage },
];

// Router cần đăng nhập
const privateRoutes = {};

export { publicRoutes, privateRoutes };
