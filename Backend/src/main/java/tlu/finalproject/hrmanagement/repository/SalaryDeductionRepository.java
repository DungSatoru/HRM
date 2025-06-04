package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.SalaryDeduction;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface SalaryDeductionRepository extends JpaRepository<SalaryDeduction, Long> {
    List<SalaryDeduction> findByUserUserId(Long userId);
    List<SalaryDeduction> findByUserUserIdAndDeductionDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
