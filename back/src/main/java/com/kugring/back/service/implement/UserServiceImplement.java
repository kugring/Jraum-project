package com.kugring.back.service.implement;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.kugring.back.dto.request.user.PatchUserEditRequestDto;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.response.auth.PinCheckResponseDto;
import com.kugring.back.dto.response.user.GetSortedUserResponseDto;
import com.kugring.back.dto.response.user.PatchUserEditResponseDto;
import com.kugring.back.entity.User;
import com.kugring.back.repository.UserRepository;
import com.kugring.back.repository.resultSet.GetSortedUserResultSet;
import com.kugring.back.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {
    private final UserRepository userRepository;

    @Override
    public ResponseEntity<? super GetSortedUserResponseDto> getSortedUser(String userId, String sort, String Name) {
        // 정렬 기준에 따른 데이터 조회
        List<GetSortedUserResultSet> sortedUsers;
        try {
            // userId로 관리자 계정 조회
            User manager = userRepository.findByUserId(userId);
            // 정보가 없거나 관리자가 아니라면 실패 응답 반환
            if (manager == null || !manager.getRole().trim().equals("ROLE_ADMIN")) {
                return PinCheckResponseDto.pinCheckFail();
            }

            String pin = null;
            String name = "all".equals(Name) ? null : Name;

            // Name이 숫자로 된 4자리인지 확인
            if (name != null && name.matches("\\d+")) {
                pin = name; // 숫자로 된 4자리라면 pin에 저장
                name = null; // name은 null로 설정
            }
            System.out.println("이름: " + name);
            System.out.println("핀번호: " + pin);

            // 정렬 기준에 맞게 사용자 목록과 지출 합계를 가져옴
            sortedUsers = userRepository.findSortedUser(sort, name, pin);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetSortedUserResponseDto.success(sortedUsers);

    }

    @Override
    public ResponseEntity<? super PatchUserEditResponseDto> patchUserEdit(String userId, PatchUserEditRequestDto dto) {
        try {
            // userId로 관리자 계정 조회
            User manager = userRepository.findByUserId(userId);
            // 정보가 없거나 관리자가 아니라면 실패 응답 반환
            if (manager == null || !manager.getRole().trim().equals("ROLE_ADMIN")) {
                return PatchUserEditResponseDto.notExistedManager();
            }

            User user = userRepository.findByUserId(dto.getUserId());
            if (user == null) {
                return PatchUserEditResponseDto.notExistedUser();
            }

            // 원래 본인의 정보라면 중복검사는 통과
            boolean existsPin = userRepository.existsByPin(dto.getPin());
            if (!user.getPin().equals(dto.getPin()) && existsPin) {
                return PatchUserEditResponseDto.duplicatePin();
            }
            boolean existsNickname = userRepository.existsByNickname(dto.getNickname());
            if (!user.getNickname().equals(dto.getNickname()) && existsNickname) {
                return PatchUserEditResponseDto.duplicateNickname();
            }

            user.setPin(dto.getPin());
            user.setName(dto.getName());
            user.setOffice(dto.getOffice());
            user.setPosition(dto.getPosition());
            user.setNickname(dto.getNickname());
            user.setPhoneNumber(dto.getPhoneNumber());
            user.setInitialName(dto.getInitialName());
            user.setProfileImage(dto.getProfileImage());
            user.setType("단체".equals(dto.getOffice()) ? 2 : 1);
            userRepository.save(user);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PatchUserEditResponseDto.success();
    }
}
