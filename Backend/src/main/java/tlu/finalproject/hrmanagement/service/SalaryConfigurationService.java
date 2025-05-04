package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.SalaryConfigurationDTO;

import java.util.List;

public interface SalaryConfigurationService {
    List<SalaryConfigurationDTO> getAllSalaryConfig();
    SalaryConfigurationDTO getByUserId(Long userId);
    SalaryConfigurationDTO createSalaryConfiguration(SalaryConfigurationDTO dto);
    SalaryConfigurationDTO updateSalaryConfiguration(Long userId, SalaryConfigurationDTO dto);
    boolean deleteByUserId(Long userId);
}


