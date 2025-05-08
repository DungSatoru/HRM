package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.LateDeductionDTO;
import tlu.finalproject.hrmanagement.dto.SalaryDeductionDTO;

import java.time.LocalDate;
import java.util.List;

public interface SalaryDeductionService {
    List<SalaryDeductionDTO> getAllByUserId(Long userId);
    SalaryDeductionDTO create(SalaryDeductionDTO dto);
    SalaryDeductionDTO update(Long id, SalaryDeductionDTO dto);
    boolean delete(Long id);
    List<LateDeductionDTO> getLateDeductions(LocalDate start, LocalDate end);
}