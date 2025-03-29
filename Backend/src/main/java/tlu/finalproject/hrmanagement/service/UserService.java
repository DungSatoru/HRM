package tlu.finalproject.hrmanagement.service;

import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserDTO getUserById(Long id);

    List<UserDTO> getUsersByDepartmentId(Long id);

    UserDTO createUser(UserDTO userDTO);

    UserDTO updateUser(Long id, UserDTO userDTO);

    void deleteUser(Long id);
}