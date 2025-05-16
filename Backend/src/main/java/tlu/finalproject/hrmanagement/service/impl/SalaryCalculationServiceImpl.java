package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.OvertimeRecordDTO;
import tlu.finalproject.hrmanagement.dto.SalarySlipDTO;
import tlu.finalproject.hrmanagement.exception.ResourceAlreadyExistsException;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.*;
import tlu.finalproject.hrmanagement.projection.OvertimeRecordProjection;
import tlu.finalproject.hrmanagement.repository.*;
import tlu.finalproject.hrmanagement.service.SalaryCalculationService;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryCalculationServiceImpl implements SalaryCalculationService {
    private static final int STANDARD_WORKING_DAYS = 22;
    private static final int WORKING_HOURS_PER_DAY = 8;
    private static final double BHXH_RATE = 0.08;
    private static final double BHYT_RATE = 0.015;
    private static final double BHTN_RATE = 0.01;
    private static final double PERSONAL_DEDUCTION = 11000000.0;
    private static final double DEFAULT_OVERTIME_RATE = 1.5;

    private final SalaryDeductionRepository deductionRepository;
    private final UserRepository userRepository;
    private final SalaryConfigurationRepository salaryConfigurationRepository;
    private final SalaryBonusRepository salaryBonusRepository;
    private final SalarySlipRepository salarySlipRepository;
    private final OvertimeRecordRepository overtimeRecordRepository;
    private final AttendanceRepository attendanceRepository;

    @Override
    public void calculateAndSaveSalarySlip(Long userId, LocalDate month) {
        String monthStr = formatMonthString(month);
//        validateSalarySlipNotExists(userId, monthStr);

        // Tìm phiếu lương đã tồn tại
        Optional<SalarySlip> existingSlip = salarySlipRepository.findByUser_UserIdAndMonth(userId, monthStr);

        // Xóa các khấu trừ liên quan
        if (existingSlip.isPresent()) {
           deleteStandardDeductions(userId, month);

            // Xóa phiếu lương
            salarySlipRepository.delete(existingSlip.get());
        }

        User user = findUserById(userId);
        // Nếu trạng thái là INACTIVE thì không tính lương
        if (user.getStatus() == Status.INACTIVE) {
            return; // Dừng luôn, không tính lương nữa
        }
        SalaryConfiguration config = findSalaryConfigurationByUserId(userId);

        double basicSalary = config.getBasicSalary();
        double dailySalary = calculateDailySalary(basicSalary);

        // Lấy số ngày làm việc thực tế
        YearMonth yearMonth = YearMonth.from(month);
        List<Attendance> attendances = getAttendanceRecords(userId, yearMonth);
        int workingDays = countWorkingDays(attendances);

        // Tính lương cơ bản thực tế dựa trên số ngày làm việc
        double actualBasicSalary = dailySalary * workingDays;

        // Tính các khoản bảo hiểm và khấu trừ
        double insuranceBaseSalary = getInsuranceBaseSalary(config, basicSalary);
        double otherAllowances = getOtherAllowances(config);

        // Tính và lưu các khoản khấu trừ
        List<SalaryDeduction> deductions = calculateAndSaveInsuranceDeductions(user, insuranceBaseSalary, month);
        double totalInsurance = calculateTotalInsurance(deductions);

        // Tính thuế TNCN
        double taxableIncome = calculateTaxableIncome(actualBasicSalary, totalInsurance, PERSONAL_DEDUCTION);
        double personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);
        deductions.add(createAndSaveDeduction(user, "Thuế TNCN", personalIncomeTax, month));

        // Tính tổng khấu trừ và thưởng
        double totalBonus = calculateTotalBonus(userId, month);
        double overtimeSalary = calculateOvertimeSalary(userId, month, config);
        double totalDeductions = calculateTotalDeductions(userId, month);

        // Tính lương tổng
        double totalSalary = calculateTotalSalary(actualBasicSalary, totalBonus, overtimeSalary, otherAllowances, totalDeductions);

        // Lưu phiếu lương
        saveSalarySlip(user, month, basicSalary, actualBasicSalary, otherAllowances, totalBonus,
                totalDeductions, overtimeSalary, totalSalary, monthStr);
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

    private void validateSalarySlipNotExists(Long userId, String monthStr) {
        Optional<SalarySlip> existingSlip = salarySlipRepository.findByUser_UserIdAndMonth(userId, monthStr);
        if (existingSlip.isPresent()) {
            throw new ResourceAlreadyExistsException(
                    "Phiếu lương cho nhân viên ID: " + userId + " tháng " + monthStr + " đã tồn tại!");
        }
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));
    }

    private SalaryConfiguration findSalaryConfigurationByUserId(Long userId) {
        return salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình lương cho nhân viên ID: " + userId));
    }

    private double calculateDailySalary(double basicSalary) {
        return basicSalary / STANDARD_WORKING_DAYS;
    }

    private List<Attendance> getAttendanceRecords(Long userId, YearMonth yearMonth) {
        return attendanceRepository.findByUserIdAndYearAndMonth(userId, yearMonth.getYear(), yearMonth.getMonthValue());
    }

    private int countWorkingDays(List<Attendance> attendances) {
        return (int) attendances.stream()
                .filter(att -> att.getCheckIn() != null && att.getCheckOut() != null)
                .count();
    }

    private double getInsuranceBaseSalary(SalaryConfiguration config, double basicSalary) {
        return config.getInsuranceBaseSalary() != null ? config.getInsuranceBaseSalary() : basicSalary;
    }

    private double getOtherAllowances(SalaryConfiguration config) {
        return config.getOtherAllowances() != null ? config.getOtherAllowances() : 0;
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
                .deductionDate(month.withDayOfMonth(1))
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

    private double calculateTotalSalary(double basicSalary, double bonus, double overtimeSalary,
                                        double otherAllowances, double totalDeductions) {
        return basicSalary + bonus + overtimeSalary + otherAllowances - totalDeductions;
    }

    private void saveSalarySlip(User user, LocalDate month, double basicSalary, double actualBasicSalary,
                                double otherAllowances, double totalBonus, double totalDeductions,
                                double overtimeSalary, double totalSalary, String monthStr) {
        SalarySlip salarySlip = SalarySlip.builder()
                .user(user)
                .paymentDate(month.withDayOfMonth(month.lengthOfMonth()))
                .basicSalary(basicSalary)
                .actualBasicSalary(actualBasicSalary)
                .otherAllowances(otherAllowances)
                .bonus(totalBonus)
                .deductions(totalDeductions)
                .overTimePay(overtimeSalary)
                .totalSalary(totalSalary)
                .month(monthStr)
                .build();

        salarySlipRepository.save(salarySlip);
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

    private double calculateOvertimeSalary(Long userId, LocalDate month, SalaryConfiguration config) {
        YearMonth yearMonth = YearMonth.from(month);
        String monthYearString = yearMonth.toString();

        List<OvertimeRecordProjection> overtimeRecords = overtimeRecordRepository.findByUserIdAndMonth(userId, monthYearString);
        double totalOvertimePay = 0;

        for (OvertimeRecordProjection projection : overtimeRecords) {
            OvertimeRecordDTO recordDTO = mapProjectionToDTO(projection);

            if (recordDTO.getOvertimePay() != null) {
                totalOvertimePay += recordDTO.getOvertimePay();
            } else {
                double pay = calculateAndSaveOvertimePay(userId, config, recordDTO);
                totalOvertimePay += pay;
            }
        }

        return totalOvertimePay;
    }

    private OvertimeRecordDTO mapProjectionToDTO(OvertimeRecordProjection projection) {
        return OvertimeRecordDTO.builder()
                .overtimeId(projection.getOvertimeId())
                .userId(projection.getUserId())
                .overtimeStart(projection.getOvertimeStart())
                .overtimeEnd(projection.getOvertimeEnd())
                .overtimeHour(projection.getOvertimeHour())
                .overtimePay(projection.getOvertimePay())
                .overtimeDate(projection.getOvertimeDate())
                .month(projection.getMonth())
                .build();
    }

    private double calculateAndSaveOvertimePay(Long userId, SalaryConfiguration config, OvertimeRecordDTO recordDTO) {
        double hourlyRate = calculateHourlyRate(config.getBasicSalary());
        double overtimeRate = config.getOvertimeRate() != null ? config.getOvertimeRate() : DEFAULT_OVERTIME_RATE;
        double calculatedPay = recordDTO.getOvertimeHour() * hourlyRate * overtimeRate;

        // Lưu vào database
        saveOvertimeRecord(userId, recordDTO, calculatedPay);

        return calculatedPay;
    }

    private void saveOvertimeRecord(Long userId, OvertimeRecordDTO recordDTO, double calculatedPay) {
        User user = User.builder().userId(userId).build();

        OvertimeRecord overtimeRecord = OvertimeRecord.builder()
                .overtimeId(recordDTO.getOvertimeId())
                .user(user)
                .overtimeStart(recordDTO.getOvertimeStart())
                .overtimeEnd(recordDTO.getOvertimeEnd())
                .overtimeHour(recordDTO.getOvertimeHour())
                .overtimePay(calculatedPay)
                .overtimeDate(recordDTO.getOvertimeDate())
                .build();

        overtimeRecordRepository.save(overtimeRecord);
    }

    private double calculateHourlyRate(double basicSalary) {
        return basicSalary / (STANDARD_WORKING_DAYS * WORKING_HOURS_PER_DAY);
    }
}