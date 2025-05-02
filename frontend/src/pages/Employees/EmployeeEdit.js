import React from 'react';
import { useParams } from 'react-router-dom';
import EmployeeForm from '~/components/EmployeeForm/EmployeeForm';

const EmployeeEdit = () => {
  const { id } = useParams(); // id từ path: '/employees/:id/edit'
  return <EmployeeForm isEdit={true} employeeId={id} />;
};

export default EmployeeEdit;
