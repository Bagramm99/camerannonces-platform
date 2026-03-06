package com.camerannonces.service;

import com.africastalking.AfricasTalking;
import com.africastalking.SmsService;
import com.africastalking.sms.Recipient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Random;

@Service
public class AfricasTalkingSmsService {

    @Value("${africastalking.username}")
    private String username;

    @Value("${africastalking.api-key}")
    private String apiKey;

    private SmsService smsService;

    @PostConstruct
    public void initialize() {
        // Initialize Africa's Talking
        AfricasTalking.initialize(username, apiKey);
        this.smsService = AfricasTalking.getService(AfricasTalking.SERVICE_SMS);
    }

    /**
     * Generate 4-digit verification code
     */
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 1000 + random.nextInt(9000);
        return String.valueOf(code);
    }

    /**
     * Send SMS verification code
     * @param phoneNumber Must include country code (e.g., +237698123456)
     * @param code 4-digit verification code
     */
    public void sendVerificationSms(String phoneNumber, String code) throws IOException {
        // Ensure phone number starts with +
        if (!phoneNumber.startsWith("+")) {
            phoneNumber = "+" + phoneNumber;
        }

        String message = "Votre code de verification CamerAnnonces est: " + code +
                ". Ce code expire dans 4 minutes.";

        try {
            List<Recipient> response = smsService.send(message, new String[]{phoneNumber}, true);

            // Check if SMS was sent successfully
            for (Recipient recipient : response) {
                System.out.println("✅ SMS sent to: " + recipient.number);
                System.out.println("Status: " + recipient.status);
                System.out.println("Message ID: " + recipient.messageId);
            }
        } catch (IOException e) {
            System.err.println("❌ Failed to send SMS: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Send SMS (generic method)
     */
    public void sendSms(String phoneNumber, String message) throws IOException {
        if (!phoneNumber.startsWith("+")) {
            phoneNumber = "+" + phoneNumber;
        }

        smsService.send(message, new String[]{phoneNumber}, true);
    }
}