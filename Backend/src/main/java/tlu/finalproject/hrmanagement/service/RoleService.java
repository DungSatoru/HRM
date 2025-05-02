package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.PositionDTO;
import tlu.finalproject.hrmanagement.dto.RoleDTO;

import java.util.List;

public interface RoleService {
    List<RoleDTO> getAllRole();

    RoleDTO getRoleById(Long id);

    String createRole(PositionDTO positionDTO);

    String updateRole(Long id, PositionDTO positionDTO);

    String deleteRole(Long id);
}
