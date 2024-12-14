// package com.kugring.back.service.implement;

// import com.kugring.back.dto.request.auth.PinCheckRequestDto;
// import com.kugring.back.dto.request.manager.AddNewManagerRequestDto;
// import com.kugring.back.dto.response.manager.AddNewManagerResponseDto;
// import com.kugring.back.dto.response.manager.PinCheckManagerResponseDto;
// import com.kugring.back.dto.response.ResponseDto;

// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import com.kugring.back.service.ManagerService;
// import com.kugring.back.repository.ManagerRepository;
// import com.kugring.back.entity.Manager;
// import com.kugring.back.provider.JwtProvider;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class ManagerServiceImplement implements ManagerService {

//     // 서버 키는중~~~
//     private final ManagerRepository managerRepository;
//     private final JwtProvider jwtProvider;

//     // 새로운 매니저 생성 요청
//     @Override
//     public ResponseEntity<? super AddNewManagerResponseDto> addNewManager(AddNewManagerRequestDto dto) {
//         try {
//             // dto에서 필요한 정보 꺼내기
//             String managerPin = dto.getManagerPin();
//             String managerPassword = dto.getManagerPassword();
//             String newManagerPin = dto.getNewManagerPin();

//             // 매니저 핀과 비밀번호로 매니저 id 가져오기
//             Integer managerId = managerRepository.findIdByManagerPinAndManagerPassword(managerPin, managerPassword);

//             // 매니저 인증이 실패할 경우
//             if (managerId == null)
//                 return AddNewManagerResponseDto.managerCertificationFailed();

//             // 새로운 매니저 PIN이 중복일 경우
//             if (managerRepository.existsByPin(newManagerPin))
//                 return AddNewManagerResponseDto.duplicateManagerPin();

//             // 새로운 매니저 추가
//             Manager Manager = new Manager(dto);
//             managerRepository.save(Manager);

//         } catch (Exception exception) {
//             exception.printStackTrace();
//             return ResponseDto.databaseError();
//         }

//         return AddNewManagerResponseDto.success();

//     }

//     @Override
//     public ResponseEntity<? super PinCheckManagerResponseDto> pinCheck(PinCheckRequestDto dto) {

//         Manager manager;
//         String token;
//         try {

//             manager = managerRepository.findByPin(dto.getPin());

//             // 정보가 없다면 예외처리
//             if (manager == null)
//                 return PinCheckManagerResponseDto.pinCheckFail();

//             token = jwtProvider.create(manager.getName());

//         } catch (Exception exception) {
//             exception.printStackTrace();
//             return ResponseDto.databaseError();
//         }

//         return PinCheckManagerResponseDto.success(manager, token);
//     }

// };
