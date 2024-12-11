package com.kugring.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import com.kugring.back.dto.response.menu.GetActiveMenuResponseDto;
import com.kugring.back.dto.response.option.GetMenuOptionResponseDto;
import com.kugring.back.service.MenuService;
import com.kugring.back.service.OptionService;
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

  // @PostMapping("")
  // public ResponseEntity<? super PostMenuResponseDto> getMenuList(@RequestBody @Valid
  // PostMenuRequestDto requestBody) {
  // ResponseEntity<? super PostMenuResponseDto> response = menuService.postMenu(requestBody);
  // return response;
  // }

  // @PatchMapping("/{menuId}")
  // public ResponseEntity<? super PatchMenuResponseDto> patchMenu(@RequestBody @Valid
  // PatchMenuRequestDto requestBody,
  // @PathVariable("menuId") Integer menuId) {
  // ResponseEntity<? super PatchMenuResponseDto> response = menuService.patchMenu(menuId,
  // requestBody);
  // return response;
  // }

}
