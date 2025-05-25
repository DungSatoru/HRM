package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.OvertimeRecordDTO;
import tlu.finalproject.hrmanagement.dto.SalarySlipDTO;
import tlu.finalproject.hrmanagement.exception.InternalServerErrorException;
import tlu.finalproject.hrmanagement.exception.ResourceAlreadyExistsException;
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

    private static final double BHXH_RATE = 0.08;
    private static final double BHYT_RATE = 0.015;
    private static final double BHTN_RATE = 0.01;
    private static final double PERSONAL_DEDUCTION = 11000000.0;


    private final SalaryDeductionRepository deductionRepository;
    private final UserRepository userRepository;
    private final SalaryConfigurationRepository salaryConfigurationRepository;
    private final SalaryBonusRepository salaryBonusRepository;
    private final SalarySlipRepository salarySlipRepository;
    private final OvertimeRecordRepository overtimeRecordRepository;
    private final AttendanceRepository attendanceRepository;

    @Override
    public void calculateAndSaveSalarySlip(Long userId, LocalDate month) {
        // 1. Lấy thông tin nhân viên
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        // 2. Kiểm tra nhân viên có nghỉ phép hay đã nghỉ việc thì dừng
        if (user.getStatus() == EmploymentStatus.INACTIVE || user.getStatus() == EmploymentStatus.ON_LEAVE) {
            return; // Dừng luôn, không tính lương nữa
        }

        // 3. Tìm và xóa phiếu lương, khấu trừ đã tồn tại của tháng
        String monthStr = formatMonthString(month);
        Optional<SalarySlip> existingSlip = salarySlipRepository.findByUser_UserIdAndSalaryPeriod(userId, monthStr);
        if (existingSlip.isPresent()) {
            deleteStandardDeductions(userId, month);
            salarySlipRepository.delete(existingSlip.get());
        }


        // 4. Lấy lấy thông tin cấu hình lương của nhân viên
        SalaryConfiguration config = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình lương cho nhân viên ID: " + userId));

        // 5. Tính lương theo ngày của nhân viên và số ngày làm việc thực tế
        double basicSalary = config.getBasicSalary();
        if (user.getStatus() == EmploymentStatus.PROBATION) {
            basicSalary *= 0.85;
        }
        double dailySalary = basicSalary / config.getStandardWorkingDays();
        double standardWorkingHoursPerDay = (Duration.between(config.getWorkStartTime(), config.getWorkEndTime()).toMinutes() - config.getBreakDurationMinutes()) / 60;
        double standardWorkingHoursPerMonth = config.getStandardWorkingDays() * standardWorkingHoursPerDay;

        // Lấy số ngày làm việc thực tế
        YearMonth yearMonth = YearMonth.from(month);
        List<Attendance> attendances = attendanceRepository.findByUserIdAndYearAndMonth(userId, yearMonth.getYear(), yearMonth.getMonthValue());

        Map<LocalDate, List<Attendance>> groupedByDate = new HashMap<>();
        for (Attendance att : attendances) {
            groupedByDate.computeIfAbsent(att.getDate(), k -> new ArrayList<>()).add(att);
        }

        for (Map.Entry<LocalDate, List<Attendance>> entry : groupedByDate.entrySet()) {
            List<Attendance> dailyAttendances = entry.getValue();

            boolean hasValidCheckIn = dailyAttendances.stream().anyMatch(att -> att.getCheckIn() != null);
            boolean hasValidCheckOut = dailyAttendances.stream().anyMatch(att -> att.getCheckOut() != null);

            if (!hasValidCheckIn || !hasValidCheckOut) {
                throw new InternalServerErrorException("Thiếu dữ liệu chấm công của nhân viên: " + user.getFullName());
            }
        }




        long totalMinutesWorked = 0;
        long totalMinutesLate = 0;
        long totalMinutesEarlyLeave = 0;

        LocalTime workStartTime = config.getWorkStartTime();
        LocalTime workEndTime = config.getWorkEndTime();

        for (Map.Entry<LocalDate, List<Attendance>> entry : groupedByDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<Attendance> dailyAttendances = entry.getValue();

            // Tìm checkIn sớm nhất
            LocalTime earliestCheckIn = dailyAttendances.stream()
                    .map(Attendance::getCheckIn)
                    .min(LocalTime::compareTo)
                    .orElse(workStartTime);

            // Tìm checkOut muộn nhất
            LocalTime latestCheckOut = dailyAttendances.stream()
                    .map(Attendance::getCheckOut)
                    .max(LocalTime::compareTo)
                    .orElse(workEndTime);

            // Tính thời gian làm việc trong giờ hành chính 8h-17h
            LocalTime effectiveCheckIn = earliestCheckIn.isBefore(workStartTime) ? workStartTime : earliestCheckIn;
            LocalTime effectiveCheckOut = latestCheckOut.isAfter(workEndTime) ? workEndTime : latestCheckOut;

            if (effectiveCheckOut.isAfter(effectiveCheckIn)) {
                long minutesWorked = Duration.between(effectiveCheckIn, effectiveCheckOut).toMinutes();
                totalMinutesWorked += minutesWorked;
            }

            // Tính phút đi muộn
            if (earliestCheckIn.isAfter(workStartTime)) {
                totalMinutesLate += Duration.between(workStartTime, earliestCheckIn).toMinutes();
            }

            // Tính phút về sớm
            if (latestCheckOut.isBefore(workEndTime)) {
                totalMinutesEarlyLeave += Duration.between(latestCheckOut, workEndTime).toMinutes();
            }
        }

        // Tính số ngày và giờ công chuẩn
        double actualWorkingDays = groupedByDate.size();
        double actualWorkingHour = (totalMinutesWorked / 60) - (actualWorkingDays * config.getBreakDurationMinutes() / 60); // Tổng số giờ làm việc hành chính - tổng số giờ nghỉ trưa - đi muộn - vể sớm

        // Tính lương cơ bản thực tế dựa trên số giờ công trên tháng
        double actualBasicSalary = dailySalary / standardWorkingHoursPerDay * actualWorkingHour;


        // Tính các khoản bảo hiểm và khấu trừ
        double insuranceBaseSalary = getInsuranceBaseSalary(config, basicSalary);
        double otherAllowances = config.getOtherAllowances() != null ? config.getOtherAllowances() : 0;

        // Tính và lưu các khoản khấu trừ
        List<SalaryDeduction> deductions = new ArrayList<>();
        double totalInsurance = 0.0;
        if (user.getStatus() != EmploymentStatus.PROBATION) {
            deductions = calculateAndSaveInsuranceDeductions(user, insuranceBaseSalary, month);
            totalInsurance = calculateTotalInsurance(deductions);
        }


        // Tính thuế TNCN
        double taxableIncome = calculateTaxableIncome(actualBasicSalary, totalInsurance, PERSONAL_DEDUCTION);
        double personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);
        deductions.add(createAndSaveDeduction(user, "Thuế TNCN", personalIncomeTax, month));

        // Tính tổng thưởng, khấu trừ
        double totalBonusPay = calculateTotalBonus(userId, month);
        double totalDeductionsPay = calculateTotalDeductions(userId, month);


        // Tính tổng OT
        List<OvertimeRecordProjection> overtimeRecords = overtimeRecordRepository.findByUserIdAndMonth(userId, yearMonth.getYear(), yearMonth.getMonthValue());
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


        double dayOvertimePay = dailySalary / standardWorkingHoursPerDay * totalDayHours * config.getDayOvertimeRate();
        double nightOvertimePay = dailySalary / standardWorkingHoursPerDay * totalNightHours * config.getNightOvertimeRate();

        // Tính lương tổng
        double totalSalary = 0.0;
        if (user.getStatus() == EmploymentStatus.PROBATION) {
            totalSalary = actualBasicSalary + totalBonusPay - totalDeductionsPay + dayOvertimePay + nightOvertimePay;
        } else {
            totalSalary = actualBasicSalary + totalBonusPay + otherAllowances - totalDeductionsPay + dayOvertimePay + nightOvertimePay;
        }

        // Lưu phiếu lương
        SalarySlip salarySlip = SalarySlip.builder()
                .user(user)
                .standardWorkingHours(standardWorkingHoursPerMonth)
                .standardWorkingDays(config.getStandardWorkingDays())
                .actualWorkingHours(actualWorkingHour)
                .actualWorkingDays(actualWorkingDays)
                .actualBasicSalary((double) Math.round(actualBasicSalary))
                .otherAllowances((double) Math.round(otherAllowances))
                .dayOvertimePay((double) Math.round(dayOvertimePay))
                .nightOvertimePay((double) Math.round(nightOvertimePay))
                .totalBonus((double) Math.round(totalBonusPay))
                .totalDeductions((double) Math.round(totalDeductionsPay))
                .totalSalary((double) Math.round(totalSalary))
                .paymentDate(month.withDayOfMonth(month.lengthOfMonth()))
                .salaryPeriod(monthStr)
                .calculationDate(LocalDate.now())
                .build();

        salarySlipRepository.save(salarySlip);
    }

    private void deleteStandardDeductions(Long userId, LocalDate month) {
        List<String> standardDeductionTypes = List.of("BHXH", "BHYT", "BHTN", "Thuế TNCN");

        // Tìm các khấu trừ trong tháng của nhân viên
        List<SalaryDeduction> deductions = deductionRepository.findByUser_UserIdAndDeductionDateBetween(
                userId,
                month.withDayOfMonth(1),
                month.withDayOfMonth(month.lengthOfMonth())
        );

        // Lọc ra các khấu trừ chuẩn cần xóa
        List<SalaryDeduction> deductionsToDelete = deductions.stream()
                .filter(deduction -> standardDeductionTypes.contains(deduction.getDeductionType()))
                .collect(Collectors.toList());

        // Xóa các khấu trừ
        if (!deductionsToDelete.isEmpty()) {
            deductionRepository.deleteAll(deductionsToDelete);
        }
    }

    private String formatMonthString(LocalDate month) {
        return month.toString().substring(0, 7); // Format yyyy-MM
    }


    private double getInsuranceBaseSalary(SalaryConfiguration config, double basicSalary) {
        return config.getInsuranceBaseSalary() != null ? config.getInsuranceBaseSalary() : basicSalary;
    }

    private List<SalaryDeduction> calculateAndSaveInsuranceDeductions(User user, double insuranceBaseSalary, LocalDate month) {
        double bhxh = insuranceBaseSalary * BHXH_RATE;
        double bhyt = insuranceBaseSalary * BHYT_RATE;
        double bhtn = insuranceBaseSalary * BHTN_RATE;

        List<SalaryDeduction> deductions = new ArrayList<>();
        deductions.add(createDeduction(user, "BHXH", bhxh, month));
        deductions.add(createDeduction(user, "BHYT", bhyt, month));
        deductions.add(createDeduction(user, "BHTN", bhtn, month));
        deductionRepository.saveAll(deductions);

        return deductions;
    }

    private double calculateTotalInsurance(List<SalaryDeduction> insuranceDeductions) {
        return insuranceDeductions.stream().mapToDouble(SalaryDeduction::getAmount).sum();
    }

    private double calculateTaxableIncome(double actualBasicSalary, double totalInsurance, double personalDeduction) {
        double taxableIncome = actualBasicSalary - totalInsurance - personalDeduction;
        return Math.max(taxableIncome, 0);
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

    private double calculateTotalBonus(Long userId, LocalDate month) {
        List<SalaryBonus> bonuses = salaryBonusRepository.findByUser_UserIdAndBonusDateBetween(
                userId,
                month.withDayOfMonth(1),
                month.withDayOfMonth(month.lengthOfMonth())
        );
        return bonuses.stream().mapToDouble(SalaryBonus::getAmount).sum();
    }

    private double calculateTotalDeductions(Long userId, LocalDate month) {
        List<SalaryDeduction> allDeductions = deductionRepository.findByUser_UserIdAndDeductionDateBetween(
                userId,
                month.withDayOfMonth(1),
                month.withDayOfMonth(month.lengthOfMonth())
        );
        return allDeductions.stream().mapToDouble(SalaryDeduction::getAmount).sum();
    }

    private double calculatePersonalIncomeTax(double income) {
        if (income <= 0) return 0;
        if (income <= 5000000) return income * 0.05;
        if (income <= 10000000) return 250000 + (income - 5000000) * 0.10;
        if (income <= 18000000) return 750000 + (income - 10000000) * 0.15;
        if (income <= 32000000) return 1950000 + (income - 18000000) * 0.20;
        if (income <= 52000000) return 4750000 + (income - 32000000) * 0.25;
        if (income <= 80000000) return 9750000 + (income - 52000000) * 0.30;
        return 18150000 + (income - 80000000) * 0.35;
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