package com.kugring.back.service;

import org.springframework.http.ResponseEntity;
import com.kugring.back.dto.response.option.GetMenuOptionResponseDto;

public interface OptionService {


    ResponseEntity<? super GetMenuOptionResponseDto> getMenuOption(Long menuId);
}
