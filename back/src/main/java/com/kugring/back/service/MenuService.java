package com.kugring.back.service;

import org.springframework.http.ResponseEntity;
import com.kugring.back.dto.response.menu.GetMenuPageResponseDto;
import com.kugring.back.dto.response.menu.PatchMenuResponseDto;
import com.kugring.back.dto.request.menu.PatchMenuRequestDto;
import com.kugring.back.dto.request.menu.PatchMenuSequenceRequestDto;
import com.kugring.back.dto.request.menu.PostMenuRequestDto;
import com.kugring.back.dto.response.menu.GetActiveMenuResponseDto;
import com.kugring.back.dto.response.menu.PatchMenuSequenceResponseDto;
import com.kugring.back.dto.response.menu.PostMenuResponseDto;

public interface MenuService {

      ResponseEntity<? super PostMenuResponseDto> postMenu(String userId, PostMenuRequestDto dto);
      ResponseEntity<? super PatchMenuResponseDto> patchMenu(String userId, PatchMenuRequestDto dto);
      ResponseEntity<? super GetMenuPageResponseDto> getMenuPage(String userId, String category);
      ResponseEntity<? super GetActiveMenuResponseDto> getActiveMenu();
      ResponseEntity<? super PatchMenuSequenceResponseDto> patchMenuSequence(String userId, PatchMenuSequenceRequestDto dto);
}
