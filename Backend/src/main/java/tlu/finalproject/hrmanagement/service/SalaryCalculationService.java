package tlu.finalproject.hrmanagement.service;

import java.time.LocalDate;

public interface SalaryCalculationService {
    void calculateAndSaveSalarySlip(Long userId, LocalDate month);
}
