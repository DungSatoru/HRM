package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.EmployeeDTO;

import java.util.List;

public interface UserService {
    List<EmployeeDTO> getAllUsers();

    EmployeeDTO getUserById(Long id);

    List<EmployeeDTO> getUsersByDepartmentId(Long id);

    EmployeeDTO createUser(EmployeeDTO employeeDTO);

    EmployeeDTO updateUser(Long id, EmployeeDTO employeeDTO);
}