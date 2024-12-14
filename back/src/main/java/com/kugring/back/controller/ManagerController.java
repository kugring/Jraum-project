// package com.kugring.back.controller;

// import com.kugring.back.service.ManagerService;
// import com.kugring.back.dto.request.auth.PinCheckRequestDto;
// import com.kugring.back.dto.request.manager.AddNewManagerRequestDto;
// import com.kugring.back.dto.response.manager.AddNewManagerResponseDto;
// import com.kugring.back.dto.response.manager.PinCheckManagerResponseDto;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;


// @RestController
// @RequestMapping("/api/v1/manager")
// @RequiredArgsConstructor
// public class ManagerController {

//   private final ManagerService managerService;

//   @PostMapping("/add-new-manager")
//   public ResponseEntity<? super AddNewManagerResponseDto> addNewManager(@RequestBody @Valid AddNewManagerRequestDto requestBody) {
//     ResponseEntity<? super AddNewManagerResponseDto> response = managerService.addNewManager(requestBody);
//     return response;
//   }
  
//   @PostMapping("/pin-check")
//   public ResponseEntity<? super PinCheckManagerResponseDto> pinCheck(@RequestBody @Valid PinCheckRequestDto requestBody) {
//     ResponseEntity<? super PinCheckManagerResponseDto> response = managerService.pinCheck(requestBody);
//     return response;
//   }

// }

