package com.camerannonces.service;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class EmailService {

    /**
     * Générer un code de vérification à 4 chiffres
     */
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 1000 + random.nextInt(9000);
        return String.valueOf(code);
    }

    /**
     * Envoyer un email de vérification
     * Pour l'instant: juste logger le code (pas d'email réel)
     */
    public void sendVerificationEmail(String email, String code) {
        // TODO: Intégrer un vrai service d'email (SendGrid, Mailgun, AWS SES)

        // Pour l'instant: juste logger
        System.out.println("========================================");
        System.out.println("📧 EMAIL DE VÉRIFICATION");
        System.out.println("Destinataire: " + email);
        System.out.println("Code: " + code);
        System.out.println("========================================");

        // Exemple avec System email (ne marche pas en production!)
        // Dans le vrai, tu utiliseras SendGrid API:
        // sendGridClient.send(email, "Votre code: " + code);
    }
}