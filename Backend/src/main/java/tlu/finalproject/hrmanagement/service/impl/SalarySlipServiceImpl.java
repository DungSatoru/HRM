package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.*;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.*;
import tlu.finalproject.hrmanagement.repository.*;
import tlu.finalproject.hrmanagement.service.SalarySlipService;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalarySlipServiceImpl implements SalarySlipService {
    private final SalarySlipRepository salarySlipRepository;
    private final ModelMapper modelMapper;
    private final SalaryBonusRepository salaryBonusRepository;
    private final SalaryDeductionRepository salaryDeductionRepository;
    private final UserRepository userRepository;

    @Override
    public List<SalarySlipDTO> getAllSalarySlipsByMonth(String month) {
        List<SalarySlip> slips = salarySlipRepository.findBySalaryPeriod(month);
        List<SalarySlipDTO> dtos = new ArrayList<>();

        for (SalarySlip slip : slips) {
            SalarySlipDTO dto = new SalarySlipDTO();
            dto = modelMapper.map(slip,SalarySlipDTO.class);
            User user = userRepository.findById(slip.getUser().getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Nhân viên không tồn tại"));
            dto.setFullName(user.getFullName());

            // Map department và position sang DTO
            if (user.getDepartment() != null) {
                dto.setDepartment(modelMapper.map(user.getDepartment(), DepartmentDTO.class));
            }

            if (user.getPosition() != null) {
                dto.setPosition(modelMapper.map(user.getPosition(), PositionDTO.class));
            }

            dtos.add(dto);
        }

        return dtos;
    }

    @Override
    public SalarySlipDetailDTO getSalarySlipDetail(Long userId, String month) {
        SalarySlip salarySlip = salarySlipRepository
                .findByUserUserIdAndSalaryPeriod(userId, month)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu lương"));

        // Tính khoảng thời gian đầu-cuối tháng
        YearMonth ym = YearMonth.parse(month); // "2024-12"
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        // Lấy bonus, deduction, attendance
        List<SalaryBonus> bonuses = salaryBonusRepository.findByUserUserIdAndBonusDateBetween(userId, startDate, endDate);
        List<SalaryDeduction> deductions = salaryDeductionRepository.findByUserUserIdAndDeductionDateBetween(userId, startDate, endDate);

        // Map DTO
        SalarySlipDTO slipDTO = modelMapper.map(salarySlip, SalarySlipDTO.class);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên không tồn tại"));
        slipDTO.setFullName(user.getFullName());
        slipDTO.setDepartment(modelMapper.map(user.getDepartment(), DepartmentDTO.class));
        slipDTO.setPosition(modelMapper.map(user.getPosition(), PositionDTO.class));

        List<SalaryBonusDTO> bonusDTOs = bonuses.stream()
                .map(b -> modelMapper.map(b, SalaryBonusDTO.class)).toList();
        List<SalaryDeductionDTO> deductionDTOs = deductions.stream()
                .map(d -> modelMapper.map(d, SalaryDeductionDTO.class)).toList();

        return SalarySlipDetailDTO.builder()
                .salarySlip(slipDTO)
                .bonusDetails(bonusDTOs)
                .deductionDetails(deductionDTOs)
                .build();
    }
}
