package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.SalaryConfigurationDTO;

public interface SalaryConfigurationService {
    SalaryConfigurationDTO getByUserId(Long userId);
    String createOrUpdate(SalaryConfigurationDTO dto);
    String updateSalaryConfiguration(Long userId, SalaryConfigurationDTO dto);
    String deleteByUserId(Long userId);
}


