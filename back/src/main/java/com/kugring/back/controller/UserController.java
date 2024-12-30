package com.kugring.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kugring.back.dto.request.user.PatchUserEditRequestDto;
import com.kugring.back.dto.response.user.GetSortedUserResponseDto;
import com.kugring.back.dto.response.user.PatchUserEditResponseDto;
import com.kugring.back.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/manager/{sort}/{name}")
    public ResponseEntity<? super GetSortedUserResponseDto> getSortedUser(
            @PathVariable("sort") String sort,
            @PathVariable("name") String name,
            @AuthenticationPrincipal String userId) {
        ResponseEntity<? super GetSortedUserResponseDto> response = userService.getSortedUser(userId, sort, name);
        return response;
    }

    @PatchMapping("/manager/edit")
    public ResponseEntity<? super PatchUserEditResponseDto> patchMenuSequence(
            @AuthenticationPrincipal String userId,
            @RequestBody @Valid PatchUserEditRequestDto requestBody) {
        ResponseEntity<? super PatchUserEditResponseDto> response = userService.patchUserEdit(userId, requestBody);
        return response;
    }
}
