package tlu.finalproject.hrmanagement.service.iplm;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.model.Department;
import tlu.finalproject.hrmanagement.repository.DepartmentRepository;
import tlu.finalproject.hrmanagement.service.DepartmentService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceIplm implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<DepartmentDTO> getAllDepartment() {
        return departmentRepository.findAll()
                .stream()
                .map(department -> modelMapper.map(department, DepartmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDTO getDepartmentById(Long id) {
        return null;
    }

    @Override
    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        // Chuyển đổi DTO sang Entity
        Department department = modelMapper.map(departmentDTO, Department.class);

        // Lưu Department vào cơ sở dữ liệu
        Department savedDepartment = departmentRepository.save(department);

        // Chuyển đổi Entity đã lưu thành DTO và trả về
        return modelMapper.map(savedDepartment, DepartmentDTO.class);
    }


    @Override
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO) {
        return null;
    }

    @Override
    public void deleteDepartment(Long id) {

    }
}
