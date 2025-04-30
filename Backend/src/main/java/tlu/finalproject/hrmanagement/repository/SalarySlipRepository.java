package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.SalarySlip;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalarySlipRepository extends JpaRepository<SalarySlip, Long> {
    List<SalarySlip> findByMonth(String monthStr);

    Optional<SalarySlip> findByUser_UserIdAndMonth(Long userId, String monthStr);
}
