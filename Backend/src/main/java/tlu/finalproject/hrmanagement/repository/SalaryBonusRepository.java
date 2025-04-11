package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.SalaryBonus;

@Repository
public interface SalaryBonusRepository extends JpaRepository<SalaryBonus, Long> {
}
