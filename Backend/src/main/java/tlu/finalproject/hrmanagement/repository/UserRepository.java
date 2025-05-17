package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByDepartment_DepartmentId(Long departmentId);
    Optional<User> findByUsername(String username);

    boolean existsByPhone(String phone);
    boolean existsByIdentity(String identity);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    long countByDepartment_DepartmentId(Long id);

    long countByPosition_PositionId(Long id);
}