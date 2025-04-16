package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.PositionDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.Position;
import tlu.finalproject.hrmanagement.repository.PositionRepository;
import tlu.finalproject.hrmanagement.service.PositionService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {
    private final PositionRepository positionRepository;
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
        return null;
    }

    @Override
    public String createPosition(PositionDTO positionDTO) {
        Position position = modelMapper.map(positionDTO, Position.class);
        positionRepository.save(position);
        return "Tạo mới vị trí " + position.getPositionName() + " thành công!";
    }

    @Override
    public String updatePosition(Long id, PositionDTO positionDTO) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vị trí với ID: " + id));
        position.setPositionName(positionDTO.getPositionName());
        positionRepository.save(position);
        return "Cập nhật vị trí " + position.getPositionName() + " thành công!";
    }

    @Override
    public String deletePosition(Long id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vị trí với ID: " + id));
        positionRepository.deleteById(id);
        return "Đã xóa vị trí thành công";
    }
}
