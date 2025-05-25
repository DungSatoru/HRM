package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.SalarySlip;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalarySlipRepository extends JpaRepository<SalarySlip, Long> {
    List<SalarySlip> findBySalaryPeriod(String monthStr);

    Optional<SalarySlip> findByUser_UserIdAndSalaryPeriod(Long userId, String monthStr);

    Optional<SalarySlip> findByUserUserIdAndSalaryPeriod(Long userId, String month);

}
