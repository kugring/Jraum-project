package com.kugring.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/manager/sorted")
    public ResponseEntity<? super GetSortedUserResponseDto> getSortedUser(
            @AuthenticationPrincipal String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String sort) {
        ResponseEntity<? super GetSortedUserResponseDto> response = userService.getSortedUser(userId,  page, size, name, sort);
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
