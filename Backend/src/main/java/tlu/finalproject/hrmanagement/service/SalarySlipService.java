package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.SalarySlipDTO;

import java.util.List;

public interface SalarySlipService {
    List<SalarySlipDTO> getAllSalarySlipsByMonth(String month);
}
