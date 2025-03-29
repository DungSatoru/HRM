package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.Attendance;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @Query("SELECT a FROM Attendance a WHERE a.user.userId = :userId AND a.date = :date ORDER BY a.checkIn DESC")
    List<Attendance> findAttendancesByUserAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);
}
