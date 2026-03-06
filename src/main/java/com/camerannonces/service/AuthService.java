package com.camerannonces.service;

import com.camerannonces.entity.User;
import com.camerannonces.enums.PlanType;
import com.camerannonces.jwt.JwtResponse;
import com.camerannonces.jwt.JwtTokenProvider;
import com.camerannonces.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service d'authentification avec intégration JWT et SMS
 * Localisation: src/main/java/com/camerannonces/service/AuthService.java
 */
@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AfricasTalkingSmsService smsService;

    /**
     * Inscription d'un nouvel utilisateur avec JWT (ancienne méthode - téléphone uniquement)
     */
    public JwtResponse register(String nom, String telephone, String motDePasse, String ville, String quartier) {
        // Vérifier si le téléphone existe déjà
        if (userRepository.existsByTelephone(telephone)) {
            throw new RuntimeException("Ce numéro de téléphone est déjà utilisé");
        }

        // Valider le format du téléphone camerounais
        if (!telephone.matches("^237[0-9]{9}$")) {
            throw new RuntimeException("Format de téléphone invalide. Utilisez le format : 237XXXXXXXXX");
        }

        // Valider le mot de passe
        if (motDePasse == null || motDePasse.length() < 6) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 6 caractères");
        }

        // Créer le nouvel utilisateur
        User user = new User();
        user.setNom(nom);
        user.setTelephone(telephone);
        user.setMotDePasse(passwordEncoder.encode(motDePasse));
        user.setVille(ville);
        user.setQuartier(quartier);
        user.setPlanActuel(PlanType.GRATUIT);
        user.setIsActive(true);
        user.setIsBoutique(false);
        user.setAnnoncesPublieesCeMois(0);
        user.setCountryCode("+237");

        User savedUser = userRepository.save(user);

        // Générer les tokens JWT
        return jwtTokenProvider.createJwtResponse(telephone, savedUser.getId());
    }

    /**
     * ✅ NOUVELLE: Inscription avec email et numéro international
     */
    public JwtResponse registerWithEmail(String nom, String telephone, String email,
                                         String motDePasse, String countryCode,
                                         String ville, String quartier) {

        // Vérifier si téléphone existe déjà
        if (userRepository.existsByTelephone(telephone)) {
            throw new RuntimeException("Ce numéro de téléphone est déjà utilisé");
        }

        // Vérifier si email existe déjà
        if (email != null && !email.trim().isEmpty()) {
            if (userRepository.existsByEmail(email)) {
                throw new RuntimeException("Cet email est déjà utilisé");
            }
        }

        // Valider le mot de passe
        if (motDePasse == null || motDePasse.length() < 6) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 6 caractères");
        }

        // Créer utilisateur
        User user = new User();
        user.setNom(nom);
        user.setTelephone(telephone);
        user.setEmail(email);
        user.setCountryCode(countryCode != null ? countryCode : "+237");
        user.setMotDePasse(passwordEncoder.encode(motDePasse));
        user.setVille(ville);
        user.setQuartier(quartier);
        user.setPlanActuel(PlanType.GRATUIT);
        user.setIsActive(true);
        user.setIsBoutique(false);
        user.setEmailVerified(false);
        user.setPhoneVerified(false);
        user.setAnnoncesPublieesCeMois(0);

        // Générer code de vérification EMAIL (si email fourni)
        if (email != null && !email.trim().isEmpty()) {
            String code = emailService.generateVerificationCode();
            user.setEmailVerificationCode(code);
            user.setEmailVerificationExpiry(LocalDateTime.now().plusMinutes(4));

            user = userRepository.save(user);

            // Envoyer email
            emailService.sendVerificationEmail(email, code);
        } else {
            user = userRepository.save(user);
        }

        // Créer tokens (l'utilisateur peut se connecter même sans vérification)
        return jwtTokenProvider.createJwtResponse(telephone, user.getId());
    }

    /**
     * ✅ NOUVELLE: Envoyer code de vérification SMS (Africa's Talking)
     */
    public void sendSmsVerification(String telephone) {
        User user = userRepository.findByTelephone(telephone)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Générer code 4 chiffres
        String code = smsService.generateVerificationCode();

        // Sauvegarder code et expiration
        user.setPhoneVerificationCode(code);
        user.setPhoneVerificationExpiry(LocalDateTime.now().plusMinutes(4)); // 4 minutes
        userRepository.save(user);

        // Envoyer SMS via Africa's Talking
        try {
            smsService.sendVerificationSms(telephone, code);
            System.out.println("✅ SMS envoyé à " + telephone + " avec code: " + code);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'envoi du SMS: " + e.getMessage());
        }
    }

    /**
     * ✅ NOUVELLE: Vérifier code SMS
     */
    public void verifySms(String telephone, String code) {
        User user = userRepository.findByTelephone(telephone)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier si code existe
        if (user.getPhoneVerificationCode() == null || user.getPhoneVerificationCode().isEmpty()) {
            throw new RuntimeException("Aucun code de vérification SMS actif");
        }

        // Vérifier si code correspond
        if (!user.getPhoneVerificationCode().equals(code)) {
            throw new RuntimeException("Code SMS invalide");
        }

        // Vérifier si code est expiré
        if (user.getPhoneVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Code SMS expiré. Demandez un nouveau code.");
        }

        // Marquer téléphone comme vérifié
        user.setPhoneVerified(true);
        user.setPhoneVerificationCode(null);
        user.setPhoneVerificationExpiry(null);

        userRepository.save(user);
        System.out.println("✅ Téléphone vérifié: " + telephone);
    }

    /**
     * ✅ NOUVELLE: Vérifier le code EMAIL (ancienne méthode conservée)
     */
    public void verifyCode(String telephone, String code) {
        User user = userRepository.findByTelephone(telephone)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier code EMAIL
        if (user.getEmailVerificationCode() == null || !user.getEmailVerificationCode().equals(code)) {
            throw new RuntimeException("Code de vérification invalide");
        }

        // Vérifier si code est expiré
        if (user.getEmailVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Code de vérification expiré");
        }

        // Marquer email comme vérifié
        user.setEmailVerified(true);
        user.setEmailVerificationCode(null);
        user.setEmailVerificationExpiry(null);

        userRepository.save(user);
    }

    /**
     * ✅ NOUVELLE: Renvoyer le code de vérification EMAIL
     */
    public void resendVerificationCode(String telephone) {
        User user = userRepository.findByTelephone(telephone)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new RuntimeException("Aucun email associé à ce compte");
        }

        // Générer nouveau code
        String code = emailService.generateVerificationCode();
        user.setEmailVerificationCode(code);
        user.setEmailVerificationExpiry(LocalDateTime.now().plusMinutes(4));

        userRepository.save(user);

        // Renvoyer email
        emailService.sendVerificationEmail(user.getEmail(), code);
    }

    /**
     * Connexion d'un utilisateur avec JWT
     */
    public JwtResponse login(String telephone, String motDePasse) {
        // Chercher l'utilisateur par téléphone
        Optional<User> userOpt = userRepository.findByTelephone(telephone);

        if (!userOpt.isPresent()) {
            throw new RuntimeException("Numéro de téléphone ou mot de passe incorrect");
        }

        User user = userOpt.get();

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(motDePasse, user.getMotDePasse())) {
            throw new RuntimeException("Numéro de téléphone ou mot de passe incorrect");
        }

        // Vérifier si le compte est actif
        if (!user.getIsActive()) {
            throw new RuntimeException("Votre compte a été suspendu. Contactez l'administration.");
        }

        // Mettre à jour la dernière connexion
        user.setDerniereConnexion(LocalDateTime.now());
        userRepository.save(user);

        // Générer les tokens JWT
        return jwtTokenProvider.createJwtResponse(telephone, user.getId());
    }

    /**
     * Rafraîchir le token d'accès
     */
    public JwtResponse refreshToken(String refreshToken) {
        try {
            String telephone = jwtTokenProvider.extractUsername(refreshToken);
            Long userId = jwtTokenProvider.extractUserId(refreshToken);

            // Vérifier que c'est bien un refresh token valide
            if (!jwtTokenProvider.validateRefreshToken(refreshToken, telephone)) {
                throw new RuntimeException("Refresh token invalide ou expiré");
            }

            // Vérifier que l'utilisateur existe toujours et est actif
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            if (!user.getIsActive()) {
                throw new RuntimeException("Compte suspendu");
            }

            // Générer nouveaux tokens
            return jwtTokenProvider.createJwtResponse(telephone, userId);

        } catch (Exception e) {
            throw new RuntimeException("Impossible de rafraîchir le token : " + e.getMessage());
        }
    }

    /**
     * Valider un token et retourner l'utilisateur
     */
    public User validateTokenAndGetUser(String token) {
        try {
            String telephone = jwtTokenProvider.extractUsername(token);
            Long userId = jwtTokenProvider.extractUserId(token);

            if (jwtTokenProvider.validateToken(token, telephone)) {
                User user = getUserById(userId);

                // Vérifier que l'utilisateur est toujours actif
                if (!user.getIsActive()) {
                    throw new RuntimeException("Compte suspendu");
                }

                return user;
            } else {
                throw new RuntimeException("Token invalide");
            }
        } catch (Exception e) {
            throw new RuntimeException("Token invalide : " + e.getMessage());
        }
    }

    /**
     * Obtenir un utilisateur par son ID
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    /**
     * Mettre à jour la dernière connexion
     */
    public void updateLastLogin(Long userId) {
        User user = getUserById(userId);
        user.setDerniereConnexion(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Vérifier si un téléphone est disponible
     */
    public boolean isTelephoneAvailable(String telephone) {
        return !userRepository.existsByTelephone(telephone);
    }

    /**
     * Vérifier si un email est disponible
     */
    public boolean isEmailAvailable(String email) {
        if (email == null || email.trim().isEmpty()) {
            return true; // Email optionnel
        }
        return !userRepository.existsByEmail(email);
    }

    /**
     * Changer le mot de passe
     */
    public void changePassword(Long userId, String ancienMotDePasse, String nouveauMotDePasse) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(ancienMotDePasse, user.getMotDePasse())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        // Valider le nouveau mot de passe
        if (nouveauMotDePasse == null || nouveauMotDePasse.length() < 6) {
            throw new RuntimeException("Le nouveau mot de passe doit contenir au moins 6 caractères");
        }

        // Mettre à jour le mot de passe
        user.setMotDePasse(passwordEncoder.encode(nouveauMotDePasse));
        userRepository.save(user);
    }

    /**
     * Réinitialiser le mot de passe (version simple)
     */
    public void resetPassword(String telephone, String nouveauMotDePasse) {
        User user = userRepository.findByTelephone(telephone)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Valider le nouveau mot de passe
        if (nouveauMotDePasse == null || nouveauMotDePasse.length() < 6) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 6 caractères");
        }

        user.setMotDePasse(passwordEncoder.encode(nouveauMotDePasse));
        userRepository.save(user);
    }

    /**
     * Désactiver le compte utilisateur
     */
    @Transactional
    public void deactivateAccount(Long userId, String motDePasse) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(motDePasse, user.getMotDePasse())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // Désactiver l'utilisateur
        user.setIsActive(false);
        userRepository.save(user);
    }

    /**
     * Obtenir les informations d'expiration d'un token
     */
    public long getTokenRemainingTime(String token) {
        return jwtTokenProvider.getRemainingExpiration(token);
    }
}