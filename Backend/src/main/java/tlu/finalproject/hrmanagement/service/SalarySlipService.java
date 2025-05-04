package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.SalarySlipDTO;
import tlu.finalproject.hrmanagement.dto.SalarySlipDetailDTO;

import java.util.List;

public interface SalarySlipService {
    List<SalarySlipDTO> getAllSalarySlipsByMonth(String month);
    SalarySlipDetailDTO getSalarySlipDetail(Long userId, String month);
}
