package com.kugring.back.service;

import org.springframework.http.ResponseEntity;
import com.kugring.back.dto.response.menu.GetMenuPageResponseDto;
import com.kugring.back.dto.request.menu.PatchMenuSequenceRequestDto;
import com.kugring.back.dto.response.menu.GetActiveMenuResponseDto;
import com.kugring.back.dto.response.menu.PatchMenuSequenceResponseDto;

public interface MenuService {
      ResponseEntity<? super GetMenuPageResponseDto> getMenuPage(String userId, String category);
      ResponseEntity<? super GetActiveMenuResponseDto> getActiveMenu();
      ResponseEntity<? super PatchMenuSequenceResponseDto> patchMenuSequence(String userId, PatchMenuSequenceRequestDto dto);
}
