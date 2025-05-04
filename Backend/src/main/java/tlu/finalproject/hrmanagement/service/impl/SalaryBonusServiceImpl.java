package tlu.finalproject.hrmanagement.service.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import tlu.finalproject.hrmanagement.dto.SalaryBonusDTO;
import tlu.finalproject.hrmanagement.exception.ResourceNotFoundException;
import tlu.finalproject.hrmanagement.model.SalaryBonus;
import tlu.finalproject.hrmanagement.model.User;
import tlu.finalproject.hrmanagement.repository.SalaryBonusRepository;
import tlu.finalproject.hrmanagement.repository.UserRepository;
import tlu.finalproject.hrmanagement.service.SalaryBonusService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryBonusServiceImpl implements SalaryBonusService {
    private final SalaryBonusRepository repository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    @Override
    public List<SalaryBonusDTO> getAllByUserId(Long userId) {
        return repository.findByUserUserId(userId)
                .stream()
                .map(b -> mapper.map(b, SalaryBonusDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public SalaryBonusDTO create(SalaryBonusDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng có ID: " + dto.getUserId()));
        SalaryBonus bonus = mapper.map(dto, SalaryBonus.class);
        bonus.setUser(user);
        return mapper.map(repository.save(bonus), SalaryBonusDTO.class);
    }

    @Override
    public SalaryBonusDTO update(Long id, SalaryBonusDTO dto) {
        SalaryBonus existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoản thưởng có ID: " + id));

        existing.setBonusType(dto.getBonusType());
        existing.setAmount(dto.getAmount());
        existing.setBonusDate(dto.getBonusDate());

        return mapper.map(repository.save(existing), SalaryBonusDTO.class);
    }

    @Override
    public boolean delete(Long id) {
        SalaryBonus existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoản thưởng có ID: " + id));
        repository.delete(existing);
        return true;
    }
}
