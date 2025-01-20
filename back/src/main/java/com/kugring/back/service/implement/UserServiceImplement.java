package com.kugring.back.service.implement;

import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<? super GetSortedUserResponseDto> getSortedUser(String userId, int page, int size,
            String Name, String Sort) {
        // 정렬 기준에 따른 데이터 조회
        List<GetSortedUserResultSet> sortedUsers;

        try {

            // userId로 관리자 계정 조회
            User manager = userRepository.findByUserId(userId);
            // 정보가 없거나 관리자가 아니라면 실패 응답 반환
            if (manager == null || !manager.getRole().trim().equals("ROLE_ADMIN")) {
                return PinCheckResponseDto.pinCheckFail();
            }

            // 스크롤 이벤트로 인한 데이터 가져오게 도와주는것
            Pageable pageable = PageRequest.of(page, size);

            // 상태에 정의
            String sort = Objects.isNull(Sort) ? null : "모두".equals(Sort) ? null : Sort;

            String pin = null;

            String name = Name;

            // Name이 숫자로 된 4자리인지 확인
            if (name != null && name.matches("\\d+")) {
                pin = name; // 숫자로 된 4자리라면 pin에 저장
                name = null; // name은 null로 설정
            }


            // 정렬 기준에 맞게 사용자 목록과 지출 합계를 가져옴
            sortedUsers = userRepository.findSortedUser(sort, name, pin, pageable);

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
            user.setDivision(dto.getDivision());
            user.setPosition(dto.getPosition());
            user.setNickname(dto.getNickname());
            user.setPhoneNumber(dto.getPhoneNumber());
            user.setInitialName(dto.getInitialName());
            user.setProfileImage(dto.getProfileImage());
            user.setType("단체".equals(dto.getDivision()) ? 2 : 1);
            userRepository.save(user);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PatchUserEditResponseDto.success();
    }
}
