package com.kugring.back.service;

import org.springframework.http.ResponseEntity;
import com.kugring.back.dto.response.menu.GetActiveMenuResponseDto;
import com.kugring.back.dto.response.option.GetMenuOptionResponseDto;

public interface MenuService {
    
      ResponseEntity<? super GetActiveMenuResponseDto> getActiveMenu();

      
}
