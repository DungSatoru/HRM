package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.SalaryDeduction;

@Repository
public interface SalaryDeductionRepository extends JpaRepository<SalaryDeduction, Long> {
}
