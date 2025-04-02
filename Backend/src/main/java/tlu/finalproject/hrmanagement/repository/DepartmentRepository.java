package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.dto.DepartmentDTO;
import tlu.finalproject.hrmanagement.model.Department;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    @Query("""
                SELECT new tlu.finalproject.hrmanagement.dto.DepartmentDTO(
                    d.departmentId, d.departmentName, 
                    COUNT(u.userId), 
                    CAST(MAX(CASE WHEN p.positionName = 'Trưởng phòng' THEN u.fullName ELSE 'Chưa có' END) AS string)
                ) 
                FROM Department d
                LEFT JOIN d.users u
                LEFT JOIN u.position p
                GROUP BY d.departmentId, d.departmentName
            """)
    List<DepartmentDTO> getDepartmentList();

}
