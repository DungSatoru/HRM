package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.DepartmentDTO;

import java.util.List;

public interface DepartmentService {
    List<DepartmentDTO> getAllDepartment();

    DepartmentDTO getDepartmentById(Long id);

    DepartmentDTO createDepartment(DepartmentDTO departmentDTO);

    DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO);

    void deleteDepartment(Long id);
}
