package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.AuthRequestDTO;
import tlu.finalproject.hrmanagement.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO login(AuthRequestDTO authRequestDTO);
}
