package com.kugring.back.service.implement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.kugring.back.dto.request.point.PointChargeApprovalRequestDto;
import com.kugring.back.dto.request.point.PointChargeDeclineRequestDto;
import com.kugring.back.dto.request.point.PointDirectChargeReuqestDto;
import com.kugring.back.dto.request.point.PostPointChargeRequestDto;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.response.auth.PinCheckResponseDto;
import com.kugring.back.dto.response.point.DeletePointChargeResponseDto;
import com.kugring.back.dto.response.point.GetChargeListResponseDto;
import com.kugring.back.dto.response.point.GetPointChargePendingResponseDto;
import com.kugring.back.dto.response.point.GetPointChargependingCountResponseDto;
import com.kugring.back.dto.response.point.PointChargeApprovalResponseDto;
import com.kugring.back.dto.response.point.PointChargeDeclineResponseDto;
import com.kugring.back.dto.response.point.PointDirectChargeResponseDto;
import com.kugring.back.dto.response.point.PostPointChargeResponseDto;
import com.kugring.back.dto.response.user.PatchUserEditResponseDto;
import com.kugring.back.entity.PointCharge;
import com.kugring.back.entity.User;
import com.kugring.back.repository.PointChargeRepositoy;
import com.kugring.back.repository.UserRepository;
import com.kugring.back.service.PointService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PointServiceImplement implements PointService {

  private final UserRepository userRepository;
  private final PointChargeRepositoy pointChargeRepositoy;

  @Override
  public ResponseEntity<? super PostPointChargeResponseDto> postPointCharge(PostPointChargeRequestDto dto,
      String userId) {

    Long pointChargeId = null;

    try {
      // Dto에서 필요한 정보 가져오기
      int chargePoint = dto.getChargePoint();

      // 회원 조회
      User User = userRepository.findByUserId(userId);
      // 등록된 회원이 아닌 경우 예외처리
      if (User == null)
        return PostPointChargeResponseDto.noExistUser();

      // 회원 현재_포인트 + 포인트 관련 예외처리
      int currentPoint = User.getPoint();
      if (chargePoint < 0)
        return PostPointChargeResponseDto.pointChargeFail();
      if (currentPoint < 0)
        return PostPointChargeResponseDto.pointChargeFail();

      // 포인트 엔터티 생성
      PointCharge PointCharge = new PointCharge(User, currentPoint, chargePoint);
      PointCharge savedPointCharge = pointChargeRepositoy.save(PointCharge);
      pointChargeId = savedPointCharge.getPointChargeId();

    } catch (Exception exception) {
      exception.printStackTrace();
      return ResponseDto.databaseError();
    }

    return PostPointChargeResponseDto.success(pointChargeId);
  }

  // todo: 이놈들 메소드 명이랑 다 바꿔야함
  @Override
  public ResponseEntity<? super GetPointChargependingCountResponseDto> getPointChargependingCount(Long pointChargeId,
      String userId) {

    // 미승인 갯수를 담을 객체
    boolean approve;

    try {
      approve = pointChargeRepositoy.existsByUser_UserIdAndPointChargeIdAndStatus(userId, pointChargeId, "승인");
    } catch (Exception exception) {
      exception.printStackTrace();
      return ResponseDto.databaseError();
    }
    return GetPointChargependingCountResponseDto.success(approve);
  }

  @Override
  @Transactional
  public ResponseEntity<? super DeletePointChargeResponseDto> deletePointCharge(Long pointChargeId, String userId) {

    try {
      pointChargeRepositoy.deleteByPointChargeIdAndUser_UserId(pointChargeId, userId);
    } catch (Exception exception) {
      exception.printStackTrace();
      return ResponseDto.databaseError();
    }
    return DeletePointChargeResponseDto.success();

  }

  @Override
  public ResponseEntity<? super GetPointChargePendingResponseDto> getPointChargePending(String userId) {

    List<PointCharge> pointChargeList = null;

    try {
      // userId로 관리자 계정 조회
      User manager = userRepository.findByUserId(userId);
      // 정보가 없거나 관리자가 아니라면 실패 응답 반환
      if (manager == null || !manager.getRole().trim().equals("ROLE_ADMIN")) {
        return PatchUserEditResponseDto.notExistedManager();
      }
      pointChargeList = pointChargeRepositoy.findByStatus("미승인");
      System.out.println("pointChargeList: " + pointChargeList);

    } catch (Exception exception) {
      exception.printStackTrace();
      return ResponseDto.databaseError();
    }
    return GetPointChargePendingResponseDto.success(pointChargeList);
  }

  @Override
  public ResponseEntity<? super PointChargeApprovalResponseDto> pointChargeApproval(String userId,
      PointChargeApprovalRequestDto dto) {

    try {
      // userId로 관리자 계정 조회
      User manager = userRepository.findByUserId(userId);
      // 정보가 없거나 관리자가 아니라면 실패 응답 반환
      if (manager == null || !manager.getRole().trim().equals("ROLE_ADMIN")) {
        return PatchUserEditResponseDto.notExistedManager();
      }

      // 포인트 충전 내역 가져오기
      PointCharge pointCharge = pointChargeRepositoy.findByPointChargeId(dto.getPointChargeId());
      // 포인트 충전 상태를 승인으로 변경
      pointCharge.setStatus("승인");
      // 포인트를 요청한 회원을 추출
      User user = pointCharge.getUser();
      // 회원의 포인트를 추가해줌
      user.pointCharge(pointCharge.getChargePoint());

      // 포인트 충전내역과 회원정보를 저장함
      pointChargeRepositoy.save(pointCharge);
      userRepository.save(user);

    } catch (Exception exception) {
      exception.printStackTrace();
      return ResponseDto.databaseError();
    }

    return PointChargeApprovalResponseDto.success();
  }

  @Override
  public ResponseEntity<? super PointChargeDeclineResponseDto> pointChargeDecline(String userId,
      PointChargeDeclineRequestDto dto) {
    try {
      // userId로 관리자 계정 조회
      User manager = userRepository.findByUserId(userId);
      // 정보가 없거나 관리자가 아니라면 실패 응답 반환
      if (manager == null || !manager.getRole().trim().equals("ROLE_ADMIN")) {
        return PatchUserEditResponseDto.notExistedManager();
      }

      // 포인트 충전 내역 가져오기
      PointCharge pointCharge = pointChargeRepositoy.findByPointChargeId(dto.getPointChargeId());
      // 포인트 충전 상태를 승인으로 변경
      pointCharge.setStatus("거절");
      // 포인트 충전내역 저장
      pointChargeRepositoy.save(pointCharge);

    } catch (Exception exception) {
      exception.printStackTrace();
      return ResponseDto.databaseError();
    }
    return PointChargeDeclineResponseDto.success();
  }

  @Override
  public ResponseEntity<? super GetChargeListResponseDto> getChargeList(String userId, int page, int size, String Name,
      String Status, String Date) {

    List<PointCharge> pointCharges;

    try {
      // userId로 데이터 조회
      User user = userRepository.findByUserId(userId);
      // 정보가 없다면 예외처리
      if (user == null)
        return GetChargeListResponseDto.managerNotExisted();
      if (!user.getRole().trim().equals("ROLE_ADMIN")) {
        return GetChargeListResponseDto.managerNotExisted();
      }

      // 스크롤 이벤트로 인한 데이터 가져오게 도와주는것
      Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

      // 회원이름 정의
      String name = Objects.isNull(Name) ? null : "".equals(Name) ? null : Name;

      // 상태에 정의
      String status = Objects.isNull(Status) ? null : "모두".equals(Status) ? null : Status;

      // 자바스크립트 Date타입을 LocalDate로 변환
      // 예외 처리를 추가한 경우

      // dateD가 null이 아니면 LocalDateTime으로 변환하고, null일 경우 null을 반환
      LocalDateTime startOfDay = Objects.isNull(Date) ? null : LocalDate.parse(Date).atStartOfDay();
      LocalDateTime endOfDay = Objects.isNull(Date) ? null : LocalDate.parse(Date).atTime(LocalTime.MAX);

      // 레파지토리에서 데이터 찾아옴
      pointCharges = pointChargeRepositoy.findChargeList(name, status, startOfDay, endOfDay, pageable);

    } catch (Exception exception) {
      exception.printStackTrace();
      return ResponseDto.databaseError();
    }

    return GetChargeListResponseDto.success(pointCharges);
  }

  @Override
  public ResponseEntity<? super PointDirectChargeResponseDto> pointDirectCharge(String managerId,
      PointDirectChargeReuqestDto dto) {
    try {

      // userId로 데이터 조회
      User manager = userRepository.findByUserId(managerId);
      // 정보가 없다면 예외처리
      if (manager == null)
        return PinCheckResponseDto.pinCheckFail();
      if (!manager.getRole().trim().equals("ROLE_ADMIN")) {
        return PinCheckResponseDto.pinCheckFail();
      }

      String userId =  dto.getUserId().equals("") ? null : dto.getUserId();

      // Dto에서 필요한 정보 가져오기
      int chargePoint = dto.getChargePoint();

      // 회원 조회
      User user = userRepository.findByUserId(userId);
      // 등록된 회원이 아닌 경우 예외처리
      if (user == null)
        return PointDirectChargeResponseDto.noExistUser();

      // 회원 포인트 충전
      user.pointCharge(chargePoint);

      // 회원 현재_포인트 + 포인트 관련 예외처리
      int currentPoint = user.getPoint();
      if (chargePoint < 0)
        return PostPointChargeResponseDto.pointChargeFail();
      if (currentPoint < 0)
        return PostPointChargeResponseDto.pointChargeFail();

      // 포인트 엔터티 생성
      PointCharge pointCharge = new PointCharge();
      pointCharge.setChargePoint(chargePoint);
      pointCharge.setCreatedAt(LocalDateTime.now());
      pointCharge.setUpdatedAt(LocalDateTime.now());
      pointCharge.setCurrentPoint(user.getPoint());
      pointCharge.setManager(manager);
      pointCharge.setStatus("승인");
      pointCharge.setUser(user);

      // 포인트 내역 생성하고 포인트가 추가된 회원 정보 저장
      pointChargeRepositoy.save(pointCharge);
      userRepository.save(user);

    } catch (Exception exception) {
      exception.printStackTrace();
      return ResponseDto.databaseError();
    }
    return PointDirectChargeResponseDto.success();
  }

  // @Override
  // public ResponseEntity<? super PointDirectChargeResponseDto>
  // pointDirectCharge(PointDirectChargeRequestDto dto) {
  // try {

  // // 예외처리를 위한 데이터 추출
  // String userId = dto.getUserId();
  // int managerId = dto.getManagerId();
  // int chargePoint = dto.getChargePoint();

  // // 찾은 userID로 유저데이터 조회
  // User User = userRepository.findByUserId(userId);

  // // 회원이 아닌 경우 예외처리
  // if(User == null) return PostPointChargeResponseDto.noExistUser();

  // // 회원의 현재 포인트를 가져옴
  // int currentPoint = User.getPoint();
  // if (chargePoint < 0) return PostPointChargeResponseDto.pointChargeFail();
  // if (currentPoint < 0) return PostPointChargeResponseDto.pointChargeFail();
  // if (!managerRepository.existsByManagerId(managerId)) return
  // ApprovalPointChargeResponseDto.noExistManager();

  // // 엔티티 생성 후 저장
  // PointCharge PointCharge = new PointCharge(dto, User, currentPoint);
  // pointChargeRepositoy.save(PointCharge);

  // // 기존 포인트에 충전금액을 더 해준다.
  // User.pointCharge(chargePoint);
  // userRepository.save(User);

  // } catch (Exception exception) {
  // exception.printStackTrace();
  // return ResponseDto.databaseError();
  // }

  // return PointDirectChargeResponseDto.success();
  // }

  // @Override
  // public ResponseEntity<? super ApprovalPointChargeResponseDto>
  // approvePointCharge(ApprovalPointChargeRequestDto dto) {
  // try {
  // // 매니저ID, 포인트충전ID를 변수에 담는다.
  // int managerId = dto.getManagerId();
  // int pointChargeId = dto.getPointChargeId();

  // // 관리자가 아닌 경우 예외처리
  // boolean existedManagerId = managerRepository.existsByManagerId(managerId);
  // if (!existedManagerId) return
  // ApprovalPointChargeResponseDto.noExistManager();

  // // 충전_내역 조회
  // PointCharge PointCharge =
  // pointChargeRepositoy.findByPointChargeId(pointChargeId);
  // // 내역이 없는 경우 예외처리
  // if (PointCharge == null) return
  // ApprovalPointChargeResponseDto.pointChargeFail();
  // // 이미 충전이 진행된 경우 예외처리
  // if (PointCharge.getStatus() == "승인") return
  // ApprovalPointChargeResponseDto.alreadyPointCharge();
  // // 포인트충전ID로 엔티티를 찾고 수정된 데이터를 바꿔준다.
  // PointCharge.approvalPointCharge(dto);

  // // 요청한 회원
  // User User = PointCharge.getUser();
  // // 충전할 포인트
  // int chargePoint = PointCharge.getChargePoint();
  // // 기존 포인트에 충전금액을 더 해준다.
  // User.pointCharge(chargePoint);

  // // 데이터 저장
  // userRepository.save(User);
  // pointChargeRepositoy.save(PointCharge);

  // } catch (Exception exception) {
  // exception.printStackTrace();
  // return ResponseDto.databaseError();
  // }
  // return ApprovalPointChargeResponseDto.success();
  // }

  // @Override
  // public ResponseEntity<? super CancelPointChargeResponseDto>
  // cancelPointCharge(CancelPointChargeRequestDto dto) {
  // try {
  // // dto에서 포인트충전ID를 추출
  // int pointChargeId = dto.getPointChargeId();

  // // 포인트 충전_내역 조회
  // PointCharge PointCharge =
  // pointChargeRepositoy.findByPointChargeId(pointChargeId);
  // // 포인트 충전_내역이 없는 경우 예외처리
  // if(PointCharge == null) return
  // CancelPointChargeResponseDto.CancelPointChargeFail();
  // if(PointCharge.getStatus() != "승인")
  // CancelPointChargeResponseDto.CancelPointChargeFail();

  // // 승인에서 미승인으로 전환
  // PointCharge.setStatus("미승인");
  // // 완료 시간 초기화
  // PointCharge.setApprovalDate(null);
  // // 관리자 번호 초기화
  // PointCharge.setManagerId(0);

  // // 요청자 조회
  // User User = PointCharge.getUser();
  // // 충전 포인트
  // int chargePoint = PointCharge.getChargePoint();
  // // 충전 포인트 회수
  // User.pointPay(chargePoint);

  // pointChargeRepositoy.save(PointCharge);
  // userRepository.save(User);
  // } catch (Exception exception) {
  // exception.printStackTrace();
  // return ResponseDto.databaseError();
  // }

  // return CancelPointChargeResponseDto.success();
  // }

  // @Override
  // public ResponseEntity<? super DeletePointChargeResponseDto>
  // deletePointCharge(DeletePointChargeRequestDto dto) {
  // try {

  // // Dto에서 충전내역 ID 가져옴
  // int pointChargeId = dto.getPointChargeId();

  // // 포인트 충전 내역을 조회
  // PointCharge PointCharge =
  // pointChargeRepositoy.findByPointChargeId(pointChargeId);
  // // 이미 승인 완료되었다면 예외처리 + (미승인 상태에서만 삭제가 가능하다.)
  // if ("승인".equals(PointCharge.getStatus())) {
  // return DeletePointChargeResponseDto.DeletePointChargeFail();
  // }
  // // 데이터 삭제
  // pointChargeRepositoy.delete(PointCharge);

  // } catch (Exception exception) {
  // exception.printStackTrace();
  // ResponseDto.databaseError();
  // }

  // return DeletePointChargeResponseDto.success();
  // }

}
