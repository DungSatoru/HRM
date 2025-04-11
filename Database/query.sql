SELECT u.full_name, p.position_name,d.department_name
FROM departments AS d
INNER JOIN users AS u ON d.department_id = u.department_id
INNER JOIN positions AS p ON p.position_id = u.position_id
WHERE p.position_name = 'Trưởng phòng';

--- CC
SELECT 
 d.department_id,
 d.department_name, COUNT(u.user_id) AS total_employees
FROM departments AS d
INNER JOIN users AS u ON d.department_id = u.department_id
GROUP BY d.department_id, d.department_name;

--
SELECT 
    d.department_id,
    d.department_name,
    COUNT(u.user_id) AS total_employees,
    MAX(CASE WHEN p.position_name = 'Trưởng phòng' THEN u.full_name END) AS department_manager
FROM departments AS d
LEFT JOIN users AS u ON d.department_id = u.department_id
LEFT JOIN positions AS p ON p.position_id = u.position_id
GROUP BY d.department_id, d.department_name;


@Query("SELECT new tlu.finalproject.hrmanagement.dto.EmployeeDTO(" +
            "u.userId, u.username, u.identity, u.email, u.phone, u.fullName, " +
            "new tlu.finalproject.hrmanagement.dto.RoleDTO(r.roleId, r.roleName), " +
            "new tlu.finalproject.hrmanagement.dto.DepartmentDTO(d.departmentId, d.departmentName), " +
            "new tlu.finalproject.hrmanagement.dto.PositionDTO(p.positionId, p.positionName), " +
            "u.status, u.hireDate, u.createdAt) " +
            "FROM User u " +
            "LEFT JOIN u.role r " +
            "LEFT JOIN u.department d " +
            "LEFT JOIN u.position p " +
            "WHERE u.userId = :userId")
    EmployeeDTO getEmployeeById(@Param("userId") Long userId);
    
    positions
