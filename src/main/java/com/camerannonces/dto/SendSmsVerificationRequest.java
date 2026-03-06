package com.camerannonces.dto;

import lombok.Data;

@Data
public class SendSmsVerificationRequest {
    private String telephone; // Full number with country code (e.g., 237698123456)
}