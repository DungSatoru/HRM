package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.dto.PositionDTO;
import tlu.finalproject.hrmanagement.exception.ConflictException;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.Department;
import tlu.finalproject.hrmanagement.model.Position;
import tlu.finalproject.hrmanagement.repository.PositionRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.PositionService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {
    private final PositionRepository positionRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<PositionDTO> getAllPosition() {
        return positionRepository.findAll()
                .stream()
                .map(position -> modelMapper.map(position, PositionDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public PositionDTO getPositionById(Long id) {
        try {
            Position position = positionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vị trí với ID: " + id));
            return modelMapper.map(position, PositionDTO.class);
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Không tìm thấy vị trí với ID: " + id);
        }
    }

    @Override
    public PositionDTO createPosition(PositionDTO positionDTO) {
        if (positionRepository.existsByPositionNameIgnoreCase(positionDTO.getPositionName())) {
            throw new ConflictException("Chức vụ đã tồn tại");
        }
        Position position = modelMapper.map(positionDTO, Position.class);
        positionRepository.save(position);
        return modelMapper.map(positionRepository.save(position), PositionDTO.class);
    }

    @Override
    public PositionDTO updatePosition(Long id, PositionDTO positionDTO) {
        if (positionRepository.existsByPositionNameIgnoreCase(positionDTO.getPositionName())) {
            throw new ConflictException("Chức vụ đã tồn tại");
        }
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vị trí với ID: " + id));
        position.setPositionName(positionDTO.getPositionName());
        positionRepository.save(position);
        return modelMapper.map(positionRepository.save(position), PositionDTO.class);
    }

    @Override
    public boolean deletePosition(Long id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vị trí với ID: " + id));
        // Kiểm tra có nhân viên trong phòng ban không
        long userCount = userRepository.countByPosition_PositionId(id);
        if (userCount > 0) {
            throw new ConflictException("Chức vụ đã có nhân viên nên không thể xóa");
        }
        positionRepository.deleteById(id);
        return true;
    }
}
