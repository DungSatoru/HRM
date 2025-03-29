package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.PositionDTO;

import java.util.List;

public interface PositionService {
    List<PositionDTO> getAllPosition();

    PositionDTO getPositionById(Long id);

    PositionDTO createPosition(PositionDTO positionDTO);

    PositionDTO updatePosition(Long id, PositionDTO positionDTO);

    void deletePosition(Long id);
}
