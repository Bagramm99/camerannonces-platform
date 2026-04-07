package com.camerannonces.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Random;

/**
 * Service d'envoi d'emails avec SendGrid
 * Localisation: src/main/java/com/camerannonces/service/EmailService.java
 */
@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Value("${sendgrid.from.name}")
    private String fromName;

    /**
     * Générer un code de vérification à 4 chiffres
     */
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 1000 + random.nextInt(9000);
        return String.valueOf(code);
    }

    /**
     * Envoyer un email de vérification avec SendGrid
     */
    public void sendVerificationEmail(String toEmail, String code) {
        try {
            System.out.println("📧 Envoi email de vérification à: " + toEmail);

            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            String subject = "🔐 Votre code de vérification CamerAnnonces";

            Content content = new Content("text/html", createVerificationEmailHtml(code));
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ Email de vérification envoyé avec succès!");
                System.out.println("📧 Status code: " + response.getStatusCode());
            } else {
                System.err.println("❌ Erreur lors de l'envoi de l'email!");
                System.err.println("📧 Status: " + response.getStatusCode());
                System.err.println("📧 Body: " + response.getBody());
                // Fallback: Console logging
                logEmailToConsole(toEmail, code, "VERIFICATION");
            }

        } catch (IOException e) {
            System.err.println("❌ Erreur SendGrid: " + e.getMessage());
            e.printStackTrace();
            // Fallback: Console logging si SendGrid échoue
            logEmailToConsole(toEmail, code, "VERIFICATION");
        }
    }

    /**
     * Envoyer un email de bienvenue
     */
    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            System.out.println("📧 Envoi email de bienvenue à: " + toEmail);

            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            String subject = "🎉 Bienvenue sur CamerAnnonces!";

            Content content = new Content("text/html", createWelcomeEmailHtml(userName));
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ Email de bienvenue envoyé avec succès!");
            } else {
                System.err.println("❌ Email de bienvenue échoué: " + response.getStatusCode());
            }

        } catch (IOException e) {
            System.err.println("❌ Erreur SendGrid: " + e.getMessage());
            logEmailToConsole(toEmail, userName, "WELCOME");
        }
    }

    /**
     * Envoyer un email de réinitialisation de mot de passe
     */
    public void sendPasswordResetEmail(String toEmail, String resetCode) {
        try {
            System.out.println("📧 Envoi email de réinitialisation à: " + toEmail);

            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            String subject = "🔒 Réinitialisez votre mot de passe CamerAnnonces";

            Content content = new Content("text/html", createPasswordResetEmailHtml(resetCode));
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ Email de réinitialisation envoyé avec succès!");
            } else {
                System.err.println("❌ Email de réinitialisation échoué: " + response.getStatusCode());
            }

        } catch (IOException e) {
            System.err.println("❌ Erreur SendGrid: " + e.getMessage());
            logEmailToConsole(toEmail, resetCode, "PASSWORD_RESET");
        }
    }

    // ============================================
    // EMAIL TEMPLATES (HTML)
    // ============================================

    /**
     * Template HTML pour email de vérification
     */
    private String createVerificationEmailHtml(String code) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vérification Email</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
                <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background-color: #0066CC; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🇨🇲 CamerAnnonces</h1>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="color: #333333; margin: 0 0 20px 0;">Vérification de votre compte</h2>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                            Bienvenue sur CamerAnnonces!<br>
                                            Votre code de vérification est :
                                        </p>
                                        
                                        <!-- Verification Code Box -->
                                        <table width="100%%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 30px 0;">
                                                    <div style="background-color: #f0f7ff; border: 2px dashed #0066CC; border-radius: 10px; padding: 30px; display: inline-block;">
                                                        <span style="font-size: 48px; font-weight: bold; color: #0066CC; letter-spacing: 10px;">%s</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                                            Ce code expire dans <strong>10 minutes</strong>.<br>
                                            Si vous n'avez pas demandé ce code, ignorez cet email.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-radius: 0 0 10px 10px;">
                                        <p style="color: #999999; font-size: 12px; margin: 0;">
                                            © 2026 CamerAnnonces - Petites annonces au Cameroun<br>
                                            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(code);
    }

    /**
     * Template HTML pour email de bienvenue
     */
    private String createWelcomeEmailHtml(String userName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienvenue</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
                <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <tr>
                                    <td style="background-color: #0066CC; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Bienvenue!</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="color: #333333; margin: 0 0 20px 0;">Bonjour %s,</h2>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                            Votre compte CamerAnnonces a été créé avec succès! Vous pouvez maintenant:
                                        </p>
                                        <ul style="color: #666666; font-size: 16px; line-height: 1.8;">
                                            <li>📱 Publier vos annonces gratuitement</li>
                                            <li>🔍 Rechercher des produits et services</li>
                                            <li>💬 Contacter des vendeurs directement</li>
                                            <li>⭐ Sauvegarder vos annonces favorites</li>
                                        </ul>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                                            Bon shopping sur CamerAnnonces! 🇨🇲
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-radius: 0 0 10px 10px;">
                                        <p style="color: #999999; font-size: 12px; margin: 0;">
                                            © 2026 CamerAnnonces - Petites annonces au Cameroun
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(userName);
    }

    /**
     * Template HTML pour réinitialisation de mot de passe
     */
    private String createPasswordResetEmailHtml(String resetCode) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Réinitialisation mot de passe</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
                <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <tr>
                                    <td style="background-color: #0066CC; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔒 Réinitialisation</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="color: #333333; margin: 0 0 20px 0;">Réinitialisez votre mot de passe</h2>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                            Vous avez demandé à réinitialiser votre mot de passe.<br>
                                            Utilisez le code ci-dessous:
                                        </p>
                                        <table width="100%%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 30px 0;">
                                                    <div style="background-color: #fff5f5; border: 2px dashed #ff4444; border-radius: 10px; padding: 30px; display: inline-block;">
                                                        <span style="font-size: 48px; font-weight: bold; color: #ff4444; letter-spacing: 10px;">%s</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="color: #666666; font-size: 14px; line-height: 1.6;">
                                            ⚠️ Ce code expire dans <strong>15 minutes</strong>.<br>
                                            Si vous n'avez pas fait cette demande, ignorez cet email.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-radius: 0 0 10px 10px;">
                                        <p style="color: #999999; font-size: 12px; margin: 0;">
                                            © 2026 CamerAnnonces - Petites annonces au Cameroun
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(resetCode);
    }

    // ============================================
    // FALLBACK: Console Logging
    // ============================================

    /**
     * Fallback en cas d'échec SendGrid - logger dans la console
     */
    private void logEmailToConsole(String toEmail, String content, String type) {
        System.out.println("========================================");
        System.out.println("📧 EMAIL FALLBACK (Console)");
        System.out.println("Type: " + type);
        System.out.println("Destinataire: " + toEmail);
        System.out.println("Contenu: " + content);
        System.out.println("========================================");
    }
}