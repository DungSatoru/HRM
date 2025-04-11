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
                    a.attendanceId, u.userId, u.fullName, a.date, a.checkIn, a.checkOut
                ) 
                FROM Attendance a
                LEFT JOIN a.user u
                WHERE a.date = :date
            """)
    List<AttendanceDTO> findByDate(@Param("date") LocalDate date);

    @Query("""
                SELECT new tlu.finalproject.hrmanagement.dto.AttendanceDTO(
                    a.attendanceId, u.userId, u.fullName, a.date, a.checkIn, a.checkOut
                ) 
                FROM Attendance a
                INNER JOIN a.user u
                WHERE a.user.userId = :userId 
                AND a.date BETWEEN :start AND :end
            """)
    List<AttendanceDTO> findAttendancesByUserAndDateRange(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);



}
