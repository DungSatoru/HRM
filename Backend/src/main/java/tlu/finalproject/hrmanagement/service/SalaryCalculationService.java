package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.SalarySlipDTO;

import java.time.LocalDate;

public interface SalaryCalculationService {
    String calculateAndSaveSalarySlip(Long userId, LocalDate month);
}
