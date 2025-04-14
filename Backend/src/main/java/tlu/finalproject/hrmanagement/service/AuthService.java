package tlu.finalproject.hrmanagement.service;

import tlu.finalproject.hrmanagement.dto.AuthRequestDTO;

public interface AuthService {
    String login(AuthRequestDTO authRequestDTO);
}
