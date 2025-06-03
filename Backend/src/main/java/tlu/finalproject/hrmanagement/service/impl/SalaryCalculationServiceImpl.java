package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.OvertimeRecordDTO;
import tlu.finalproject.hrmanagement.exception.InternalServerErrorException;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.*;
import tlu.finalproject.hrmanagement.projection.OvertimeRecordProjection;
import tlu.finalproject.hrmanagement.repository.*;
import tlu.finalproject.hrmanagement.service.SalaryCalculationService;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryCalculationServiceImpl implements SalaryCalculationService {

    // Constants
    private static final double BHXH_RATE = 0.08;
    private static final double BHYT_RATE = 0.015;
    private static final double BHTN_RATE = 0.01;
    private static final double PERSONAL_DEDUCTION = 11_000_000.0;
    private static final double PROBATION_RATE = 0.85;
    private static final double DEPENDENT_DEDUCTION = 4_400_000.0;


    // Repositories
    private final SalaryDeductionRepository deductionRepository;
    private final UserRepository userRepository;
    private final SalaryConfigurationRepository salaryConfigurationRepository;
    private final SalaryBonusRepository salaryBonusRepository;
    private final SalarySlipRepository salarySlipRepository;
    private final OvertimeRecordRepository overtimeRecordRepository;
    private final AttendanceRepository attendanceRepository;

    @Override
    public void calculateAndSaveSalarySlip(Long userId, LocalDate month) {
        // 1. Kiểm tra và lấy thông tin nhân viên
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + userId));

        if (user.getStatus() != EmploymentStatus.ACTIVE || user.getStatus() != EmploymentStatus.PROBATION) {
            return;
        }

        // 2. Xóa dữ liệu lương đã tồn tại của tháng
        String monthStr =  month.toString().substring(0, 7); // Format yyyy-MM
        Optional<SalarySlip> existingSlip = salarySlipRepository.findByUser_UserIdAndSalaryPeriod(userId, monthStr);
        if (existingSlip.isPresent()) {
            deleteStandardDeductions(userId, month);
            salarySlipRepository.delete(existingSlip.get());
        }

        // 3. Lấy cấu hình lương của nhân viên
        SalaryConfiguration config = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình lương cho nhân viên ID: " + userId));

        // 4. Tính thông tin lương cơ bản
        // Lương ngày = LCB / Số ngày làm việc chuẩn / tháng
        // Số giờ làm việc chuẩn 1 ngày = (Thời gian bắt đầu đến lúc kết thúc) - (Số phút nghỉ trưa / 60)
        // Số giờ làm việc chuẩn 1 tháng = (Số giờ làm việc chuẩn 1 ngày) * (Số ngày làm việc chuẩn 1 tháng)
        double basicSalary = config.getBasicSalary();
        if (user.getStatus() == EmploymentStatus.PROBATION) {
            basicSalary *= PROBATION_RATE;
        }

        double dailySalary = basicSalary / config.getStandardWorkingDays();
        double standardWorkingHoursPerDay = (Duration.between(config.getWorkStartTime(), config.getWorkEndTime()).toMinutes()
                - config.getBreakDurationMinutes()) / 60.0;
        double standardWorkingHoursPerMonth = config.getStandardWorkingDays() * standardWorkingHoursPerDay;

        // 5. Tính số giờ làm việc thực tế
        // 5.1. Lấy toàn bộ dữ liệu chấm công của nhân viên trong tháng
        // Nhóm dữ liệu chấm công theo ngày (TH có chấm công nhiều lần trong ngày)
        // Với mỗi bản ghi chấm công, thêm vào danh sách tương ứng với ngày chấm công
        YearMonth yearMonth = YearMonth.from(month);
        List<Attendance> attendances = attendanceRepository.findByUserIdAndYearAndMonth(
                userId, yearMonth.getYear(), yearMonth.getMonthValue());

        Map<LocalDate, List<Attendance>> groupedByDate = new HashMap<>();
        for (Attendance att : attendances) {
            groupedByDate.computeIfAbsent(att.getDate(), k -> new ArrayList<>()).add(att);
        }

        // 5.2. Kiểm tra dữ liệu chấm công
        for (Map.Entry<LocalDate, List<Attendance>> entry : groupedByDate.entrySet()) {
            List<Attendance> dailyAttendances = entry.getValue();
            boolean hasValidCheckIn = dailyAttendances.stream().anyMatch(att -> att.getCheckIn() != null);
            boolean hasValidCheckOut = dailyAttendances.stream().anyMatch(att -> att.getCheckOut() != null);

            if (!hasValidCheckIn || !hasValidCheckOut) {
                throw new InternalServerErrorException("Thiếu dữ liệu chấm công của nhân viên: " + user.getFullName());
            }
        }

        // 5.3. Tính tổng số phút làm việc hành chính của nhân viên trong tháng
        long totalMinutesWorked = 0;

        // Giờ bắt đầu và kết thúc làm việc chuẩn theo cấu hình
        LocalTime workStartTime = config.getWorkStartTime();
        LocalTime workEndTime = config.getWorkEndTime();
        int lunchBreakMinutes = config.getBreakDurationMinutes();

        for (Map.Entry<LocalDate, List<Attendance>> entry : groupedByDate.entrySet()) {
            List<Attendance> dailyAttendances = entry.getValue();

            for(Attendance attendance : dailyAttendances) {
                // Xác định giờ vào làm thực tế (không tính trước giờ làm chuẩn)
                LocalTime effectiveCheckIn = attendance.getCheckIn().isBefore(workStartTime) ? workStartTime : attendance.getCheckIn();

                // Xác định giờ ra về thực tế (không tính sau giờ làm chuẩn)
                LocalTime effectiveCheckOut = attendance.getCheckOut().isAfter(workEndTime) ? workEndTime : attendance.getCheckOut();
                double hours = calculateWorkingHours(
                        effectiveCheckIn,
                        effectiveCheckOut,
                        workStartTime,
                        workEndTime,
                        lunchBreakMinutes
                );
                totalMinutesWorked += (long) (hours * 60); // Chuyển về phút và cộng vào tổng
            }



            // Tính giờ làm việc hành chính (trừ nghỉ trưa nếu có)

        }

        // Số ngày làm việc thực tế = Kích thước của dữ liệu chấm công đã nhóm theo ngày
        // Số giờ làm việc thực tế = (Tổng số phút làm việc / 60) - (Số giờ nghỉ trưa / 60)
        // Lương làm việc thực tế = Lương ngày / Số giờ làm việc chuẩn 1 ngày * Số giờ làm việc thực tế
        double actualWorkingDays = groupedByDate.size();
        double actualWorkingHours = (totalMinutesWorked / 60.0);
        double actualBasicSalary = dailySalary / standardWorkingHoursPerDay * actualWorkingHours;

        // 6. Tính lương làm thêm giờ (OT)
        // Lương theo giờ = Lương ngày / Số giờ làm việc chuẩn 1 ngày
        // Tiền OT ban ngày = Lương theo giờ * Số giờ OT ban ngày * Hệ số OT ban ngày
        // Tiền OT ban đêm = Lương theo giờ * Số giờ OT ban đêm * Hệ số OT ban đêm
        List<OvertimeRecordProjection> overtimeRecords = overtimeRecordRepository
                .findByUserIdAndMonth(userId, yearMonth.getYear(), yearMonth.getMonthValue());

        double totalDayHours = 0;
        double totalNightHours = 0;

        for (OvertimeRecordProjection projection : overtimeRecords) {
            OvertimeRecordDTO recordDTO = mapProjectionToDTO(projection);
            if (recordDTO.getDayHours() != null) {
                totalDayHours += recordDTO.getDayHours();
            }
            if (recordDTO.getNightHours() != null) {
                totalNightHours += recordDTO.getNightHours();
            }
        }

        // Tính lương theo giờ dựa trên lương ngày chia cho số giờ làm việc tiêu chuẩn trong ngày
        // Tính lương OT ngày
        // Tính lương OT đêm
        double hourlyRate = dailySalary / standardWorkingHoursPerDay;
        double dayOvertimePay = hourlyRate * totalDayHours * config.getDayOvertimeRate();
        double nightOvertimePay = hourlyRate * totalNightHours * config.getNightOvertimeRate();

        // 7. Tính tổng thưởng
        double totalBonus = salaryBonusRepository.findByUser_UserIdAndBonusDateBetween(
                        userId, month.withDayOfMonth(1), month.withDayOfMonth(month.lengthOfMonth()))
                .stream().mapToDouble(SalaryBonus::getAmount).sum();

        // 8. Tính tổng thu nhập trước khi khấu trừ
        // Lấy phụ cấp khác (nếu có), nếu null thì mặc định là 0
        // Tổng thu nhập trước khấu trừ = Lương làm việc thực tế + Lương OT ngày + Lương OT ban đêm + Thưởng
        // Nếu Không phải NV thử việc thì Tổng thu nhập trước khấu trừ += phụ cấp
        double otherAllowances = user.getStatus() != EmploymentStatus.PROBATION ? (config.getOtherAllowances() != null ? config.getOtherAllowances() : 0) : 0;
        double totalIncomeBeforeDeductions = actualBasicSalary + dayOvertimePay + nightOvertimePay + totalBonus;
        if (user.getStatus() != EmploymentStatus.PROBATION) {
            totalIncomeBeforeDeductions += otherAllowances;
        }

        // 9. Tính bảo hiểm và khấu trừ
        // Lấy mức lương đóng bảo hiểm
        // Nếu nhân viên qua thử việc mới thực hiện khấu trừ
        // Tính tổng khấu trừ
        double insuranceBaseSalary = config.getInsuranceBaseSalary() != null ? config.getInsuranceBaseSalary() : basicSalary;

        List<SalaryDeduction> deductions = new ArrayList<>();
        double totalInsurance = 0.0;

        if (user.getStatus() != EmploymentStatus.PROBATION) {
            double bhxh = insuranceBaseSalary * BHXH_RATE;
            double bhyt = insuranceBaseSalary * BHYT_RATE;
            double bhtn = insuranceBaseSalary * BHTN_RATE;

            deductions.add(createDeduction(user, "BHXH", bhxh, month));
            deductions.add(createDeduction(user, "BHYT", bhyt, month));
            deductions.add(createDeduction(user, "BHTN", bhtn, month));

            deductionRepository.saveAll(deductions);
            totalInsurance = deductions.stream().mapToDouble(SalaryDeduction::getAmount).sum();
        }

        // 10. Tính thuế TNCN dựa trên toàn bộ thu nhập chịu thuế
        // Thu nhập chịu thuế = Tổng thu nhập - Tổng tiền bảo hiểm - Giảm trừ cá nhân
        int numberOfDependents = config.getNumberOfDependents() != null ? config.getNumberOfDependents() : 0;
        double totalDeduction = PERSONAL_DEDUCTION + (numberOfDependents * DEPENDENT_DEDUCTION);
        double taxableIncome = Math.max(totalIncomeBeforeDeductions - totalInsurance - totalDeduction, 0);
        double personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);

        // Tạo đối tượng khấu trừ mới cho thuế TNCN
        deductions.add(createAndSaveDeduction(user, "Thuế TNCN", personalIncomeTax, month));

        // 11. Tính tổng khấu trừ (bao gồm cả thuế TNCN)
        double totalDeductions = deductionRepository.findByUser_UserIdAndDeductionDateBetween(
                        userId, month.withDayOfMonth(1), month.withDayOfMonth(month.lengthOfMonth()))
                .stream().mapToDouble(SalaryDeduction::getAmount).sum();

        // 12. Tính lương thực lĩnh
        double netSalary = totalIncomeBeforeDeductions - totalDeductions;

        // 13. Lưu phiếu lương
        SalarySlip salarySlip = SalarySlip.builder()
                .user(user)
                .standardWorkingHours(standardWorkingHoursPerMonth)
                .standardWorkingDays(config.getStandardWorkingDays())
                .actualWorkingHours(Math.round(actualWorkingHours * 100.0) / 100.0)
                .actualWorkingDays(actualWorkingDays)
                .actualBasicSalary((double) Math.round(actualBasicSalary))
                .otherAllowances((double) Math.round(otherAllowances))
                .dayOvertimePay((double) Math.round(dayOvertimePay))
                .nightOvertimePay((double) Math.round(nightOvertimePay))
                .totalBonus((double) Math.round(totalBonus))
                .totalDeductions((double) Math.round(totalDeductions))
                .grossIncome((double) Math.round(totalIncomeBeforeDeductions))
                .netSalary((double) Math.round(netSalary))
                .paymentDate(month.withDayOfMonth(month.lengthOfMonth()))
                .salaryPeriod(monthStr)
                .calculationDate(LocalDate.now())
                .build();

        salarySlipRepository.save(salarySlip);
    }

    public static double calculateWorkingHours(
            LocalTime checkIn,
            LocalTime checkOut,
            LocalTime workStart,
            LocalTime workEnd,
            int lunchBreakMinutes
    ) {
        // Giới hạn trong khoảng giờ hành chính
        LocalTime actualStart = checkIn.isBefore(workStart) ? workStart : checkIn;
        LocalTime actualEnd = checkOut.isAfter(workEnd) ? workEnd : checkOut;

        if (actualEnd.isBefore(actualStart)) return 0;

        // Thời gian nghỉ trưa mặc định từ 12:00
        LocalTime lunchStart = LocalTime.of(12, 0);
        LocalTime lunchEnd = lunchStart.plusMinutes(lunchBreakMinutes);

        // Tổng thời gian làm việc
        Duration totalWorkDuration = Duration.between(actualStart, actualEnd);

        // Nếu thời gian làm việc đè lên nghỉ trưa thì chỉ trừ phần bị đè
        if (actualStart.isBefore(lunchEnd) && actualEnd.isAfter(lunchStart)) {
            LocalTime overlapStart = actualStart.isAfter(lunchStart) ? actualStart : lunchStart;
            LocalTime overlapEnd = actualEnd.isBefore(lunchEnd) ? actualEnd : lunchEnd;
            Duration lunchOverlap = Duration.between(overlapStart, overlapEnd);
            totalWorkDuration = totalWorkDuration.minus(lunchOverlap);
        }

        // Trả về số giờ dạng thập phân (vd: 8.5)
        return totalWorkDuration.toMinutes() / 60.0;
    }

    private void deleteStandardDeductions(Long userId, LocalDate month) {
        List<String> standardDeductionTypes = Arrays.asList("BHXH", "BHYT", "BHTN", "Thuế TNCN");

        List<SalaryDeduction> deductions = deductionRepository.findByUser_UserIdAndDeductionDateBetween(
                userId, month.withDayOfMonth(1), month.withDayOfMonth(month.lengthOfMonth()));

        List<SalaryDeduction> deductionsToDelete = deductions.stream()
                .filter(deduction -> standardDeductionTypes.contains(deduction.getDeductionType()))
                .collect(Collectors.toList());

        if (!deductionsToDelete.isEmpty()) {
            deductionRepository.deleteAll(deductionsToDelete);
        }
    }

    private SalaryDeduction createAndSaveDeduction(User user, String type, double amount, LocalDate month) {
        SalaryDeduction deduction = createDeduction(user, type, amount, month);
        return deductionRepository.save(deduction);
    }

    private SalaryDeduction createDeduction(User user, String type, double amount, LocalDate month) {
        return SalaryDeduction.builder()
                .user(user)
                .deductionType(type)
                .amount(amount)
                .deductionDate(LocalDate.now())
                .build();
    }

    private double calculatePersonalIncomeTax(double income) {
        if (income <= 0) return 0;
        if (income <= 5_000_000) return income * 0.05;
        if (income <= 10_000_000) return 250_000 + (income - 5_000_000) * 0.10;
        if (income <= 18_000_000) return 750_000 + (income - 10_000_000) * 0.15;
        if (income <= 32_000_000) return 1_950_000 + (income - 18_000_000) * 0.20;
        if (income <= 52_000_000) return 4_750_000 + (income - 32_000_000) * 0.25;
        if (income <= 80_000_000) return 9_750_000 + (income - 52_000_000) * 0.30;
        return 18_150_000 + (income - 80_000_000) * 0.35;
    }

    private OvertimeRecordDTO mapProjectionToDTO(OvertimeRecordProjection projection) {
        return OvertimeRecordDTO.builder()
                .overtimeId(projection.getOvertimeId())
                .userId(projection.getUserId())
                .overtimeStart(projection.getOvertimeStart())
                .overtimeEnd(projection.getOvertimeEnd())
                .dayHours(projection.getDayHours())
                .nightHours(projection.getNightHours())
                .overtimeDate(projection.getOvertimeDate())
                .month(projection.getMonth())
                .build();
    }
}