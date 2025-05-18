package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.exception.BadRequestException;
import tlu.finalproject.hrmanagement.exception.ConflictException;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.Department;
import tlu.finalproject.hrmanagement.repository.DepartmentRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.DepartmentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;  // Để kiểm tra số lượng nhân viên trong phòng ban

    @Override
    public List<DepartmentDTO> getAllDepartment() {
        try {
            return departmentRepository.getDepartmentList();
        } catch (Exception e) {
            throw new RuntimeException("Không thể lấy danh sách phòng ban", e);
        }
    }

    @Override
    public DepartmentDTO getDepartmentById(Long departmentId) {
        try {
            Department department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng ban với ID: " + departmentId));
            DepartmentDTO dto = DepartmentDTO.builder()
                    .departmentId(department.getDepartmentId())
                    .departmentName(department.getDepartmentName())
                    .build();
            return dto;
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Không tìm thấy phòng ban với ID: " + departmentId);
        }
    }

    @Override
    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        if (departmentRepository.existsByDepartmentNameIgnoreCase(departmentDTO.getDepartmentName().trim())) {
            throw new ConflictException("Phòng ban đã tồn tại.");
        }

        // Chuyển đổi DTO sang Entity
        Department department = modelMapper.map(departmentDTO, Department.class);
        return modelMapper.map(departmentRepository.save(department), DepartmentDTO.class);
    }

    @Override
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng ban với ID: " + id));

        if (departmentRepository.existsByDepartmentNameIgnoreCase(departmentDTO.getDepartmentName().trim())) {
            throw new ConflictException("Phòng ban đã tồn tại.");
        }

        department.setDepartmentName(departmentDTO.getDepartmentName());
        return modelMapper.map(departmentRepository.save(department), DepartmentDTO.class);
    }

    @Override
    public boolean deleteDepartment(Long id) {
        try {
            // Kiểm tra có nhân viên trong phòng ban không
            long userCount = userRepository.countByDepartment_DepartmentId(id);
            if (userCount > 0) {
                throw new ConflictException("Phòng ban đã có nhân viên nên không thể xóa");
            }

            // Kiểm tra xem phòng ban có tồn tại không
            departmentRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Phng ban không tồn tại"));

            // Xóa phòng ban
            departmentRepository.deleteById(id);
            return true;

        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (ResourceNotFoundException e) {
            throw e;  // Ném lại lỗi nếu phòng ban không tồn tại
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa phòng ban", e);
        }
    }

}
