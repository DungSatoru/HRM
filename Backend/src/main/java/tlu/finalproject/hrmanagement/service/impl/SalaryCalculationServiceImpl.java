package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.exception.ResourceAlreadyExistsException;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.OvertimeRecord;
import tlu.finalproject.hrmanagement.model.SalaryBonus;
import tlu.finalproject.hrmanagement.model.SalaryConfiguration;
import tlu.finalproject.hrmanagement.model.SalaryDeduction;
import tlu.finalproject.hrmanagement.model.SalarySlip;
import tlu.finalproject.hrmanagement.model.User;
import tlu.finalproject.hrmanagement.repository.OvertimeRecordRepository;
import tlu.finalproject.hrmanagement.repository.SalaryBonusRepository;
import tlu.finalproject.hrmanagement.repository.SalaryConfigurationRepository;
import tlu.finalproject.hrmanagement.repository.SalaryDeductionRepository;
import tlu.finalproject.hrmanagement.repository.SalarySlipRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.SalaryCalculationService;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SalaryCalculationServiceImpl implements SalaryCalculationService {
    private final SalaryDeductionRepository deductionRepository;
    private final UserRepository userRepository;
    private final SalaryConfigurationRepository salaryConfigurationRepository;
    private final SalaryBonusRepository salaryBonusRepository;
    private final SalarySlipRepository salarySlipRepository;
    private final OvertimeRecordRepository overtimeRecordRepository;

    @Override
    public void calculateAndSaveSalarySlip(Long userId, LocalDate month) {
        // Kiểm tra xem đã có phiếu lương cho tháng này chưa
        String monthStr = month.toString().substring(0, 7); // Lấy định dạng yyyy-MM
        Optional<SalarySlip> existingSlip = salarySlipRepository.findByUser_UserIdAndMonth(userId, monthStr);

        if (existingSlip.isPresent()) {
            throw new ResourceAlreadyExistsException("Phiếu lương cho nhân viên ID: " + userId + " tháng " + monthStr + " đã tồn tại!");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        SalaryConfiguration config = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình lương cho nhân viên ID: " + userId));

        double basicSalary = config.getBasicSalary();
        double base = config.getInsuranceBaseSalary() != null ? config.getInsuranceBaseSalary() : basicSalary;

        // Lấy phụ cấp khác từ cấu hình lương
        double otherAllowances = config.getOtherAllowances() != null ? config.getOtherAllowances() : 0;

        // Tính bảo hiểm
        double bhxh = base * 0.08;
        double bhyt = base * 0.015;
        double bhtn = base * 0.01;

        double totalInsurance = bhxh + bhyt + bhtn;

        // Giảm trừ cá nhân cho thuế TNCN
        double personalDeduction = 11000000;
        double dependentDeduction = 0;

        // Tính thu nhập chịu thuế (không bao gồm phụ cấp để đơn giản hóa)
        double taxableIncome = basicSalary - totalInsurance - personalDeduction - dependentDeduction;
        taxableIncome = Math.max(taxableIncome, 0);

        // Tính thuế TNCN
        double personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);

        // Lưu các khoản khấu trừ bảo hiểm và thuế
        List<SalaryDeduction> newDeductions = new ArrayList<>();
        newDeductions.add(createDeduction(user, "BHXH", bhxh, month));
        newDeductions.add(createDeduction(user, "BHYT", bhyt, month));
        newDeductions.add(createDeduction(user, "BHTN", bhtn, month));
        newDeductions.add(createDeduction(user, "Thuế TNCN", personalIncomeTax, month));
        deductionRepository.saveAll(newDeductions);

        // Lấy tất cả các khoản thưởng trong tháng
        List<SalaryBonus> bonuses = salaryBonusRepository.findByUser_UserIdAndBonusDateBetween(
                userId,
                month.withDayOfMonth(1),
                month.withDayOfMonth(month.lengthOfMonth())
        );
        double totalBonus = bonuses.stream().mapToDouble(SalaryBonus::getAmount).sum();

        // Tính overtime salary
        double overtimeSalary = calculateOvertimeSalary(userId, month, config);

        // LẤY TẤT CẢ CÁC KHOẢN KHẤU TRỪ của nhân viên trong tháng
        List<SalaryDeduction> allDeductions = deductionRepository.findByUser_UserIdAndDeductionDateBetween(
                userId,
                month.withDayOfMonth(1),
                month.withDayOfMonth(month.lengthOfMonth())
        );
        double totalDeductions = allDeductions.stream().mapToDouble(SalaryDeduction::getAmount).sum();

        // Gọi hàm tính lương tổng (thêm phụ cấp khác vào công thức)
        double totalSalary = calculateTotalSalary(basicSalary, totalBonus, overtimeSalary, otherAllowances, totalDeductions);

        // Lưu Salary Slip
        SalarySlip salarySlip = SalarySlip.builder()
                .user(user)
                .paymentDate(month.withDayOfMonth(month.lengthOfMonth()))
                .basicSalary(basicSalary)
                .otherAllowances(otherAllowances)
                .bonus(totalBonus)
                .deductions(totalDeductions)
                .overTimePay(overtimeSalary)
                .totalSalary(totalSalary)
                .month(month.toString().substring(0, 7))
                .build();

        salarySlipRepository.save(salarySlip);
    }

    private SalaryDeduction createDeduction(User user, String type, double amount, LocalDate month) {
        return SalaryDeduction.builder()
                .user(user)
                .deductionType(type)
                .amount(amount)
                .deductionDate(month.withDayOfMonth(1))
                .build();
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

    private double calculateTotalSalary(double basicSalary, double bonus, double overtimeSalary, double otherAllowances, double totalDeductions) {
        return basicSalary + bonus + overtimeSalary + otherAllowances - totalDeductions;
    }

    private double calculateOvertimeSalary(Long userId, LocalDate month, SalaryConfiguration config) {
        // Lấy năm và tháng
        YearMonth yearMonth = YearMonth.from(month);
        String monthYearString = yearMonth.toString();

        // Tìm tất cả bản ghi làm thêm giờ cho nhân viên trong tháng này
        List<OvertimeRecord> overtimeRecords = overtimeRecordRepository.findByUser_UserIdAndMonth(userId, monthYearString);

        // Nếu đã có sẵn trường overtime_pay trong bảng
        double totalOvertimePay = 0;

        for (OvertimeRecord record : overtimeRecords) {
            if (record.getOvertimePay() != null) {
                // Nếu đã có giá trị lưu sẵn, sử dụng giá trị đó
                totalOvertimePay += record.getOvertimePay();
            } else {
                // Nếu chưa có, tính toán dựa trên số giờ và tỷ lệ làm thêm
                double hourlyRate = calculateHourlyRate(config.getBasicSalary());
                double overtimeRate = config.getOvertimeRate() != null ? config.getOvertimeRate() : 1.5;

                double overtimePay = record.getOvertimeHour() * hourlyRate * overtimeRate;

                // Cập nhật giá trị overtime_pay trong record
                record.setOvertimePay(overtimePay);
                overtimeRecordRepository.save(record);

                totalOvertimePay += overtimePay;
            }
        }

        return totalOvertimePay;
    }

    private double calculateHourlyRate(double basicSalary) {
        // Giả sử 22 ngày làm việc trong tháng, mỗi ngày 8 giờ
        return basicSalary / (22 * 8);
    }
}