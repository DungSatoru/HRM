package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.dto.AttendanceDTO;
import tlu.finalproject.hrmanagement.model.Attendance;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @Query("SELECT a FROM Attendance a WHERE a.user.userId = :userId AND a.date = :date ORDER BY a.checkIn DESC")
    List<Attendance> findAttendancesByUserAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

        @Query("""
                SELECT new tlu.finalproject.hrmanagement.dto.AttendanceDTO(
                    a.attendanceId, a.user.userId, a.date, a.checkIn, a.checkOut
                )
                FROM Attendance a
                WHERE a.date = :date
            """)
    List<AttendanceDTO> findByDate(@Param("date") LocalDate date);

    @Query("""
                SELECT new tlu.finalproject.hrmanagement.dto.AttendanceDTO(
                    a.attendanceId, a.user.userId,  a.date, a.checkIn, a.checkOut
                ) 
                FROM Attendance a
                WHERE a.user.userId = :userId 
                AND a.date BETWEEN :start AND :end
            """)
    List<AttendanceDTO> findAttendancesByUserAndDateRange(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);


    /**
     * Tìm tất cả các bản ghi chấm công của nhân viên trong một tháng cụ thể
     * @param userId ID của nhân viên
     * @param monthStr Chuỗi tháng theo định dạng "yyyy-MM"
     * @return Danh sách các bản ghi chấm công
     */
    @Query("""
            SELECT a FROM Attendance a 
            WHERE a.user.userId = :userId 
            AND SUBSTRING(CAST(a.date AS string), 1, 7) = :monthStr
        """)
    List<Attendance> findByUser_UserIdAndMonthString(@Param("userId") Long userId, @Param("monthStr") String monthStr);

    /**
     * Phương thức thay thế cho findByUser_UserIdAndMonth
     * Tìm tất cả các bản ghi chấm công của nhân viên trong một tháng cụ thể
     * @param userId ID của nhân viên
     * @param yearMonth Năm và tháng, ví dụ: 2025-05
     * @return Danh sách các bản ghi chấm công
     */
    @Query("""
            SELECT a FROM Attendance a
            WHERE a.user.userId = :userId
            AND YEAR(a.date) = :year AND MONTH(a.date) = :month
        """)
    List<Attendance> findByUserIdAndYearAndMonth(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month);

    List<Attendance> findByUserUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    @Query("SELECT a.user.userId, COUNT(a.date) FROM Attendance a WHERE a.user.userId = :userId AND a.date BETWEEN :startDate AND :endDate GROUP BY a.user.userId")
    Object[] countAttendancesByUserAndDateRange(@Param("userId") Long userId,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);



    @Query(value = """
        SELECT 
            u.user_id,
            u.full_name,
            a.date,
            a.check_in,
            TIMESTAMPDIFF(
                MINUTE,
                STR_TO_DATE(CONCAT(a.date, ' 08:00:00'), '%Y-%m-%d %H:%i:%s'),
                a.check_in
            ) AS minutes_late
        FROM 
            attendances a
        JOIN 
            users u ON a.user_id = u.user_id
        WHERE 
            a.check_in IS NOT NULL
            AND TIME(a.check_in) > '08:00:00'
            AND a.date BETWEEN :start AND :end
    """, nativeQuery = true)
    List<Object[]> findRawLateAttendances(LocalDate start, LocalDate end);

}
