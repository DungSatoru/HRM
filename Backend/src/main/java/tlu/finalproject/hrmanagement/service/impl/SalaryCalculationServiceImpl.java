package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.OvertimeRecordDTO;
import tlu.finalproject.hrmanagement.dto.SalarySlipDTO;
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
    public String calculateAndSaveSalarySlip(Long userId, LocalDate month) {
        // ------------------------------------------------------------------------------
        // 1. KIỂM TRA VÀ LẤY THÔNG TIN NHÂN VIÊN

        // Tìm nhân viên theo userId, nếu không tồn tại thì ném lỗi "Không tìm thấy"
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + userId));

        // Nếu nhân viên đã nghỉ việc hoặc trạng thái không hợp lệ → không xử lý tiếp
        if (user.getStatus() != EmploymentStatus.ACTIVE && user.getStatus() != EmploymentStatus.PROBATION) {
            return "Nhân viên đã nghỉ việc";
        }

        // ------------------------------------------------------------------------------
        // 2. KIỂM TRA PHIẾU LƯƠNG THÁNG ĐÃ TỒN TẠI HAY CHƯA

        // Chuyển đối tượng LocalDate thành chuỗi "yyyy-MM" để đối chiếu với kỳ lương
        String monthStr = month.toString().substring(0, 7); // VD: 2025-06

        SalarySlip salarySlip;
        Optional<SalarySlip> existingSlip = salarySlipRepository.findByUser_UserIdAndSalaryPeriod(userId, monthStr);

        // Nếu đã có phiếu lương cho tháng đó → dùng lại bản ghi cũ
        if (existingSlip.isPresent()) {
            salarySlip = existingSlip.get();
        } else {
            // Nếu chưa có → tạo mới phiếu lương và gán thông tin nhân viên, kỳ lương
            salarySlip = new SalarySlip();
            salarySlip.setUser(user);
            salarySlip.setSalaryPeriod(monthStr);
        }


        // ------------------------------------------------------------------------------
        // 3. LẤY CẤU HÌNH LƯƠNG CỦA NHÂN VIÊN

        // Truy vấn cấu hình lương (SalaryConfiguration) của nhân viên từ DB theo userId.
        // Nếu không tìm thấy thì ném lỗi để dừng xử lý.
        SalaryConfiguration config = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cấu hình lương cho nhân viên ID: " + userId));

        // ------------------------------------------------------------------------------
        // 4. TÍNH TOÁN THÔNG SỐ LƯƠNG CƠ BẢN VÀ THỜI GIAN CHUẨN

        // 4.1. Lấy lương cơ bản từ cấu hình
        double basicSalary = config.getBasicSalary();

        // Nếu nhân viên đang trong thời gian thử việc → áp dụng hệ số thử việc (PROBATION_RATE)
        if (user.getStatus() == EmploymentStatus.PROBATION) {
            basicSalary *= (config.getProbationRate() / 100.0);
        }

        // 4.2. Tính lương theo ngày = Lương cơ bản / số ngày làm việc tiêu chuẩn trong tháng
        double dailySalary = basicSalary / config.getStandardWorkingDays();

        // 4.3. Tính số giờ làm việc tiêu chuẩn mỗi ngày:
        // = Tổng số phút làm việc trong ngày (giữa giờ bắt đầu và kết thúc) - thời gian nghỉ trưa (phút), sau đó đổi ra giờ
        double standardWorkingHoursPerDay = (
                Duration.between(config.getWorkStartTime(), config.getWorkEndTime()).toMinutes()
                        - config.getBreakDurationMinutes()
        ) / 60.0;

        // 4.4. Tính tổng số giờ làm việc tiêu chuẩn trong tháng = số giờ/ngày * số ngày làm việc chuẩn
        double standardWorkingHoursPerMonth = config.getStandardWorkingDays() * standardWorkingHoursPerDay;


        // ------------------------------------------------------------------------------
        // 5. TÍNH SỐ GIỜ LÀM VIỆC THỰC TẾ TRONG THÁNG

        // 5.1. Lấy toàn bộ dữ liệu chấm công trong tháng theo userId và tháng/năm
        YearMonth yearMonth = YearMonth.from(month);
        List<Attendance> attendances = attendanceRepository.findByUserIdAndYearAndMonth(
                userId, yearMonth.getYear(), yearMonth.getMonthValue());

        // Nhóm các bản ghi chấm công theo ngày để dễ xử lý (mỗi ngày có thể có nhiều lần check-in/out)
        Map<LocalDate, List<Attendance>> groupedByDate = new HashMap<>();
        for (Attendance att : attendances) {
            groupedByDate.computeIfAbsent(att.getDate(), k -> new ArrayList<>()).add(att);
        }

        // 5.2. Kiểm tra dữ liệu chấm công từng ngày
        // Mỗi ngày bắt buộc phải có ít nhất 1 lần check-in và 1 lần check-out hợp lệ
        for (Map.Entry<LocalDate, List<Attendance>> entry : groupedByDate.entrySet()) {
            List<Attendance> dailyAttendances = entry.getValue();
            boolean hasValidCheckIn = dailyAttendances.stream().anyMatch(att -> att.getCheckIn() != null);
            boolean hasValidCheckOut = dailyAttendances.stream().anyMatch(att -> att.getCheckOut() != null);

            if (!hasValidCheckIn || !hasValidCheckOut) {
                throw new InternalServerErrorException("Thiếu dữ liệu chấm công của nhân viên: " + user.getFullName());
            }
        }

        // 5.3. Tính tổng số phút làm việc trong tháng (không tính phần làm sớm hơn giờ chuẩn hoặc về muộn hơn giờ chuẩn)
        long totalMinutesWorked = 0;

        // Lấy cấu hình thời gian bắt đầu/kết thúc làm việc và thời gian nghỉ trưa
        LocalTime workStartTime = config.getWorkStartTime();
        LocalTime workEndTime = config.getWorkEndTime();
        int lunchBreakMinutes = config.getBreakDurationMinutes();

        // Với từng ngày làm việc, tính tổng số phút làm việc hành chính hợp lệ
        for (Map.Entry<LocalDate, List<Attendance>> entry : groupedByDate.entrySet()) {
            List<Attendance> dailyAttendances = entry.getValue();

            for (Attendance attendance : dailyAttendances) {
                // Nếu vào làm sớm hơn giờ chuẩn → tính từ giờ chuẩn
                LocalTime effectiveCheckIn = attendance.getCheckIn().isBefore(workStartTime)
                        ? workStartTime
                        : attendance.getCheckIn();

                // Nếu ra về muộn hơn giờ chuẩn → tính đến giờ chuẩn
                LocalTime effectiveCheckOut = attendance.getCheckOut().isAfter(workEndTime)
                        ? workEndTime
                        : attendance.getCheckOut();

                // Gọi hàm calculateWorkingHours để tính số giờ làm việc trong khung chuẩn
                double hours = calculateWorkingHours(
                        effectiveCheckIn,
                        effectiveCheckOut,
                        workStartTime,
                        workEndTime,
                        lunchBreakMinutes
                );

                // Cộng số giờ làm được trong ngày (quy đổi sang phút) vào tổng
                totalMinutesWorked += (long) (hours * 60);
            }
        }

        // ------------------------------------------------------------------------------
        // TÍNH TOÁN LƯƠNG CƠ BẢN DỰA TRÊN GIỜ LÀM THỰC TẾ

        // Tổng số ngày có chấm công (số ngày làm việc thực tế)
        double actualWorkingDays = groupedByDate.size();

        // Tổng số giờ làm việc thực tế trong tháng
        double actualWorkingHours = (totalMinutesWorked / 60.0);

        // Lương làm việc thực tế = (Lương theo ngày / Số giờ chuẩn/ngày) * số giờ làm việc thực tế
        double actualBasicSalary = dailySalary / standardWorkingHoursPerDay * actualWorkingHours;


        // ------------------------------------------------------------------------------
        // 6. TÍNH LƯƠNG LÀM THÊM GIỜ (OVERTIME / OT)

        // 6.1. Lấy danh sách các bản ghi OT của nhân viên trong tháng theo userId
        List<OvertimeRecordProjection> overtimeRecords = overtimeRecordRepository
                .findByUserIdAndMonth(userId, yearMonth.getYear(), yearMonth.getMonthValue());

        // 6.2. Tổng hợp số giờ OT ban ngày và OT ban đêm
        double totalDayHours = 0;
        double totalNightHours = 0;

        // Lặp qua từng bản ghi OT để cộng dồn số giờ làm thêm ngày/đêm
        for (OvertimeRecordProjection projection : overtimeRecords) {
            OvertimeRecordDTO recordDTO = mapProjectionToDTO(projection);

            if (recordDTO.getDayHours() != null) {
                totalDayHours += recordDTO.getDayHours();  // Tổng OT ban ngày
            }
            if (recordDTO.getNightHours() != null) {
                totalNightHours += recordDTO.getNightHours();  // Tổng OT ban đêm
            }
        }

        // ------------------------------------------------------------------------------
        // 6.3. TÍNH LƯƠNG OT

        // Lương theo giờ = lương ngày chia cho số giờ làm việc tiêu chuẩn trong một ngày
        double hourlyRate = dailySalary / standardWorkingHoursPerDay;

        // Tiền OT ban ngày = lương theo giờ * tổng giờ OT ban ngày * hệ số OT ban ngày
        double dayOvertimePay = hourlyRate * totalDayHours * config.getDayOvertimeRate();

        // Tiền OT ban đêm = lương theo giờ * tổng giờ OT ban đêm * hệ số OT ban đêm
        double nightOvertimePay = hourlyRate * totalNightHours * config.getNightOvertimeRate();


        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // 7. TÍNH TỔNG THƯỞNG
        double totalBonus = salaryBonusRepository.findByUser_UserIdAndBonusDateBetween(
                        userId, month.withDayOfMonth(1), month.withDayOfMonth(month.lengthOfMonth()))
                .stream().mapToDouble(SalaryBonus::getAmount).sum();


        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // 8. TÍNH LƯƠNG GROSS (TỔNG THU NHẬP TRƯỚC KHẤU TRỪ)

        // 8.1. Lấy phụ cấp khác nếu có (chỉ áp dụng cho nhân viên không phải thử việc)
        double otherAllowances = user.getStatus() != EmploymentStatus.PROBATION
                ? (config.getOtherAllowances() != null ? config.getOtherAllowances() : 0)
                : 0;

        // 8.2. Tính lương gross gồm: lương thực tế + lương OT ban ngày + lương OT ban đêm + thưởng
        double grossSalary = actualBasicSalary + dayOvertimePay + nightOvertimePay + totalBonus;

        // 8.2.1. Nếu không phải nhân viên thử việc thì cộng thêm phụ cấp vào lương gross
        if (user.getStatus() != EmploymentStatus.PROBATION) {
            grossSalary += otherAllowances;
        }

        // 8.3. Tính tổng các khoản khấu trừ nội bộ (ví dụ: đi muộn, nghỉ không phép...)
        // Loại trừ các khoản bảo hiểm và thuế (sẽ xử lý riêng ở bước sau)
        double InternalDeductions = deductionRepository
                .findByUserUserIdAndDeductionDateBetween(
                        userId,
                        month.withDayOfMonth(1),
                        month.withDayOfMonth(month.lengthOfMonth())
                )
                .stream()
                .filter(d -> {
                    String type = d.getDeductionType();
                    return !type.equalsIgnoreCase("BHXH")
                            && !type.equalsIgnoreCase("BHTN")
                            && !type.equalsIgnoreCase("BHYT")
                            && !type.equalsIgnoreCase("Thuế TNCN");
                })
                .mapToDouble(SalaryDeduction::getAmount)
                .sum();

        // 8.4. Tổng thu nhập sau khi đã trừ các khoản khấu trừ nội bộ
        double grossAfterInternalDeductions = grossSalary - InternalDeductions;

        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // 9. TÍNH CÁC KHOẢN BẢO HIỂM VÀ CẬP NHẬT CSDL

        // 9.1. Lấy mức lương làm căn cứ đóng bảo hiểm (nếu null thì dùng lương cơ bản)
        double insuranceBaseSalary = config.getInsuranceBaseSalary() != null ? config.getInsuranceBaseSalary() : basicSalary;

        // 9.2. Lọc danh sách các khoản khấu trừ đã có trong DB liên quan đến BHXH, BHYT, BHTN, Thuế TNCN
        Set<String> acceptedTypes = Set.of("BHXH", "BHTN", "BHYT", "Thuế TNCN");
        Map<String, SalaryDeduction> existingDeductionsMap = deductionRepository
                .findByUserUserIdAndDeductionDateBetween(
                        userId,
                        month.withDayOfMonth(1),
                        month.withDayOfMonth(month.lengthOfMonth())
                )
                .stream()
                .filter(d -> acceptedTypes.contains(d.getDeductionType()))
                .collect(Collectors.toMap(SalaryDeduction::getDeductionType, d -> d));

        List<SalaryDeduction> deductionsToSave = new ArrayList<>();
        double totalInsurance = 0.0;

        // 9.3. Nếu là nhân viên chính thức thì tính và tạo/ cập nhật các khoản bảo hiểm
        if (user.getStatus() != EmploymentStatus.PROBATION) {
            double bhxh = insuranceBaseSalary * BHXH_RATE;
            double bhyt = insuranceBaseSalary * BHYT_RATE;
            double bhtn = insuranceBaseSalary * BHTN_RATE;

            updateOrCreateDeduction(deductionsToSave, existingDeductionsMap, user, "BHXH", bhxh, month);
            updateOrCreateDeduction(deductionsToSave, existingDeductionsMap, user, "BHYT", bhyt, month);
            updateOrCreateDeduction(deductionsToSave, existingDeductionsMap, user, "BHTN", bhtn, month);

            totalInsurance = bhxh + bhyt + bhtn; // Tổng tiền bảo hiểm cần trừ
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // 10. TÍNH THU NHẬP CHỊU THUẾ & THUẾ TNCN

        // 10.1. Tính tổng giảm trừ gia cảnh
        int numberOfDependents = config.getNumberOfDependents() != null ? config.getNumberOfDependents() : 0;
        double totalDeduction = PERSONAL_DEDUCTION + (numberOfDependents * DEPENDENT_DEDUCTION);

        // 10.2. Tính thu nhập tính thuế = gross sau nội bộ - bảo hiểm - giảm trừ gia cảnh
        double taxableIncome = Math.max(grossAfterInternalDeductions - totalInsurance - totalDeduction, 0);

        // 10.3. Tính số thuế TNCN phải nộp theo thu nhập tính thuế
        double personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);

        // 10.4. Cập nhật hoặc tạo khoản khấu trừ "Thuế TNCN" vào DB
        updateOrCreateDeduction(deductionsToSave, existingDeductionsMap, user, "Thuế TNCN", personalIncomeTax, month);

        // 10.5. Lưu toàn bộ các khoản khấu trừ bảo hiểm & thuế TNCN vào DB
        deductionRepository.saveAll(deductionsToSave);

        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // 11. TÍNH TỔNG KHẤU TRỪ (bao gồm: nội bộ + bảo hiểm + thuế TNCN)
        double totalDeductions = InternalDeductions + totalInsurance + personalIncomeTax;

        // 12. TÍNH LƯƠNG NET (THỰC NHẬN)
        double netSalary = grossSalary - totalDeductions;


        // ----------------------------------------------------------------------------------------------------------------------------------------------------
        // 13. LƯU PHIẾU LƯƠNG
        salarySlip.setStandardWorkingHours(standardWorkingHoursPerMonth);
        salarySlip.setStandardWorkingDays(config.getStandardWorkingDays());
        salarySlip.setActualWorkingHours(Math.round(actualWorkingHours * 100.0) / 100.0);
        salarySlip.setActualWorkingDays(actualWorkingDays);
        salarySlip.setActualBasicSalary((double) Math.round(actualBasicSalary));
        salarySlip.setOtherAllowances((double) Math.round(otherAllowances));
        salarySlip.setDayOvertimePay((double) Math.round(dayOvertimePay));
        salarySlip.setNightOvertimePay((double) Math.round(nightOvertimePay));
        salarySlip.setTotalBonus((double) Math.round(totalBonus));
        salarySlip.setTotalDeductions((double) Math.round(totalDeductions));
        salarySlip.setGrossIncome((double) Math.round(grossSalary));
        salarySlip.setNetSalary((double) Math.round(netSalary));
        salarySlip.setPaymentDate(month.withDayOfMonth(month.lengthOfMonth()));
        salarySlip.setCalculationDate(LocalDate.now());

        salarySlipRepository.save(salarySlip); // Lưu hoặc cập nhật phiếu lương
        return "Tính lương tháng " + month + " thành công cho nhân viên " + user.getFullName();
    }

    public static double calculateWorkingHours(
            LocalTime checkIn,          // Thời gian vào làm thực tế
            LocalTime checkOut,         // Thời gian ra về thực tế
            LocalTime workStart,        // Giờ làm việc chuẩn bắt đầu (theo cấu hình)
            LocalTime workEnd,          // Giờ làm việc chuẩn kết thúc (theo cấu hình)
            int lunchBreakMinutes       // Thời lượng nghỉ trưa (phút)
    ) {
        // -------------------------------
        // 1. Giới hạn giờ làm thực tế trong khung giờ hành chính

        // Nếu vào làm sớm hơn giờ chuẩn thì lấy giờ chuẩn
        LocalTime actualStart = checkIn.isBefore(workStart) ? workStart : checkIn;

        // Nếu ra về muộn hơn giờ chuẩn thì lấy giờ chuẩn
        LocalTime actualEnd = checkOut.isAfter(workEnd) ? workEnd : checkOut;

        // Nếu ra về trước khi vào làm thì trả về 0 giờ (dữ liệu sai)
        if (actualEnd.isBefore(actualStart)) return 0;

        // -------------------------------
        // 2. Xác định khung giờ nghỉ trưa mặc định

        // Giả định nghỉ trưa bắt đầu từ 12:00
        LocalTime lunchStart = LocalTime.of(12, 0);
        LocalTime lunchEnd = lunchStart.plusMinutes(lunchBreakMinutes);  // VD: 12:00 → 13:00 nếu nghỉ 60 phút

        // -------------------------------
        // 3. Tính tổng thời gian làm việc giữa giờ vào - ra

        Duration totalWorkDuration = Duration.between(actualStart, actualEnd);

        // -------------------------------
        // 4. Trừ đi phần thời gian bị đè lên giờ nghỉ trưa (nếu có)

        // Nếu thời gian làm việc bị trùng với khoảng nghỉ trưa
        if (actualStart.isBefore(lunchEnd) && actualEnd.isAfter(lunchStart)) {

            // Xác định đoạn thời gian giao nhau giữa giờ làm và giờ nghỉ
            LocalTime overlapStart = actualStart.isAfter(lunchStart) ? actualStart : lunchStart;
            LocalTime overlapEnd = actualEnd.isBefore(lunchEnd) ? actualEnd : lunchEnd;

            // Trừ phần giao nhau (đè lên nghỉ trưa) khỏi tổng giờ làm
            Duration lunchOverlap = Duration.between(overlapStart, overlapEnd);
            totalWorkDuration = totalWorkDuration.minus(lunchOverlap);
        }

        // -------------------------------
        // 5. Trả về số giờ làm thực tế (ở dạng số thập phân)
        return totalWorkDuration.toMinutes() / 60.0;
    }


    // Phương thức helper để cập nhật hoặc tạo mới khấu trừ
    private void updateOrCreateDeduction(
            List<SalaryDeduction> deductionsToSave,                     //  Danh sách sẽ lưu lại các khấu trừ mới hoặc đã cập nhật
            Map<String, SalaryDeduction> existingDeductionsMap,         //  Các khấu trừ đã có, key là deductionType
            User user,                                                  //  Nhân viên được xử lý
            String type,                                                //  Loại khấu trừ (ví dụ: "Bảo hiểm", "Trễ giờ")
            double amount,                                              //  Số tiền khấu trừ
            LocalDate month                                             //  Tháng xử lý (ví dụ: 2024-12-01)
    ) {

        SalaryDeduction deduction = existingDeductionsMap.get(type);
        if (deduction != null) {
            // Cập nhật khoản khấu trừ hiện có
            deduction.setAmount((double) Math.round(amount));
            deduction.setDeductionDate(month.withDayOfMonth(month.lengthOfMonth())); // Đảm bảo ngày tháng được cập nhật
        } else {
            // Tạo mới nếu chưa có
            deduction = createDeduction(user, type, amount, month);
        }
        deductionsToSave.add(deduction);
    }

    private SalaryDeduction createDeduction(User user, String type, double amount, LocalDate month) {
        return SalaryDeduction.builder()
                .user(user)
                .deductionType(type)
                .amount(amount)
                .deductionDate(month.withDayOfMonth(month.lengthOfMonth()))
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