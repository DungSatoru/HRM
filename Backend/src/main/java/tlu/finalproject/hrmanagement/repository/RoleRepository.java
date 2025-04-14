package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tlu.finalproject.hrmanagement.model.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String roleName);
}
