package com.kugring.back.service;

import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.request.auth.PinCheckRequestDto;
import com.kugring.back.dto.request.manager.AddNewManagerRequestDto;
import com.kugring.back.dto.response.manager.AddNewManagerResponseDto;
import com.kugring.back.dto.response.manager.PinCheckManagerResponseDto;

public interface ManagerService {

    ResponseEntity<? super PinCheckManagerResponseDto> pinCheck(PinCheckRequestDto dto);

    ResponseEntity<? super AddNewManagerResponseDto> addNewManager(AddNewManagerRequestDto dto);

    
}