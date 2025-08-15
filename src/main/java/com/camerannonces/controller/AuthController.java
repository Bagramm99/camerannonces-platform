package com.camerannonces.controller;

import com.camerannonces.entity.User;
import com.camerannonces.jwt.JwtResponse;
import com.camerannonces.jwt.JwtTokenProvider;
import com.camerannonces.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Contrôleur d'authentification avec JWT
 * Localisation: src/main/java/com/camerannonces/controller/AuthController.java
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Inscription d'un nouvel utilisateur
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String nom = request.get("nom");
            String telephone = request.get("telephone");
            String motDePasse = request.get("motDePasse");
            String ville = request.get("ville");
            String quartier = request.get("quartier");

            // Validation basique
            if (nom == null || nom.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Le nom est obligatoire"));
            }

            if (telephone == null || telephone.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Le téléphone est obligatoire"));
            }

            if (motDePasse == null || motDePasse.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Le mot de passe est obligatoire"));
            }

            // Inscription avec JWT
            JwtResponse jwtResponse = authService.register(nom.trim(), telephone.trim(), motDePasse, ville, quartier);
            User user = authService.validateTokenAndGetUser(jwtResponse.getAccessToken());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Inscription réussie");
            response.put("user", createUserResponse(user));
            response.put("tokens", jwtResponse);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Connexion d'un utilisateur
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String telephone = request.get("telephone");
            String motDePasse = request.get("motDePasse");

            // Validation
            if (telephone == null || telephone.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Le téléphone est obligatoire"));
            }

            if (motDePasse == null || motDePasse.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Le mot de passe est obligatoire"));
            }

            // Connexion avec JWT
            JwtResponse jwtResponse = authService.login(telephone.trim(), motDePasse);
            User user = authService.validateTokenAndGetUser(jwtResponse.getAccessToken());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Connexion réussie");
            response.put("user", createUserResponse(user));
            response.put("tokens", jwtResponse);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Rafraîchir le token d'accès
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");

            if (refreshToken == null || refreshToken.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Refresh token requis"));
            }

            JwtResponse jwtResponse = authService.refreshToken(refreshToken.trim());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Token rafraîchi avec succès");
            response.put("tokens", jwtResponse);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les informations de l'utilisateur connecté
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractTokenFromHeader(authHeader);
            User user = authService.validateTokenAndGetUser(token);
            long remainingTime = authService.getTokenRemainingTime(token);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", createUserResponse(user));
            response.put("tokenExpiresIn", remainingTime);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Vérifier la validité d'un token
     * POST /api/auth/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");

            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Token requis"));
            }

            User user = authService.validateTokenAndGetUser(token.trim());
            long remainingTime = authService.getTokenRemainingTime(token.trim());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("valid", true);
            response.put("user", createUserResponse(user));
            response.put("expiresIn", remainingTime);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("valid", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Déconnexion
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            // Pour l'instant, la déconnexion est gérée côté client
            // En production, on pourrait ajouter une blacklist des tokens

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Déconnexion réussie");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Vérifier si un téléphone est disponible
     * GET /api/auth/check-phone?telephone=237xxxxxxxxx
     */
    @GetMapping("/check-phone")
    public ResponseEntity<?> checkPhone(@RequestParam String telephone) {
        try {
            boolean available = authService.isTelephoneAvailable(telephone);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("available", available);
            response.put("message", available ? "Téléphone disponible" : "Téléphone déjà utilisé");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Changer le mot de passe
     * POST /api/auth/change-password
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractTokenFromHeader(authHeader);
            User user = authService.validateTokenAndGetUser(token);

            String ancienMotDePasse = request.get("ancienMotDePasse");
            String nouveauMotDePasse = request.get("nouveauMotDePasse");

            if (ancienMotDePasse == null || ancienMotDePasse.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Ancien mot de passe obligatoire"));
            }

            if (nouveauMotDePasse == null || nouveauMotDePasse.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Nouveau mot de passe obligatoire"));
            }

            authService.changePassword(user.getId(), ancienMotDePasse, nouveauMotDePasse);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Mot de passe modifié avec succès");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Réinitialiser le mot de passe
     * POST /api/auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String telephone = request.get("telephone");
            String nouveauMotDePasse = request.get("nouveauMotDePasse");

            if (telephone == null || telephone.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Téléphone obligatoire"));
            }

            if (nouveauMotDePasse == null || nouveauMotDePasse.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Nouveau mot de passe obligatoire"));
            }

            authService.resetPassword(telephone.trim(), nouveauMotDePasse);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Mot de passe réinitialisé avec succès");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir des statistiques sur le token
     * GET /api/auth/token-info
     */
    @GetMapping("/token-info")
    public ResponseEntity<?> getTokenInfo(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractTokenFromHeader(authHeader);

            String telephone = jwtTokenProvider.extractUsername(token);
            Long userId = jwtTokenProvider.extractUserId(token);
            String tokenType = jwtTokenProvider.extractTokenType(token);
            long remainingTime = jwtTokenProvider.getRemainingExpiration(token);
            boolean isExpired = jwtTokenProvider.isTokenExpired(token);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("telephone", telephone);
            response.put("userId", userId);
            response.put("tokenType", tokenType);
            response.put("remainingTime", remainingTime);
            response.put("isExpired", isExpired);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // MÉTHODES UTILITAIRES
    // ============================================

    /**
     * Extraire le token de l'en-tête Authorization
     */
    private String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("Token d'autorisation manquant ou format invalide");
    }

    /**
     * Créer une réponse utilisateur (sans informations sensibles)
     */
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("nom", user.getNom());
        userResponse.put("telephone", user.getTelephone());
        userResponse.put("email", user.getEmail());
        userResponse.put("ville", user.getVille());
        userResponse.put("quartier", user.getQuartier());
        userResponse.put("isBoutique", user.getIsBoutique());
        userResponse.put("nomBoutique", user.getNomBoutique());
        userResponse.put("descriptionBoutique", user.getDescriptionBoutique());
        userResponse.put("planActuel", user.getPlanActuel());
        userResponse.put("dateCreation", user.getDateCreation());
        userResponse.put("isActive", user.getIsActive());
        userResponse.put("annoncesPublieesCeMois", user.getAnnoncesPublieesCeMois());
        return userResponse;
    }

    /**
     * Créer une réponse d'erreur standardisée
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}