package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.dto.OvertimeRecordDTO;
import tlu.finalproject.hrmanagement.model.OvertimeRecord;
import tlu.finalproject.hrmanagement.projection.OvertimeRecordProjection;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OvertimeRecordRepository extends JpaRepository<OvertimeRecord, Long> {

//   List<OvertimeRecord> findByUser_UserIdAndMonth(Long userId, String monthYearString);

    @Query(value = """
                SELECT 
                    o.overtime_id AS overtimeId, 
                    o.user_id AS userId, 
                    o.overtime_start AS overtimeStart, 
                    o.overtime_end AS overtimeEnd, 
                    o.overtime_hour AS overtimeHour, 
                    o.overtime_pay AS overtimePay, 
                    o.overtime_date AS overtimeDate, 
                    CONCAT(EXTRACT(YEAR FROM o.overtime_date), '-', LPAD(EXTRACT(MONTH FROM o.overtime_date), 2, '0')) AS month
                FROM overtime_records o
                WHERE o.user_id = :userId
                AND CONCAT(EXTRACT(YEAR FROM o.overtime_date), '-', LPAD(EXTRACT(MONTH FROM o.overtime_date), 2, '0')) = :monthYear
                ORDER BY o.overtime_date
            """, nativeQuery = true)
    List<OvertimeRecordProjection> findByUserIdAndMonth(@Param("userId") Long userId, @Param("monthYear") String monthYear);

    void deleteByUser_UserIdAndOvertimeDate(Long userId, LocalDate date);

    Optional<OvertimeRecord> findByUser_UserIdAndOvertimeDate(Long userId, LocalDate date);
}
