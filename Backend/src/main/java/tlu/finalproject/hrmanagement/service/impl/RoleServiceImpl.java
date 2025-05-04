package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.RoleDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.Role;
import tlu.finalproject.hrmanagement.repository.RoleRepository;
import tlu.finalproject.hrmanagement.service.RoleService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<RoleDTO> getAllRole() {
        return roleRepository.findAll()
                .stream()
                .map(role -> modelMapper.map(role, RoleDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public RoleDTO getRoleById(Long id) {
        try {
            Role role = roleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + id));
            return modelMapper.map(role, RoleDTO.class);
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + id);
        }
    }

    @Override
    public RoleDTO createRole(RoleDTO RoleDTO) {
        try {
            Role role = modelMapper.map(RoleDTO, Role.class);
            return modelMapper.map(roleRepository.save(role), RoleDTO.class);
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Tạo vai trò thất bại!");
        }
    }

    @Override
    public RoleDTO updateRole(Long id, RoleDTO RoleDTO) {
        try {
            Role role = roleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + id));
            modelMapper.map(RoleDTO, role);
            return modelMapper.map(roleRepository.save(role), RoleDTO.class);
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Cập nhật vai trò thất bại!");
        }
    }

    @Override
    public boolean deleteRole(Long id) {
        try {
            Role role = roleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + id));
            roleRepository.delete(role);
            return true;
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Xóa vai trò thất bại!");
        }
    }
}
