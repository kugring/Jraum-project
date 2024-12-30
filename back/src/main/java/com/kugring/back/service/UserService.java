package com.kugring.back.service;

import org.springframework.http.ResponseEntity;

import com.kugring.back.dto.request.user.PatchUserEditRequestDto;
import com.kugring.back.dto.response.user.GetSortedUserResponseDto;
import com.kugring.back.dto.response.user.PatchUserEditResponseDto;


public interface UserService {

  ResponseEntity<? super GetSortedUserResponseDto> getSortedUser(String userId, String sort, String name);
  ResponseEntity<? super PatchUserEditResponseDto> patchUserEdit(String userId, PatchUserEditRequestDto dto);



  
  // ResponseEntity<? super PointDirectChargeResponseDto> pointDirectCharge(PointDirectChargeRequestDto dto);


  // ResponseEntity<? super ApprovalPointChargeResponseDto> approvePointCharge(ApprovalPointChargeRequestDto dto);

}
