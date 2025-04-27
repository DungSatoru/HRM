package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.SalaryBonusDTO;

import java.util.List;

public interface SalaryBonusService {
    List<SalaryBonusDTO> getAllByUserId(Long userId);
    SalaryBonusDTO create(SalaryBonusDTO dto);
    SalaryBonusDTO update(Long id, SalaryBonusDTO dto);
    String delete(Long id);
}
