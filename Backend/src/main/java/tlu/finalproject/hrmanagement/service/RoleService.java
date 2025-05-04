package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.RoleDTO;
import tlu.finalproject.hrmanagement.dto.RoleDTO;

import java.util.List;

public interface RoleService {
    List<RoleDTO> getAllRole();

    RoleDTO getRoleById(Long id);

    String createRole(RoleDTO RoleDTO);

    String updateRole(Long id, RoleDTO RoleDTO);

    String deleteRole(Long id);
}
