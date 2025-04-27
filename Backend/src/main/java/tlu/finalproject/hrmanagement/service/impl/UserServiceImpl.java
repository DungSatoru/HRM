package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tlu.finalproject.hrmanagement.dto.EmployeeDTO;
import tlu.finalproject.hrmanagement.dto.SalaryConfigurationDTO;
import tlu.finalproject.hrmanagement.exception.BadRequestException;
import tlu.finalproject.hrmanagement.exception.ConflictException;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.*;
import tlu.finalproject.hrmanagement.repository.*;
import tlu.finalproject.hrmanagement.service.SalaryConfigurationService;
import tlu.finalproject.hrmanagement.service.UserService;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final ModelMapper modelMapper;
    private final SalaryConfigurationService salaryConfigurationService;
    private final SalaryConfigurationRepository salaryConfigurationRepository;
    private final OvertimeRecordRepository overtimeRecordRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<EmployeeDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, EmployeeDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return modelMapper.map(user, EmployeeDTO.class);
    }

    @Override
    public List<EmployeeDTO> getUsersByDepartmentId(Long id) {
        List<User> users = userRepository.findByDepartment_DepartmentId(id);

        return users.stream()
                .map(user -> modelMapper.map(user, EmployeeDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public String createUser(EmployeeDTO employeeDTO) {
        User user = modelMapper.map(employeeDTO, User.class);

        if (userRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new ConflictException("Email đã tồn tại trong hệ thống.");
        }

        if (userRepository.existsByUsername(employeeDTO.getUsername())) {
            throw new ConflictException("Tên đăng nhập đã tồn tại.");
        }

        if (employeeDTO.getEmail() == null || employeeDTO.getUsername() == null || employeeDTO.getFullName() == null) {
            throw new BadRequestException("Email, tên đăng nhập và họ tên không được để trống.");
        }

        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(passwordEncoder.encode("123"));
        }

        user.setStatus(Optional.ofNullable(user.getStatus()).orElse(Status.ACTIVE));
        user.setCreatedAt(Optional.ofNullable(user.getCreatedAt()).orElse(new Date()));

        User usersaved = userRepository.save(user);

        // Sử dụng Builder Lombok để tạo mới cấu hình lương
        SalaryConfigurationDTO salaryConfigurationDTO = SalaryConfigurationDTO.builder()
                .userId(usersaved.getUserId())
                .basicSalary(0.0)
                .bonusRate(0.0)
                .overtimeRate(0.0)
                .otherAllowances(0.0)
                .build();

        // Gọi service để tạo cấu hình lương
        salaryConfigurationService.createSalaryConfiguration(salaryConfigurationDTO);

        return "Thêm nhân viên thành công";
    }


    @Override
    @Transactional
    public String updateUser(Long id, EmployeeDTO employeeDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

        if (employeeDTO.getUsername() != null) existingUser.setUsername(employeeDTO.getUsername());
        if (employeeDTO.getEmail() != null) existingUser.setEmail(employeeDTO.getEmail());
        if (employeeDTO.getPhone() != null) existingUser.setPhone(employeeDTO.getPhone());
        if (employeeDTO.getFullName() != null) existingUser.setFullName(employeeDTO.getFullName());
        if (employeeDTO.getIdentity() != null) existingUser.setIdentity(employeeDTO.getIdentity());
        if (employeeDTO.getStatus() != null) existingUser.setStatus(employeeDTO.getStatus());
        if (employeeDTO.getHireDate() != null) existingUser.setHireDate(employeeDTO.getHireDate());

        if (employeeDTO.getDepartmentId() != null) {
            Long deptId = employeeDTO.getDepartmentId();
            if (deptId != null) {
                Department department = departmentRepository.findById(deptId)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng ban với ID: " + deptId));
                existingUser.setDepartment(department);
            } else {
                throw new BadRequestException("Dữ liệu phòng ban không hợp lệ.");
            }
        }

        if (employeeDTO.getPositionId() != null) {
            Long posId = employeeDTO.getPositionId();
            if (posId != null) {
                Position position = positionRepository.findById(posId)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chức vụ với ID: " + posId));
                existingUser.setPosition(position);
            } else {
                throw new BadRequestException("Dữ liệu chức vụ không hợp lệ.");
            }
        }

        existingUser = userRepository.save(existingUser);
        return "Cập nhật nhân viên thnh công";
    }


    @Override
    public String deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
        userRepository.delete(user);
        return "Xóa nhân viên thành công";
    }
}
