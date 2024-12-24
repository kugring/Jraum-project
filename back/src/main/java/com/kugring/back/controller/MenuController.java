package com.kugring.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.kugring.back.dto.request.menu.PatchMenuRequestDto;
import com.kugring.back.dto.request.menu.PatchMenuSequenceRequestDto;
import com.kugring.back.dto.request.menu.PostMenuRequestDto;
import com.kugring.back.dto.response.menu.GetActiveMenuResponseDto;
import com.kugring.back.dto.response.menu.GetMenuPageResponseDto;
import com.kugring.back.dto.response.menu.PatchMenuResponseDto;
import com.kugring.back.dto.response.menu.PatchMenuSequenceResponseDto;
import com.kugring.back.dto.response.menu.PostMenuResponseDto;
import com.kugring.back.dto.response.option.GetMenuOptionResponseDto;
import com.kugring.back.service.MenuService;
import com.kugring.back.service.OptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/api/v1/menu")
@RequiredArgsConstructor
public class MenuController {

  private final MenuService menuService;
  private final OptionService optionService;

  @GetMapping("/active")
  public ResponseEntity<? super GetActiveMenuResponseDto> getActiveMenu() {
    ResponseEntity<? super GetActiveMenuResponseDto> response = menuService.getActiveMenu();
    return response;
  }

  @GetMapping("/{menuId}/option")
  public ResponseEntity<? super GetMenuOptionResponseDto> getActiveMenu(@PathVariable("menuId") Long menuId) {
    ResponseEntity<? super GetMenuOptionResponseDto> response = optionService.getMenuOption(menuId);
    return response;
  }

  @GetMapping("/manager/menuPage/{category}")
  public ResponseEntity<? super GetMenuPageResponseDto> getMenuPage(
      @AuthenticationPrincipal String userId,
      @PathVariable("category") String category) {
    ResponseEntity<? super GetMenuPageResponseDto> response = menuService.getMenuPage(userId, category);
    return response;
  }

  @PatchMapping("/manager/menuPage/sequence")
  public ResponseEntity<? super PatchMenuSequenceResponseDto> patchMenuSequence(
      @AuthenticationPrincipal String userId,
      @RequestBody @Valid PatchMenuSequenceRequestDto requestBody) {
    ResponseEntity<? super PatchMenuSequenceResponseDto> response = menuService.patchMenuSequence(userId, requestBody);
    return response;
  }

  @PostMapping("")
  public ResponseEntity<? super PostMenuResponseDto> postMenu(
      @AuthenticationPrincipal String userId,
      @RequestBody @Valid PostMenuRequestDto requestBody) {
    ResponseEntity<? super PostMenuResponseDto> response = menuService.postMenu(userId, requestBody);
    return response;
  }

  @PatchMapping("")
  public ResponseEntity<? super PatchMenuResponseDto> patchMenu(
      @AuthenticationPrincipal String userId,
      @RequestBody @Valid PatchMenuRequestDto requestBody) {
    ResponseEntity<? super PatchMenuResponseDto> response = menuService.patchMenu(userId, requestBody);
    return response;
  }

  // @PatchMapping("/{menuId}")
  // public ResponseEntity<? super PatchMenuResponseDto> patchMenu(@RequestBody
  // @Valid
  // PatchMenuRequestDto requestBody,
  // @PathVariable("menuId") Integer menuId) {
  // ResponseEntity<? super PatchMenuResponseDto> response =
  // menuService.patchMenu(menuId,
  // requestBody);
  // return response;
  // }

}
