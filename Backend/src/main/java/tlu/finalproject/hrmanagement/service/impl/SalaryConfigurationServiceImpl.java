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

        salaryConfigurationRepository.save(salaryConfiguration);

        return "Cấu hình lương đã được tạo mới hoặc cập nhật thành công!";
    }

    @Override
    public SalaryConfigurationDTO updateSalaryConfiguration(Long userId, SalaryConfigurationDTO dto) {
        SalaryConfiguration salaryConfiguration = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cấu hình lương không tồn tại cho người dùng với ID: " + userId));

        salaryConfiguration.setBasicSalary(dto.getBasicSalary());
        salaryConfiguration.setBonusRate(dto.getBonusRate());
        salaryConfiguration.setOtherAllowances(dto.getOtherAllowances());
        salaryConfiguration.setOvertimeRate(dto.getOvertimeRate());

        salaryConfigurationRepository.save(salaryConfiguration);

        return "Cấu hình lương của người dùng đã được cập nhật thành công!";
    }

    @Override
    public boolean deleteByUserId(Long userId) {
        SalaryConfiguration salaryConfiguration = salaryConfigurationRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cấu hình lương không tồn tại cho người dùng với ID: " + userId));

        salaryConfigurationRepository.delete(salaryConfiguration);

        return "Cấu hình lương của người dùng đã được xóa thành công!";
    }
}
