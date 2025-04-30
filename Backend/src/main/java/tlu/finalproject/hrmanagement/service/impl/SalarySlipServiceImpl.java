package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.PositionDTO;
import tlu.finalproject.hrmanagement.dto.SalarySlipDTO;
import tlu.finalproject.hrmanagement.repository.SalarySlipRepository;
import tlu.finalproject.hrmanagement.service.SalarySlipService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalarySlipServiceImpl implements SalarySlipService {
    private final SalarySlipRepository salarySlipRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<SalarySlipDTO> getAllSalarySlipsByMonth(String month) {
        return salarySlipRepository.findByMonth(month).stream()
                .map(slip -> modelMapper.map(slip, SalarySlipDTO.class))
                .collect(Collectors.toList());
    }
}
