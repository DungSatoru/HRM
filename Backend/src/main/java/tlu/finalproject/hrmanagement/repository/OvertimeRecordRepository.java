package tlu.finalproject.hrmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tlu.finalproject.hrmanagement.model.OvertimeRecord;

@Repository
public interface OvertimeRecordRepository extends JpaRepository<OvertimeRecord, Long> {
}
