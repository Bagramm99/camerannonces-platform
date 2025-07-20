package com.camerannonces.controller;

import com.camerannonces.entity.Listing;
import com.camerannonces.entity.User;
import com.camerannonces.enums.PlanType;
import com.camerannonces.service.ListingService;
import com.camerannonces.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ListingService listingService;

    /**
     * Obtenir le profil de l'utilisateur connecté
     * GET /api/user/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("User-ID") Long userId) {
        try {
            Optional<User> userOpt = userService.getUserById(userId);

            if (!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", createUserResponse(user));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Mettre à jour le profil utilisateur
     * PUT /api/user/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request,
                                           @RequestHeader("User-ID") Long userId) {
        try {
            String nom = request.get("nom");
            String email = request.get("email");
            String ville = request.get("ville");
            String quartier = request.get("quartier");

            User user = userService.updateProfile(userId, nom, email, ville, quartier);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profil mis à jour avec succès");
            response.put("user", createUserResponse(user));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les annonces de l'utilisateur connecté
     * GET /api/user/my-listings?page=0&size=20
     */
    @GetMapping("/my-listings")
    public ResponseEntity<?> getMyListings(@RequestHeader("User-ID") Long userId,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = listingService.getUserListings(userId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingResponse).toList());
            response.put("totalElements", listings.getTotalElements());
            response.put("totalPages", listings.getTotalPages());
            response.put("currentPage", page);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir seulement les annonces actives de l'utilisateur
     * GET /api/user/my-active-listings
     */
    @GetMapping("/my-active-listings")
    public ResponseEntity<?> getMyActiveListings(@RequestHeader("User-ID") Long userId,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = listingService.getUserActiveListings(userId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingResponse).toList());
            response.put("totalElements", listings.getTotalElements());
            response.put("totalPages", listings.getTotalPages());
            response.put("currentPage", page);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Convertir en boutique
     * POST /api/user/convert-to-boutique
     */
    @PostMapping("/convert-to-boutique")
    public ResponseEntity<?> convertToBoutique(@RequestBody Map<String, String> request,
                                               @RequestHeader("User-ID") Long userId) {
        try {
            String nomBoutique = request.get("nomBoutique");
            String descriptionBoutique = request.get("descriptionBoutique");

            if (nomBoutique == null || nomBoutique.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Le nom de la boutique est obligatoire"));
            }

            User user = userService.convertToBoutique(userId, nomBoutique, descriptionBoutique);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Votre compte a été converti en boutique avec succès");
            response.put("user", createUserResponse(user));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Changer le plan d'abonnement
     * POST /api/user/change-plan
     */
    @PostMapping("/change-plan")
    public ResponseEntity<?> changePlan(@RequestBody Map<String, String> request,
                                        @RequestHeader("User-ID") Long userId) {
        try {
            String planStr = request.get("plan");

            if (planStr == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Le plan est obligatoire"));
            }

            PlanType nouveauPlan = PlanType.valueOf(planStr);
            User user = userService.changePlan(userId, nouveauPlan);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Plan d'abonnement modifié avec succès");
            response.put("user", createUserResponse(user));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Vérifier si l'utilisateur peut publier une nouvelle annonce
     * GET /api/user/can-publish
     */
    @GetMapping("/can-publish")
    public ResponseEntity<?> canPublish(@RequestHeader("User-ID") Long userId) {
        try {
            boolean canPublish = userService.canPublishListing(userId);

            Optional<User> userOpt = userService.getUserById(userId);
            User user = userOpt.get();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("canPublish", canPublish);
            response.put("annoncesPubliees", user.getAnnoncesPublieesCeMois());
            response.put("planActuel", user.getPlanActuel());

            // Limite selon le plan
            int limite = switch (user.getPlanActuel()) {
                case GRATUIT -> 2;
                case BASIC -> 5;
                case PRO -> 15;
                case BOUTIQUE -> -1; // illimité
            };
            response.put("limiteAnnonces", limite);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les statistiques de l'utilisateur
     * GET /api/user/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(@RequestHeader("User-ID") Long userId) {
        try {
            // TODO: Implémenter les statistiques complètes
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statistiques non implémentées");

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
        userResponse.put("descriptionBoutique", user.getDescriptionBoutique());
        userResponse.put("planActuel", user.getPlanActuel());
        userResponse.put("dateExpirationPlan", user.getDateExpirationPlan());
        userResponse.put("annoncesPublieesCeMois", user.getAnnoncesPublieesCeMois());
        userResponse.put("isActive", user.getIsActive());
        userResponse.put("dateCreation", user.getDateCreation());
        return userResponse;
    }

    private Map<String, Object> createListingResponse(Listing listing) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", listing.getId());
        response.put("titre", listing.getTitre());
        response.put("description", listing.getDescription());
        response.put("prix", listing.getPrix());
        response.put("ville", listing.getVille());
        response.put("quartier", listing.getQuartier());
        response.put("statut", listing.getStatut());
        response.put("dateCreation", listing.getDateCreation());
        response.put("dateExpiration", listing.getDateExpiration());
        response.put("vues", listing.getVues());
        response.put("contactsWhatsapp", listing.getContactsWhatsapp());
        response.put("isPremium", listing.getIsPremium());
        response.put("isUrgent", listing.getIsUrgent());
        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}