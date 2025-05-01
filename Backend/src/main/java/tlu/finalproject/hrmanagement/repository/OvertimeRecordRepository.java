package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.OvertimeRecord;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OvertimeRecordRepository extends JpaRepository<OvertimeRecord, Long> {

//    List<OvertimeRecord> findByUser_UserIdAndMonth(Long userId, String monthYearString);

    @Query(value = """
    SELECT 
        YEAR(overtime_date) AS year,
        MONTH(overtime_date) AS month,
        SUM(overtime_hour) AS total_overtime
    FROM 
        overtime_records
    WHERE 
        user_id = :userId
        AND DATE_FORMAT(overtime_date, '%Y-%m') = :monthYearString
    GROUP BY 
        YEAR(overtime_date), MONTH(overtime_date)
    ORDER BY 
        year, month
    """, nativeQuery = true)
    List<OvertimeRecord> findByUser_UserIdAndMonth(@Param("userId") Long userId, @Param("monthYearString") String monthYearString);


    void deleteByUser_UserIdAndOvertimeDate(Long userId, LocalDate date);
}
