package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.Position;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    boolean existsByPositionNameIgnoreCase(String positionName);
}
