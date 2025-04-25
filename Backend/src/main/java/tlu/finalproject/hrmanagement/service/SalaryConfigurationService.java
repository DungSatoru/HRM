package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.SalaryConfigurationDTO;

import java.util.List;

public interface SalaryConfigurationService {
    List<SalaryConfigurationDTO> getAllSalaryConfig();
    SalaryConfigurationDTO getByUserId(Long userId);
    String createSalaryConfiguration(SalaryConfigurationDTO dto);
    String updateSalaryConfiguration(Long userId, SalaryConfigurationDTO dto);
    String deleteByUserId(Long userId);
}


