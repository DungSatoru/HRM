package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.exception.BadRequestException;  // Import thêm
import tlu.finalproject.hrmanagement.model.Department;
import tlu.finalproject.hrmanagement.repository.DepartmentRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;  // Nếu bạn kiểm tra số lượng nhân viên
import tlu.finalproject.hrmanagement.service.DepartmentService;

import java.util.List;
import java.util.Optional;

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
    public String createDepartment(DepartmentDTO departmentDTO) {
        try {
            // Chuyển đổi DTO sang Entity
            Department department = modelMapper.map(departmentDTO, Department.class);
            departmentRepository.save(department);
            return "Thêm phòng ban thành công";
        } catch (Exception e) {
            throw new BadRequestException("Không thể tạo phòng ban");
        }
    }

    @Override
    public String updateDepartment(Long id, DepartmentDTO departmentDTO) {
        try {
            Department department = departmentRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng ban với ID: " + id));
            department.setDepartmentName(departmentDTO.getDepartmentName());
            departmentRepository.save(department);
            return "Cập nhật phòng ban thành công!";
        } catch (ResourceNotFoundException e) {
            throw e;  // Ném lại lỗi nếu phòng ban không tồn tại
        } catch (Exception e) {
            throw new BadRequestException("Không thể cập nhật phòng ban");
        }
    }

    @Override
    public String deleteDepartment(Long id) {
        try {
            // Kiểm tra có nhân viên trong phòng ban không
            long userCount = userRepository.countByDepartment_DepartmentId(id);
            if (userCount > 0) {
                throw new IllegalStateException("Không thể xóa phòng ban vì vẫn còn nhân viên thuộc về nó.");
            }
            departmentRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng ban với ID: " + id));
            departmentRepository.deleteById(id);
            return "Xóa phòng ban thành công!";
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());  // Bắt lỗi khi không thể xóa phòng ban
        } catch (ResourceNotFoundException e) {
            throw e;  // Ném lại lỗi nếu phòng ban không tồn tại
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa phòng ban", e);
        }
    }
}
