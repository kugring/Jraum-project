package com.kugring.back.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/api/v1/option")
@RequiredArgsConstructor
public class OptionController {


    
    // @GetMapping("/list")
    // public ResponseEntity<? super getOptionResponseDto> getOption() {
    //     ResponseEntity<? super getOptionResponseDto> respone = optionService.getOption();
    //     return respone;
    // }


    // @PostMapping("")
    // public ResponseEntity<? super PostOptionResponseDto> postOption(@RequestBody @Valid PostOptionRequestDto requestBody) {
    //     ResponseEntity<? super PostOptionResponseDto> respone = optionService.postOption(requestBody);
    //     return respone;
    // }

    // @PatchMapping("/{optionId}")
    // public ResponseEntity<? super PatchOptionResponseDto> patchOption(@RequestBody @Valid PatchOptionRequestDto requestBody,
    //         @PathVariable("optionId") int optionId) {
    //     ResponseEntity<? super PatchOptionResponseDto> respone = optionService.patchOption(optionId, requestBody);
    //     return respone;
    // }
}
