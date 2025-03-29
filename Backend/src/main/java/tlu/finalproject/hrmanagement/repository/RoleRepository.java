package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tlu.finalproject.hrmanagement.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
