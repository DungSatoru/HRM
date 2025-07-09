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

import java.time.LocalTime;
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
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<EmployeeDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, EmployeeDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO  getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên không tồn tại"));
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
    public EmployeeDTO createUser(EmployeeDTO employeeDTO) {
        User user = modelMapper.map(employeeDTO, User.class);
        if (userRepository.existsByIdentity(employeeDTO.getIdentity().trim())) {
            throw new ConflictException("CCCD đã tồn tại.");
        }
        if (userRepository.existsByPhone(employeeDTO.getPhone().trim())) {
            throw new ConflictException("Số điện thoại đã tồn tại.");
        }

        if (userRepository.existsByEmail(employeeDTO.getEmail().trim())) {
            throw new ConflictException("Email đã tồn tại.");
        }

        if (userRepository.existsByUsername(employeeDTO.getUsername().trim())) {
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

        user.setStatus(Optional.ofNullable(user.getStatus()).orElse(EmploymentStatus.ACTIVE));
        user.setCreatedAt(Optional.ofNullable(user.getCreatedAt()).orElse(new Date()));

        User savedUser = userRepository.save(user);

        SalaryConfigurationDTO salaryConfigurationDTO = SalaryConfigurationDTO.builder()
                .userId(savedUser.getUserId())
                .basicSalary(0.0)
                .standardWorkingDays(22)
                .dayOvertimeRate(1.5)
                .nightOvertimeRate(1.5)
                .holidayOvertimeRate(3.0)
                .otherAllowances(0.0)
                .workStartTime(LocalTime.of(8,0))
                .workEndTime(LocalTime.of(17,0))
                .breakDurationMinutes(60)
                .build();

        salaryConfigurationService.createSalaryConfiguration(salaryConfigurationDTO);

        return modelMapper.map(savedUser, EmployeeDTO.class);
    }

    @Override
    @Transactional
    public EmployeeDTO updateUser(Long id, EmployeeDTO employeeDTO) {
        // Lấy user hiện tại
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên không tồn tại"));

        // Ánh xạ các trường từ EmployeeDTO vào User thủ công
        existingUser.setUsername(employeeDTO.getUsername());
        existingUser.setFullName(employeeDTO.getFullName());
        existingUser.setIdentity(employeeDTO.getIdentity());
        existingUser.setEmail(employeeDTO.getEmail());
        existingUser.setPhone(employeeDTO.getPhone());

        if (employeeDTO.getRoleId() != null) {
            Role role = roleRepository.findById(employeeDTO.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + employeeDTO.getRoleId()));
            existingUser.setRole(role);
        }

        if (employeeDTO.getDepartmentId() != null) {
            Department department = departmentRepository.findById(employeeDTO.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng ban với ID: " + employeeDTO.getDepartmentId()));
            existingUser.setDepartment(department);
        }

        if (employeeDTO.getPositionId() != null) {
            Position position = positionRepository.findById(employeeDTO.getPositionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chức vụ với ID: " + employeeDTO.getPositionId()));
            existingUser.setPosition(position);
        }

        // Ánh xạ các trường khác
        existingUser.setStatus(employeeDTO.getStatus());
        existingUser.setHireDate(employeeDTO.getHireDate());
        existingUser.setGender(employeeDTO.getGender());
        existingUser.setDateOfBirth(employeeDTO.getDateOfBirth());
        existingUser.setAddress(employeeDTO.getAddress());
        existingUser.setProfileImageUrl(employeeDTO.getProfileImageUrl());
        existingUser.setEmergencyContactName(employeeDTO.getEmergencyContactName());
        existingUser.setEmergencyContactPhone(employeeDTO.getEmergencyContactPhone());
        existingUser.setContractType(employeeDTO.getContractType());
        existingUser.setEducationLevel(employeeDTO.getEducationLevel());

        // Cập nhật đối tượng User
        User saved = userRepository.save(existingUser);

        // Trả về DTO
        return modelMapper.map(saved, EmployeeDTO.class);
    }

    @Override
    public boolean assignRole(Long userId, Long roleId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Role> roleOpt = roleRepository.findById(roleId);

        if (userOpt.isPresent() && roleOpt.isPresent()) {
            User user = userOpt.get();
            Role role = roleOpt.get();
            user.setRole(role);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
