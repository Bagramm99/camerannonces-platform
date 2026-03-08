package com.camerannonces.controller;

import com.camerannonces.entity.ListingImage;
import com.camerannonces.entity.User;
import com.camerannonces.service.AuthService;
import com.camerannonces.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Contrôleur pour la gestion des images
 * Storage: Backblaze B2 Cloud Storage
 */
@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @Autowired
    private AuthService authService;

    // ============================================
    // PROFILE IMAGES
    // ============================================

    /**
     * Upload image de profil
     * POST /api/images/profile
     */
    @PostMapping("/profile")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extraire userId du token
            User user = getUserFromToken(authHeader);

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Aucun fichier sélectionné"));
            }

            String imageUrl = imageService.uploadProfileImage(user.getId(), file);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Photo de profil mise à jour");
            response.put("imageUrl", imageUrl);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Supprimer image de profil
     * DELETE /api/images/profile
     */
    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteProfileImage(@RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);
            imageService.deleteProfileImage(user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Photo de profil supprimée");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir l'URL de l'image de profil
     * GET /api/images/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfileImage(@RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imageUrl", user.getProfileImageUrl());
            response.put("hasImage", user.getProfileImageUrl() != null);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // LISTING IMAGES
    // ============================================

    /**
     * Uploader une image pour une annonce
     * POST /api/images/listing/{listingId}
     */
    @PostMapping("/listing/{listingId}")
    public ResponseEntity<?> uploadListingImage(
            @PathVariable Long listingId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrincipale", defaultValue = "false") boolean isPrincipale,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Aucun fichier sélectionné"));
            }

            ListingImage image = imageService.saveListingImage(
                    listingId, user.getId(), file, isPrincipale
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Image uploadée avec succès");
            response.put("image", createImageResponse(image));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Uploader plusieurs images en une fois
     * POST /api/images/listing/{listingId}/multiple
     */
    @PostMapping("/listing/{listingId}/multiple")
    public ResponseEntity<?> uploadMultipleImages(
            @PathVariable Long listingId,
            @RequestParam("files") MultipartFile[] files,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);

            if (files.length == 0) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Aucun fichier sélectionné"));
            }

            int successCount = 0;
            int errorCount = 0;

            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                boolean isPrincipale = (i == 0); // Première image = principale

                try {
                    imageService.saveListingImage(listingId, user.getId(), file, isPrincipale);
                    successCount++;
                } catch (Exception e) {
                    errorCount++;
                    System.err.println("❌ Erreur upload image " + i + ": " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", successCount + " images uploadées");
            response.put("successCount", successCount);
            response.put("errorCount", errorCount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir toutes les images d'une annonce
     * GET /api/images/listing/{listingId}
     */
    @GetMapping("/listing/{listingId}")
    public ResponseEntity<?> getImagesByListing(@PathVariable Long listingId) {
        try {
            List<ListingImage> images = imageService.getImagesByListing(listingId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", images.size());
            response.put("images", images.stream()
                    .map(this::createImageResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir l'image principale d'une annonce
     * GET /api/images/listing/{listingId}/main
     */
    @GetMapping("/listing/{listingId}/main")
    public ResponseEntity<?> getMainImage(@PathVariable Long listingId) {
        try {
            ListingImage mainImage = imageService.getMainImage(listingId);

            if (mainImage == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("hasMainImage", false);
                response.put("image", null);
                return ResponseEntity.ok(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("hasMainImage", true);
            response.put("image", createImageResponse(mainImage));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Supprimer une image de listing
     * DELETE /api/images/{imageId}
     */
    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deleteImage(
            @PathVariable Long imageId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);
            imageService.deleteListingImage(imageId, user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Image supprimée avec succès");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Définir une image comme principale
     * POST /api/images/{imageId}/set-main
     */
    @PostMapping("/{imageId}/set-main")
    public ResponseEntity<?> setAsMainImage(
            @PathVariable Long imageId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);
            imageService.setAsMainImage(imageId, user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Image définie comme principale");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Réorganiser l'ordre des images
     * POST /api/images/listing/{listingId}/reorder
     */
    @PostMapping("/listing/{listingId}/reorder")
    public ResponseEntity<?> reorderImages(
            @PathVariable Long listingId,
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);

            @SuppressWarnings("unchecked")
            List<Long> imageIds = (List<Long>) request.get("imageIds");

            if (imageIds == null || imageIds.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Liste des IDs d'images requise"));
            }

            imageService.reorderImages(listingId, imageIds, user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Ordre des images mis à jour");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // STATISTICS
    // ============================================

    /**
     * Obtenir les statistiques des images
     * GET /api/images/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getImageStats(@RequestHeader("Authorization") String authHeader) {
        try {
            // Vérifier que l'utilisateur est authentifié
            getUserFromToken(authHeader);

            Long totalStorage = imageService.getTotalStorageUsed();
            Double averageSize = imageService.getAverageFileSize();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalStorageBytes", totalStorage);
            response.put("averageFileSizeBytes", averageSize);

            // Convertir en unités lisibles
            if (totalStorage != null) {
                response.put("totalStorageMB", String.format("%.2f", totalStorage / (1024.0 * 1024.0)));
            }
            if (averageSize != null) {
                response.put("averageFileSizeKB", String.format("%.2f", averageSize / 1024.0));
            }

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
     * Extraire l'utilisateur du token JWT
     */
    private User getUserFromToken(String authHeader) {
        String token = extractTokenFromHeader(authHeader);
        return authService.validateTokenAndGetUser(token);
    }

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
     * Créer une réponse image formatée
     */
    private Map<String, Object> createImageResponse(ListingImage image) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", image.getId());
        response.put("url", image.getUrl()); // URL directe Backblaze B2
        response.put("nomFichier", image.getNomFichier());
        response.put("tailleFichier", image.getTailleFichier());
        response.put("ordreAffichage", image.getOrdreAffichage());
        response.put("isPrincipale", image.getIsPrincipale());
        response.put("dateUpload", image.getDateUpload());

        // Taille formatée
        if (image.getTailleFichier() != null) {
            response.put("tailleFichierFormatted", formatFileSize(image.getTailleFichier()));
        }

        return response;
    }

    /**
     * Formater la taille du fichier
     */
    private String formatFileSize(int bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        } else if (bytes < 1024 * 1024) {
            return String.format("%.1f KB", bytes / 1024.0);
        } else {
            return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
        }
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