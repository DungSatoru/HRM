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

