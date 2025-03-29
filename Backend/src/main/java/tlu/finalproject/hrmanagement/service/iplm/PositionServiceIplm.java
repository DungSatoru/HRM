package tlu.finalproject.hrmanagement.service.iplm;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.dto.PositionDTO;
import tlu.finalproject.hrmanagement.model.Department;
import tlu.finalproject.hrmanagement.model.Position;
import tlu.finalproject.hrmanagement.repository.PositionRepository;
import tlu.finalproject.hrmanagement.service.PositionService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionServiceIplm implements PositionService {
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
    public PositionDTO createPosition(PositionDTO positionDTO) {
        // Chuyển đổi DTO sang Entity
        Position position = modelMapper.map(positionDTO, Position.class);

        // Lưu Department vào cơ sở dữ liệu
        Position savedPosition = positionRepository.save(position);

        // Chuyển đổi Entity đã lưu thành DTO và trả về
        return modelMapper.map(position, PositionDTO.class);
    }

    @Override
    public PositionDTO updatePosition(Long id, PositionDTO positionDTO) {
        return null;
    }

    @Override
    public void deletePosition(Long id) {

    }
}
