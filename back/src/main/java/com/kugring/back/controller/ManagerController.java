// package com.kugring.back.controller;

// import com.kugring.back.service.ManagerService;
// import com.kugring.back.dto.request.manager.AddNewManagerRequestDto;
// import com.kugring.back.dto.response.manager.AddNewManagerResponseDto;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PatchMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;

// // 컨트롤러를 만드려면 서비스가 필요하고, 서비스를 만드려면 dto와 Implement가 필요하다.
// // 또한 dto, 엔티티, 리포는 어떻게 사용할지도 정해야 한다.
// // dto, 엔티티, 리포에 관한 것들은 만들고자 하는 기능에 따라 정해지므로, 가장 먼저 무슨 기능을 만들지 정해야 한다.
// // 그러므로 작업 순서는 다음과 같다.

// // 1. 컨트롤러가 다룰 요청과 반응 명세서 작성
// // 2. 1에 기반하여 엔티티, 리포 및 dto 명세서 작성
// // 3. 서비스 인터페이스의 기본틀 작성
// // 4. Implement 기본틀 작성하고 3의 서비스와 연결하기
// // 5-1. 1의 명세서에서 하나의 항목을 골라 거기에 쓰일 dto를 만든다.
// // 5-2. 5-1에서 만든 dto를 사용해 서비스 인터페이스에 메소드를 추가한다.
// // 5-3. Implement에서 umimplemented를 implement 완료한다.
// //  * 명세서의 모든 요청과 반응들을 완성할 때까지 5번 과정을 반복한다. *
// //  * 모든 코드에는 어떤 요청 또는 반응에 대한 코드인지를 알 수 있게 공통된 주석을 달도록 한다 *
// // 6. controller를 완성한다.



// // 염탐할거면 아래의 진행상황을 볼 것!!!
// // ㅎㅎ 염탐은 최대한 안했다! 서버 키는중~~ 아 시큐리 설정 안했당

// // 현재 모든 과정 완료됨 ... 안다! 고맙다ㅎㅎ 으악! XㅂX


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

// }

