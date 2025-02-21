package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
