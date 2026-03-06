package com.camerannonces.dto;

import lombok.Data;

@Data
public class VerifySmsRequest {
    private String telephone; // Full number with country code
    private String code;      // 4-digit verification code
}