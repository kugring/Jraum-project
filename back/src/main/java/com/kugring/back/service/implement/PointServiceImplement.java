package com.kugring.back.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.kugring.back.dto.request.point.PostPointChargeRequestDto;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.response.point.DeletePointChargeResponseDto;
import com.kugring.back.dto.response.point.GetPointChargependingCountResponseDto;
import com.kugring.back.dto.response.point.PostPointChargeResponseDto;
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
  public ResponseEntity<? super GetPointChargependingCountResponseDto> getPointChargependingCount(Long pointChargeId, String userId) {

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

  @Override @Transactional
  public ResponseEntity<? super DeletePointChargeResponseDto> deletePointCharge(Long pointChargeId, String userId) {

    try {
      pointChargeRepositoy.deleteByPointChargeIdAndUser_UserId(pointChargeId, userId);
    } catch (Exception exception) {
      exception.printStackTrace();
      return ResponseDto.databaseError();
    }
    return DeletePointChargeResponseDto.success();
    
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
