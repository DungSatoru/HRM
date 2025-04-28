package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.SalaryDeductionDTO;

import java.util.List;

public interface SalaryDeductionService {
    List<SalaryDeductionDTO> getAllByUserId(Long userId);
    SalaryDeductionDTO create(SalaryDeductionDTO dto);
    SalaryDeductionDTO update(Long id, SalaryDeductionDTO dto);
    String delete(Long id);
}