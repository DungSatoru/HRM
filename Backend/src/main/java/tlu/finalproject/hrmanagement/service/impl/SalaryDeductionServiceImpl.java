// ServiceImpl
package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.LateDeductionDTO;
import tlu.finalproject.hrmanagement.dto.SalaryDeductionDTO;
import tlu.finalproject.hrmanagement.exception.BadRequestException;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.SalaryConfiguration;
import tlu.finalproject.hrmanagement.model.SalaryDeduction;
import tlu.finalproject.hrmanagement.model.User;
import tlu.finalproject.hrmanagement.repository.AttendanceRepository;
import tlu.finalproject.hrmanagement.repository.SalaryConfigurationRepository;
import tlu.finalproject.hrmanagement.repository.SalaryDeductionRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.SalaryDeductionService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryDeductionServiceImpl implements SalaryDeductionService {
    private final SalaryDeductionRepository repository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;
    private final AttendanceRepository attendanceRepository;
    private final SalaryConfigurationRepository salaryConfigurationRepository;

    @Override
    public List<SalaryDeductionDTO> getAllByUserId(Long userId) {
        return repository.findByUserUserId(userId)
                .stream()
                .map(d -> mapper.map(d, SalaryDeductionDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public SalaryDeductionDTO create(SalaryDeductionDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng có ID: " + dto.getUserId()));
        SalaryDeduction deduction = mapper.map(dto, SalaryDeduction.class);
        deduction.setUser(user);
        return mapper.map(repository.save(deduction), SalaryDeductionDTO.class);
    }

    @Override
    public SalaryDeductionDTO update(Long id, SalaryDeductionDTO dto) {
        SalaryDeduction existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoản khấu trừ có ID: " + id));

        existing.setDeductionType(dto.getDeductionType());
        existing.setAmount(dto.getAmount());
        existing.setDeductionDate(dto.getDeductionDate());

        return mapper.map(repository.save(existing), SalaryDeductionDTO.class);
    }

    @Override
    public boolean delete(Long id) {
        SalaryDeduction existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoản khấu trừ có ID: " + id));
        repository.delete(existing);
        return true;
    }

    @Override
    public List<LateDeductionDTO> getLateDeductions(LocalDate start, LocalDate end) {
        List<Object[]> results = attendanceRepository.findRawLateAttendances(start, end);
        List<LateDeductionDTO> dtos = new ArrayList<>();

        for (Object[] row : results) {
            Long userId = ((Number) row[0]).longValue();
            String fullName = (String) row[1];
            LocalDate date = ((java.sql.Date) row[2]).toLocalDate();
            LocalTime checkIn = ((java.sql.Time) row[3]).toLocalTime();
            int minutesLate = ((Number) row[4]).intValue();

            int deductedMinutes = calculateDeductedMinutes(minutesLate);
            double perMinuteSalary = getPerMinuteSalary(userId);
            double deductionAmount = deductedMinutes * perMinuteSalary + 50000; // Fixed penalty

            dtos.add(LateDeductionDTO.builder()
                    .userId(userId)
                    .fullName(fullName)
                    .date(date)
                    .checkIn(checkIn)
                    .minutesLate(minutesLate)
                    .deductedMinutes(deductedMinutes)
                    .deductionAmount(deductionAmount)
                    .build());
        }

        return dtos;
    }

    private int calculateDeductedMinutes(int minutesLate) {
        if (minutesLate <= 30) return 30;
        return ((minutesLate + 14) / 15) * 15;
    }

    private double getPerMinuteSalary(Long userId) {
        SalaryConfiguration config = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy cấu hình lương"));
        return config.getBasicSalary() / 22 / 8 / 60;
    }
}
