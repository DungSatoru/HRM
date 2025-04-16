package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.dto.EmployeeByDepartmentDTO;

import java.util.List;

public interface DepartmentService {
    List<DepartmentDTO> getAllDepartment();

    List<EmployeeByDepartmentDTO> getDepartmentById(Long id);

    String createDepartment(DepartmentDTO departmentDTO);

    String updateDepartment(Long id, DepartmentDTO departmentDTO);

    String deleteDepartment(Long id);
}
