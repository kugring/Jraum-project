// package com.kugring.back.service.implement;

// import com.kugring.back.dto.request.manager.AddNewManagerRequestDto;
// import com.kugring.back.dto.response.manager.AddNewManagerResponseDto;
// import com.kugring.back.dto.response.ResponseDto;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import com.kugring.back.service.ManagerService;
// import com.kugring.back.repository.ManagerRepository;
// import com.kugring.back.entity.Manager;
// import jakarta.transaction.Transactional;
// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class ManagerServiceImplement implements ManagerService {

//     // 서버 키는중~~~
//     private final ManagerRepository managerRepository;

//     private Integer managerId;

//     private String managerPin;
//     private String managerPassword;

//     private String newManagerName;
//     private String newManagerPin;
//     private String newManagerDuty;
//     private String newManagerPassword;
    
//     // 새로운 매니저 생성 요청
//     @Override
// 	public ResponseEntity<? super AddNewManagerResponseDto> addNewManager(AddNewManagerRequestDto dto) {

//         try {
//             // dto에서 필요한 정보 꺼내기
//             managerPin = dto.getManagerPin();
//             managerPassword = dto.getManagerPassword();

//             newManagerName = dto.getNewManagerName();
//             newManagerPin = dto.getNewManagerPin();
//             newManagerDuty = dto.getNewManagerDuty();
//             newManagerPassword = dto.getNewManagerPassword();

//             // 매니저 핀과 비밀번호로 매니저 id 가져오기
//             managerId = managerRepository.findIdByManagerPinAndManagerPassword(managerPin, managerPassword);

//             // 매니저 인증이 실패할 경우
//             if (managerId == null) return AddNewManagerResponseDto.managerCertificationFailed();
            
//             // 새로운 매니저 PIN이 중복일 경우
//             if (managerRepository.existsByPin(newManagerPin)) return AddNewManagerResponseDto.duplicateManagerPin();

//             // 새로운 매니저 추가
//             Manager Manager = new Manager(dto);
//             managerRepository.save(Manager);
        
//         } catch (Exception exception) {
//             exception.printStackTrace();
//             return ResponseDto.databaseError();
//         }

//         return AddNewManagerResponseDto.success();
    
// 	}
    









// //   * MenuServiceImplement의 예시 코드 *
// //   private final MenuRepository menuRepository;
// //   private final OptionRepository optionRepository;
// //   private List<Menu> menuEntities;
// //   private List<OptionEntity> optionEntities;

// };
