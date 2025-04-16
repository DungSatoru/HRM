package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.PositionDTO;

import java.util.List;

public interface PositionService {
    List<PositionDTO> getAllPosition();

    PositionDTO getPositionById(Long id);

    String createPosition(PositionDTO positionDTO);

    String updatePosition(Long id, PositionDTO positionDTO);

    String deletePosition(Long id);
}
