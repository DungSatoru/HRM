package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tlu.finalproject.hrmanagement.dto.EmployeeDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.*;
import tlu.finalproject.hrmanagement.repository.DepartmentRepository;
import tlu.finalproject.hrmanagement.repository.PositionRepository;
import tlu.finalproject.hrmanagement.repository.RoleRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
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
    private final RoleRepository roleRepository;
    private final PositionRepository positionRepository;
    private final ModelMapper modelMapper;

    private final PasswordEncoder passwordEncoder;

    @Override
    public List<EmployeeDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return convertToDTO(user);
    }

    @Override
    public List<EmployeeDTO> getUsersByDepartmentId(Long id) {  // ✅ Đổi kiểu trả về thành List<UserDTO>
        List<User> users = userRepository.findByDepartment_DepartmentId(id);

        return users.stream()
                .map(user -> modelMapper.map(user, EmployeeDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO createUser(EmployeeDTO employeeDTO) {
        // Chuyển từ EmployeeDTO sang User entity
        User user = modelMapper.map(employeeDTO, User.class);

        // Băm mật khẩu trước khi lưu
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword())); // Băm mật khẩu
        } else {
            // Nếu không có mật khẩu, đặt mặc định
            user.setPassword(passwordEncoder.encode("123"));
        }

        // Set giá trị mặc định cho các trường nếu chưa có giá trị
        user.setStatus(Optional.ofNullable(user.getStatus()).orElse(Status.ACTIVE));
        user.setCreatedAt(Optional.ofNullable(user.getCreatedAt()).orElse(new Date()));

        // Lưu User vào cơ sở dữ liệu
        User savedUser = userRepository.save(user);

        // Chuyển User entity thành UserDTO và trả về
        return convertToDTO(savedUser);
    }

    @Override
    @Transactional
    public EmployeeDTO updateUser(Long id, EmployeeDTO employeeDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Cập nhật từng trường riêng lẻ, bỏ qua khóa ngoại
        if (employeeDTO.getUsername() != null) existingUser.setUsername(employeeDTO.getUsername());
        if (employeeDTO.getEmail() != null) existingUser.setEmail(employeeDTO.getEmail());
        if (employeeDTO.getPhone() != null) existingUser.setPhone(employeeDTO.getPhone());
        if (employeeDTO.getFullName() != null) existingUser.setFullName(employeeDTO.getFullName());
        if (employeeDTO.getIdentity() != null) existingUser.setIdentity(employeeDTO.getIdentity());
        if (employeeDTO.getStatus() != null) existingUser.setStatus(employeeDTO.getStatus());
        if (employeeDTO.getHireDate() != null) existingUser.setHireDate(employeeDTO.getHireDate());

        // Cập nhật Department nếu có
        if (employeeDTO.getDepartment().getDepartmentId() != null) {
            Department department = departmentRepository.findById(employeeDTO.getDepartment().getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with ID: " + employeeDTO.getDepartment().getDepartmentId()));
            existingUser.setDepartment(department);
        }

        // Cập nhật Position nếu có
        if (employeeDTO.getPosition().getPositionId() != null) {
            Position position = positionRepository.findById(employeeDTO.getPosition().getPositionId())
                    .orElseThrow(() -> new RuntimeException("Position not found with ID: " + employeeDTO.getPosition().getPositionId()));
            existingUser.setPosition(position);
        }

        // Cập nhật mật khẩu nếu có (phải mã hóa trước khi lưu)
//        if (userDTO.getPassword() != null) {
//            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
//        }


        existingUser = userRepository.save(existingUser);
        return convertToDTO(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        userRepository.delete(user);
    }

    private EmployeeDTO convertToDTO(User user) {
        EmployeeDTO dto = modelMapper.map(user, EmployeeDTO.class);
        dto.getRole().setRoleName(user.getRole() != null ? user.getRole().getRoleName() : null);
        dto.getDepartment().setDepartmentName(user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null);
        dto.getPosition().setPositionName(user.getPosition() != null ? user.getPosition().getPositionName() : null);
        return dto;
    }

    private User convertToEntity(EmployeeDTO dto) {
        User user = modelMapper.map(dto, User.class);

        // Kiểm tra và xử lý null đối với department
        if (dto.getDepartment() != null && dto.getDepartment().getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartment().getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartment().getDepartmentId()));
            user.setDepartment(department);
        }

        // Kiểm tra và xử lý null đối với position
        if (dto.getPosition().getPositionId() != null) {
            Position position = positionRepository.findById(dto.getPosition().getPositionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Position not found with ID: " + dto.getPosition().getPositionId()));
            user.setPosition(position);
        }

        return user;
    }
}
