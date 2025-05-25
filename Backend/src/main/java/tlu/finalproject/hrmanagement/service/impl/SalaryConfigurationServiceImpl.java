package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.SalaryConfigurationDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.SalaryConfiguration;
import tlu.finalproject.hrmanagement.model.User;
import tlu.finalproject.hrmanagement.repository.SalaryConfigurationRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.SalaryConfigurationService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaryConfigurationServiceImpl implements SalaryConfigurationService {

    private final SalaryConfigurationRepository salaryConfigurationRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<SalaryConfigurationDTO> getAllSalaryConfig() {
        List<SalaryConfiguration> salaryConfigurations = salaryConfigurationRepository.findAll();
        return salaryConfigurations.stream()
                .map(salaryConfiguration -> modelMapper.map(salaryConfiguration, SalaryConfigurationDTO.class))
                .toList();
    }

    @Override
    public SalaryConfigurationDTO getByUserId(Long userId) {
        SalaryConfiguration salaryConfiguration = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cấu hình lương không tồn tại cho người dùng với ID: " + userId));
        return modelMapper.map(salaryConfiguration, SalaryConfigurationDTO.class);
    }

    @Override
    public SalaryConfigurationDTO createSalaryConfiguration(SalaryConfigurationDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại với ID: " + dto.getUserId()));

        SalaryConfiguration salaryConfiguration = modelMapper.map(dto, SalaryConfiguration.class);
        salaryConfiguration.setUser(user);

        SalaryConfiguration saved = salaryConfigurationRepository.save(salaryConfiguration);

        return modelMapper.map(saved, SalaryConfigurationDTO.class);
    }

    @Override
    public SalaryConfigurationDTO updateSalaryConfiguration(Long userId, SalaryConfigurationDTO dto) {
        SalaryConfiguration salaryConfiguration = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cấu hình lương không tồn tại cho người dùng với ID: " + userId));

        salaryConfiguration.setBasicSalary(dto.getBasicSalary());
        salaryConfiguration.setStandardWorkingDays(dto.getStandardWorkingDays());
        salaryConfiguration.setDayOvertimeRate(dto.getDayOvertimeRate());
        salaryConfiguration.setNightOvertimeRate(dto.getNightOvertimeRate());
        salaryConfiguration.setHolidayOvertimeRate(dto.getHolidayOvertimeRate());
        salaryConfiguration.setOtherAllowances(dto.getOtherAllowances());
        salaryConfiguration.setInsuranceBaseSalary(dto.getInsuranceBaseSalary());
        salaryConfiguration.setWorkStartTime(dto.getWorkStartTime());
        salaryConfiguration.setWorkEndTime(dto.getWorkEndTime());
        salaryConfiguration.setBreakDurationMinutes(dto.getBreakDurationMinutes());
        salaryConfiguration.setNumberOfDependents(dto.getNumberOfDependents());

        SalaryConfiguration saved = salaryConfigurationRepository.save(salaryConfiguration);

        return modelMapper.map(saved, SalaryConfigurationDTO.class);
    }

    @Override
    public boolean deleteByUserId(Long userId) {
        SalaryConfiguration salaryConfiguration = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cấu hình lương không tồn tại cho người dùng với ID: " + userId));

        salaryConfigurationRepository.delete(salaryConfiguration);

        return true;
    }
}
