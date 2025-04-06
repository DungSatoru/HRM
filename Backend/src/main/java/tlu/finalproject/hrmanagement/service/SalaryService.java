package tlu.finalproject.hrmanagement.service;

import java.time.LocalDateTime;

public interface SalaryService {
    String calculateSalary(Long userId, LocalDateTime fromDate, LocalDateTime toDate);
    String generateSalarySlip(Long userId, LocalDateTime salaryDate);
}
