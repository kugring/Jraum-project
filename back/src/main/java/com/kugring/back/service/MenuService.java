package com.kugring.back.service;

import org.springframework.http.ResponseEntity;
import com.kugring.back.dto.response.menu.GetActiveMenuResponseDto;

public interface MenuService {
      ResponseEntity<? super GetActiveMenuResponseDto> getActiveMenu();
}
