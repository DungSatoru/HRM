package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.dto.OvertimeRecordDTO;
import tlu.finalproject.hrmanagement.model.Attendance;
import tlu.finalproject.hrmanagement.model.OvertimeRecord;
import tlu.finalproject.hrmanagement.projection.OvertimeRecordProjection;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OvertimeRecordRepository extends JpaRepository<OvertimeRecord, Long> {


    @Query(value = """
                SELECT 
                    o.overtime_id AS overtimeId,
                    a.user_id AS userId,
                    o.start_time AS overtimeStart,
                    o.end_time AS overtimeEnd,
                    o.day_hours AS dayHours,
                    o.night_hours AS nightHours,
                    a.date AS overtimeDate,
                    CONCAT(EXTRACT(YEAR FROM a.date), '-', LPAD(EXTRACT(MONTH FROM a.date), 2, '0')) AS month
                FROM overtime_records o
                JOIN attendances a ON o.attendance_id = a.attendance_id
                WHERE a.user_id = :userId
                AND YEAR(a.date) = :year AND MONTH(a.date) = :month
                ORDER BY a.date
            """, nativeQuery = true)
    List<OvertimeRecordProjection> findByUserIdAndMonth(@Param("userId") Long userId, @Param("year") int year, @Param("month") int month);

//    Optional<OvertimeRecord> findByUser_UserIdAndOvertimeDate(Long userId, LocalDate date);
//
//    List<OvertimeRecord> findByUser_UserIdAndOvertimeDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
//    @Query(value = "SELECT user_id, SUM(overtime_hour) FROM overtime_records " +
//            "WHERE user_id = :userId GROUP BY user_id", nativeQuery = true)
//    Object[] getTotalOvertimeByUserIdNative(@Param("userId") Long userId);

    void deleteByAttendance(Attendance attendance);

    Optional<OvertimeRecord> findByAttendance(Attendance attendance);
}
