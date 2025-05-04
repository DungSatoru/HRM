package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.RoleDTO;
import tlu.finalproject.hrmanagement.dto.RoleDTO;

import java.util.List;

public interface RoleService {
    List<RoleDTO> getAllRole();

    RoleDTO getRoleById(Long id);

    RoleDTO createRole(RoleDTO RoleDTO);

    RoleDTO updateRole(Long id, RoleDTO RoleDTO);

    boolean deleteRole(Long id);
}
