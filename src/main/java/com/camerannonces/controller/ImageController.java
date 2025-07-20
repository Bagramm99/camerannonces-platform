package com.camerannonces.controller;

import com.camerannonces.entity.ListingImage;
import com.camerannonces.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    @Autowired
    private ImageService imageService;

    // Dossier de stockage (même que dans ImageService)
    private final String uploadDir = "uploads/images/";

    /**
     * Uploader une image pour une annonce
     * POST /api/images/upload/{listingId}
     */
    @PostMapping("/upload/{listingId}")
    public ResponseEntity<?> uploadImage(@PathVariable Long listingId,
                                         @RequestParam("file") MultipartFile file,
                                         @RequestParam(value = "isPrincipale", defaultValue = "false") boolean isPrincipale,
                                         @RequestHeader("User-ID") Long userId) {
        try {
            // Validation de base
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Aucun fichier sélectionné"));
            }

            ListingImage image = imageService.saveImage(listingId, file, isPrincipale);

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
     * POST /api/images/upload-multiple/{listingId}
     */
    @PostMapping("/upload-multiple/{listingId}")
    public ResponseEntity<?> uploadMultipleImages(@PathVariable Long listingId,
                                                  @RequestParam("files") MultipartFile[] files,
                                                  @RequestHeader("User-ID") Long userId) {
        try {
            if (files.length == 0) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Aucun fichier sélectionné"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", files.length + " images uploadées");

            // Uploader chaque fichier
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                boolean isPrincipale = (i == 0); // La première image devient principale

                try {
                    ListingImage image = imageService.saveImage(listingId, file, isPrincipale);
                    // Log success pour chaque image
                } catch (Exception e) {
                    // Log error mais continue avec les autres images
                    System.err.println("Erreur upload image " + i + ": " + e.getMessage());
                }
            }

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
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("image", createImageResponse(mainImage));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Servir une image (affichage)
     * GET /api/images/view/{filename}
     */
    @GetMapping("/view/{filename}")
    public ResponseEntity<Resource> viewImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                // Déterminer le type de contenu
                String contentType = "image/jpeg"; // Par défaut
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Télécharger une image
     * GET /api/images/download/{filename}
     */
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Supprimer une image
     * DELETE /api/images/{imageId}
     */
    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId,
                                         @RequestHeader("User-ID") Long userId) {
        try {
            imageService.deleteImage(imageId, userId);

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
    public ResponseEntity<?> setAsMainImage(@PathVariable Long imageId,
                                            @RequestHeader("User-ID") Long userId) {
        try {
            imageService.setAsMainImage(imageId, userId);

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
    public ResponseEntity<?> reorderImages(@PathVariable Long listingId,
                                           @RequestBody Map<String, Object> request,
                                           @RequestHeader("User-ID") Long userId) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> imageIds = (List<Long>) request.get("imageIds");

            if (imageIds == null || imageIds.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Liste des IDs d'images requise"));
            }

            imageService.reorderImages(listingId, imageIds, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Ordre des images mis à jour");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les statistiques des images
     * GET /api/images/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getImageStats() {
        try {
            Long totalStorage = imageService.getTotalStorageUsed();
            Double averageSize = imageService.getAverageFileSize();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalStorageUsed", totalStorage);
            response.put("averageFileSize", averageSize);

            // Convertir en MB pour plus de lisibilité
            if (totalStorage != null) {
                response.put("totalStorageMB", totalStorage / (1024 * 1024));
            }
            if (averageSize != null) {
                response.put("averageFileSizeKB", averageSize / 1024);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Vérifier les limites d'upload pour un utilisateur
     * GET /api/images/upload-limits/{listingId}
     */
    @GetMapping("/upload-limits/{listingId}")
    public ResponseEntity<?> getUploadLimits(@PathVariable Long listingId,
                                             @RequestHeader("User-ID") Long userId) {
        try {
            // TODO: Implémenter la vérification des limites selon le plan utilisateur
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vérification des limites non implémentée");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // MÉTHODES UTILITAIRES
    // ============================================

    private Map<String, Object> createImageResponse(ListingImage image) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", image.getId());
        response.put("url", image.getUrl());
        response.put("nomFichier", image.getNomFichier());
        response.put("tailleFichier", image.getTailleFichier());
        response.put("ordreAffichage", image.getOrdreAffichage());
        response.put("isPrincipale", image.getIsPrincipale());
        response.put("dateUpload", image.getDateUpload());

        // URL complète pour affichage
        response.put("viewUrl", "/api/images/view/" + extractFilename(image.getUrl()));
        response.put("downloadUrl", "/api/images/download/" + extractFilename(image.getUrl()));

        return response;
    }

    private String extractFilename(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}