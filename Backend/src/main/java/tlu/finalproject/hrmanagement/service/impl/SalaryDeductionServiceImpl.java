// ServiceImpl
package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.SalaryDeductionDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.SalaryDeduction;
import tlu.finalproject.hrmanagement.model.User;
import tlu.finalproject.hrmanagement.repository.SalaryDeductionRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.SalaryDeductionService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryDeductionServiceImpl implements SalaryDeductionService {
    private final SalaryDeductionRepository repository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;

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
}
