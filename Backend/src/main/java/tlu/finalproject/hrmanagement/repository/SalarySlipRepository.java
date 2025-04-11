package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.SalarySlip;

@Repository
public interface SalarySlipRepository extends JpaRepository<SalarySlip, Long> {
}
