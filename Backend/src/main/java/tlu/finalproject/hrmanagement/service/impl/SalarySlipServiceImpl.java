package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.*;
import tlu.finalproject.hrmanagement.model.*;
import tlu.finalproject.hrmanagement.repository.*;
import tlu.finalproject.hrmanagement.service.SalarySlipService;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalarySlipServiceImpl implements SalarySlipService {
    private final SalarySlipRepository salarySlipRepository;
    private final ModelMapper modelMapper;
    private final SalaryBonusRepository salaryBonusRepository;
    private final SalaryDeductionRepository salaryDeductionRepository;
    private final AttendanceRepository attendanceRepository;
    private final OvertimeRecordRepository overtimeRecordRepository;
    private final UserRepository userRepository;

    @Override
    public List<SalarySlipDTO> getAllSalarySlipsByMonth(String month) {
        return salarySlipRepository.findByMonth(month).stream()
                .map(slip -> modelMapper.map(slip, SalarySlipDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public SalarySlipDetailDTO getSalarySlipDetail(Long userId, String month) {
        SalarySlip salarySlip = salarySlipRepository
                .findByUserUserIdAndMonth(userId, month)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu lương"));

        // Tính khoảng thời gian đầu-cuối tháng
        YearMonth ym = YearMonth.parse(month); // "2024-12"
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        // Lấy bonus, deduction, attendance
        List<SalaryBonus> bonuses = salaryBonusRepository.findByUserUserIdAndBonusDateBetween(userId, startDate, endDate);
        List<SalaryDeduction> deductions = salaryDeductionRepository.findByUserUserIdAndDeductionDateBetween(userId, startDate, endDate);
        List<Attendance> attendances = attendanceRepository.findByUserUserIdAndDateBetween(userId, startDate, endDate);

        Object[] result1 = attendanceRepository.countAttendancesByUserAndDateRange(userId, startDate, endDate);
        Integer totalWorkingDays =  ((Long) result1[1]).intValue();

        Object[] result2 = overtimeRecordRepository.getTotalOvertimeByUserIdNative(userId);
        Double totalOTHours = (Double) result2[1];  // Tổng giờ làm thêm


        // Map DTO
        EmployeeDTO employeeDTO = modelMapper.map(salarySlip.getUser(), EmployeeDTO.class);
        SalarySlipDTO slipDTO = modelMapper.map(salarySlip, SalarySlipDTO.class);
        List<SalaryBonusDTO> bonusDTOs = bonuses.stream()
                .map(b -> modelMapper.map(b, SalaryBonusDTO.class)).toList();
        List<SalaryDeductionDTO> deductionDTOs = deductions.stream()
                .map(d -> modelMapper.map(d, SalaryDeductionDTO.class)).toList();


        return SalarySlipDetailDTO.builder()
                .employee(employeeDTO)
                .salarySlip(slipDTO)
                .bonusDetails(bonusDTOs)
                .deductionDetails(deductionDTOs)
                .attendanceSummary(totalWorkingDays)
                .totalOvertimeHour(totalOTHours)
                .build();
    }
}
