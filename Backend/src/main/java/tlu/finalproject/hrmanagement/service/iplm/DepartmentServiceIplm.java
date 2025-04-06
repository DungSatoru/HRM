package tlu.finalproject.hrmanagement.service.iplm;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.dto.EmployeeByDepartmentDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.Department;
import tlu.finalproject.hrmanagement.repository.DepartmentRepository;
import tlu.finalproject.hrmanagement.service.DepartmentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceIplm implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<DepartmentDTO> getAllDepartment() {
        return departmentRepository.getDepartmentList();
//        return departmentRepository.findAll()
//                .stream()
//                .map(department -> modelMapper.map(department, DepartmentDTO.class))
//                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeByDepartmentDTO> getDepartmentById(Long departmentId) {
        return departmentRepository.getEmployeesByDepartmentId(departmentId);
    }

    @Override
    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        // Chuyển đổi DTO sang Entity
        Department department = modelMapper.map(departmentDTO, Department.class);

        Department savedDepartment = departmentRepository.save(department);

        return modelMapper.map(savedDepartment, DepartmentDTO.class);
    }


    @Override
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        department.setDepartmentName(departmentDTO.getDepartmentName());
        Department updatedDepartment = departmentRepository.save(department);
        return modelMapper.map(updatedDepartment, DepartmentDTO.class);
    }

    @Override
    public void deleteDepartment(Long id) {
//        // Kiểm tra có nhân viên trong phòng ban không
//        long userCount = userRepository.countByDepartment_DepartmentId(departmentId);
//        if (userCount > 0) {
//            throw new IllegalStateException("Không thể xóa phòng ban vì vẫn còn nhân viên thuộc về nó.");
//        }

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        departmentRepository.deleteById(id);
    }
}
