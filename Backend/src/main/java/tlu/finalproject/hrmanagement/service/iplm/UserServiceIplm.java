package tlu.finalproject.hrmanagement.service.iplm;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tlu.finalproject.hrmanagement.dto.UserDTO;
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
public class UserServiceIplm implements UserService {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final PositionRepository positionRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return convertToDTO(user);
    }

    @Override
    public List<UserDTO> getUsersByDepartmentId(Long id) {  // ✅ Đổi kiểu trả về thành List<UserDTO>
        List<User> users = userRepository.findByDepartment_DepartmentId(id);

        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }


    @Override
    public UserDTO createUser(UserDTO userDTO) {
        // Chuyển từ UserDTO sang User entity
        User user = modelMapper.map(userDTO, User.class);
        user.setPassword(Optional.ofNullable(user.getPassword()).orElse("123"));
        user.setStatus(Optional.ofNullable(user.getStatus()).orElse(Status.ACTIVE));
        user.setCreatedAt(Optional.ofNullable(user.getCreatedAt()).orElse(new Date()));


        // Lưu User vào cơ sở dữ liệu
        User savedUser = userRepository.save(user);

        // Chuyển User entity thành UserDTO và trả về
        return convertToDTO(savedUser);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Cập nhật từng trường riêng lẻ, bỏ qua khóa ngoại
        if (userDTO.getUsername() != null) existingUser.setUsername(userDTO.getUsername());
        if (userDTO.getEmail() != null) existingUser.setEmail(userDTO.getEmail());
        if (userDTO.getPhone() != null) existingUser.setPhone(userDTO.getPhone());
        if (userDTO.getFullName() != null) existingUser.setFullName(userDTO.getFullName());
        if (userDTO.getIdentity() != null) existingUser.setIdentity(userDTO.getIdentity());
        if (userDTO.getStatus() != null) existingUser.setStatus(userDTO.getStatus());
        if (userDTO.getHireDate() != null) existingUser.setHireDate(userDTO.getHireDate());

        // Cập nhật Department nếu có
        if (userDTO.getDepartment().getDepartmentId() != null) {
            Department department = departmentRepository.findById(userDTO.getDepartment().getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with ID: " + userDTO.getDepartment().getDepartmentId()));
            existingUser.setDepartment(department);
        }

        // Cập nhật Position nếu có
        if (userDTO.getPosition().getPositionId() != null) {
            Position position = positionRepository.findById(userDTO.getPosition().getPositionId())
                    .orElseThrow(() -> new RuntimeException("Position not found with ID: " + userDTO.getPosition().getPositionId()));
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

    private UserDTO convertToDTO(User user) {
        UserDTO dto = modelMapper.map(user, UserDTO.class);
        dto.getRole().setRoleName(user.getRole() != null ? user.getRole().getRoleName() : null);
        dto.getDepartment().setDepartmentName(user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null);
        dto.getPosition().setPositionName(user.getPosition() != null ? user.getPosition().getPositionName() : null);
        return dto;
    }

    private User convertToEntity(UserDTO dto) {
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
