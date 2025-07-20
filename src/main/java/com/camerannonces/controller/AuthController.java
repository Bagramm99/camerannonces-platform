package com.camerannonces.controller;

import com.camerannonces.entity.User;
import com.camerannonces.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

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
            if (nom == null || telephone == null || motDePasse == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Nom, téléphone et mot de passe sont obligatoires"));
            }

            User user = authService.register(nom, telephone, motDePasse, ville, quartier);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Inscription réussie");
            response.put("user", createUserResponse(user));

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

            if (telephone == null || motDePasse == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Téléphone et mot de passe sont obligatoires"));
            }

            User user = authService.login(telephone, motDePasse);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Connexion réussie");
            response.put("user", createUserResponse(user));
            // TODO: Ajouter JWT token
            response.put("token", "jwt_token_here");

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
                                            @RequestHeader("User-ID") Long userId) {
        try {
            String ancienMotDePasse = request.get("ancienMotDePasse");
            String nouveauMotDePasse = request.get("nouveauMotDePasse");

            if (ancienMotDePasse == null || nouveauMotDePasse == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Ancien et nouveau mot de passe sont obligatoires"));
            }

            authService.changePassword(userId, ancienMotDePasse, nouveauMotDePasse);

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

            if (telephone == null || nouveauMotDePasse == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Téléphone et nouveau mot de passe sont obligatoires"));
            }

            authService.resetPassword(telephone, nouveauMotDePasse);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Mot de passe réinitialisé avec succès");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // MÉTHODES UTILITAIRES
    // ============================================

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
        userResponse.put("planActuel", user.getPlanActuel());
        userResponse.put("dateCreation", user.getDateCreation());
        return userResponse;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}