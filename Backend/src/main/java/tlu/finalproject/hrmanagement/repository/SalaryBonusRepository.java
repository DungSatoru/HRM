package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.SalaryBonus;

import java.util.List;

@Repository
public interface SalaryBonusRepository extends JpaRepository<SalaryBonus, Long> {
    List<SalaryBonus> findByUserUserId(Long userId);
}
