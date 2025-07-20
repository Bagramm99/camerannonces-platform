package com.camerannonces.controller;

import com.camerannonces.entity.Signal;
import com.camerannonces.enums.SignalReason;
import com.camerannonces.service.ModerationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moderation")
@CrossOrigin(origins = "*")
public class ModerationController {

    @Autowired
    private ModerationService moderationService;

    /**
     * Signaler une annonce
     * POST /api/moderation/signal
     */
    @PostMapping("/signal")
    public ResponseEntity<?> reportListing(@RequestBody Map<String, Object> request,
                                           @RequestHeader(value = "User-ID", required = false) Long userId,
                                           HttpServletRequest httpRequest) {
        try {
            Long listingId = Long.valueOf(request.get("listingId").toString());
            String motifStr = (String) request.get("motif");
            String description = (String) request.get("description");

            // Validation
            if (listingId == null || motifStr == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("ID de l'annonce et motif sont obligatoires"));
            }

            SignalReason motif = SignalReason.valueOf(motifStr);
            String adresseIp = getClientIpAddress(httpRequest);

            Signal signal = moderationService.reportListing(listingId, userId, motif, description, adresseIp);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Signalement enregistré avec succès");
            response.put("signal", createSignalResponse(signal));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir tous les signalements en attente (ADMIN)
     * GET /api/moderation/pending-reports
     */
    @GetMapping("/pending-reports")
    public ResponseEntity<?> getPendingReports(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Signal> signals = moderationService.getPendingReports(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("reports", signals.getContent().stream()
                    .map(this::createSignalDetailResponse).toList());
            response.put("totalElements", signals.getTotalElements());
            response.put("totalPages", signals.getTotalPages());
            response.put("currentPage", page);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les signalements d'une annonce
     * GET /api/moderation/listing/{listingId}/reports
     */
    @GetMapping("/listing/{listingId}/reports")
    public ResponseEntity<?> getReportsForListing(@PathVariable Long listingId) {
        try {
            List<Signal> signals = moderationService.getReportsForListing(listingId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("reports", signals.stream()
                    .map(this::createSignalDetailResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les signalements par motif
     * GET /api/moderation/reports/reason/{reason}
     */
    @GetMapping("/reports/reason/{reason}")
    public ResponseEntity<?> getReportsByReason(@PathVariable String reason) {
        try {
            SignalReason motif = SignalReason.valueOf(reason);
            List<Signal> signals = moderationService.getReportsByReason(motif);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("reports", signals.stream()
                    .map(this::createSignalDetailResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Approuver un signalement (ADMIN)
     * POST /api/moderation/reports/{signalId}/approve
     */
    @PostMapping("/reports/{signalId}/approve")
    public ResponseEntity<?> approveReport(@PathVariable Long signalId,
                                           @RequestBody Map<String, String> request,
                                           @RequestHeader("User-ID") Long adminId) {
        try {
            String commentaire = request.get("commentaire");

            moderationService.approveReport(signalId, adminId, commentaire);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Signalement approuvé et annonce suspendue");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Rejeter un signalement (ADMIN)
     * POST /api/moderation/reports/{signalId}/reject
     */
    @PostMapping("/reports/{signalId}/reject")
    public ResponseEntity<?> rejectReport(@PathVariable Long signalId,
                                          @RequestBody Map<String, String> request,
                                          @RequestHeader("User-ID") Long adminId) {
        try {
            String commentaire = request.get("commentaire");

            moderationService.rejectReport(signalId, adminId, commentaire);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Signalement rejeté");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Suspendre une annonce manuellement (ADMIN)
     * POST /api/moderation/listings/{listingId}/suspend
     */
    @PostMapping("/listings/{listingId}/suspend")
    public ResponseEntity<?> suspendListing(@PathVariable Long listingId,
                                            @RequestBody Map<String, String> request,
                                            @RequestHeader("User-ID") Long adminId) {
        try {
            String raison = request.get("raison");

            moderationService.suspendListing(listingId, adminId, raison);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Annonce suspendue avec succès");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Réactiver une annonce (ADMIN)
     * POST /api/moderation/listings/{listingId}/reactivate
     */
    @PostMapping("/listings/{listingId}/reactivate")
    public ResponseEntity<?> reactivateListing(@PathVariable Long listingId,
                                               @RequestBody Map<String, String> request,
                                               @RequestHeader("User-ID") Long adminId) {
        try {
            String raison = request.get("raison");

            moderationService.reactivateListing(listingId, adminId, raison);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Annonce réactivée avec succès");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les annonces les plus signalées
     * GET /api/moderation/most-reported-listings
     */
    @GetMapping("/most-reported-listings")
    public ResponseEntity<?> getMostReportedListings() {
        try {
            List<Object[]> reportedListings = moderationService.getMostReportedListings();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", reportedListings.stream()
                    .map(this::createListingWithReportCountResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les annonces avec plusieurs signalements
     * GET /api/moderation/multiple-reports?threshold=3
     */
    @GetMapping("/multiple-reports")
    public ResponseEntity<?> getListingsWithMultipleReports(@RequestParam(defaultValue = "3") int threshold) {
        try {
            List<Object[]> listings = moderationService.getListingsWithMultipleReports(threshold);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.stream()
                    .map(this::createListingWithReportCountResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les utilisateurs les plus signalés
     * GET /api/moderation/most-reported-users
     */
    @GetMapping("/most-reported-users")
    public ResponseEntity<?> getMostReportedUsers() {
        try {
            List<Object[]> reportedUsers = moderationService.getMostReportedUsers();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("users", reportedUsers.stream()
                    .map(this::createUserWithReportCountResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les statistiques de signalements
     * GET /api/moderation/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getSignalStats() {
        try {
            List<Object[]> statsByReason = moderationService.getSignalStatsByReason();
            List<Object[]> statsByStatus = moderationService.getSignalStatsByStatus();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("statsByReason", statsByReason.stream()
                    .map(data -> Map.of(
                            "motif", data[0],
                            "count", data[1]
                    )).toList());
            response.put("statsByStatus", statsByStatus.stream()
                    .map(data -> Map.of(
                            "statut", data[0],
                            "count", data[1]
                    )).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Vérifier si un utilisateur a déjà signalé une annonce
     * GET /api/moderation/check-report?listingId=123&userId=456
     */
    @GetMapping("/check-report")
    public ResponseEntity<?> checkUserReport(@RequestParam Long listingId,
                                             @RequestParam Long userId) {
        try {
            boolean hasReported = moderationService.hasUserReportedListing(userId, listingId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("hasReported", hasReported);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // MÉTHODES UTILITAIRES
    // ============================================

    private Map<String, Object> createSignalResponse(Signal signal) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", signal.getId());
        response.put("motif", signal.getMotif());
        response.put("description", signal.getDescription());
        response.put("statut", signal.getStatut());
        response.put("dateSignalement", signal.getDateSignalement());
        return response;
    }

    private Map<String, Object> createSignalDetailResponse(Signal signal) {
        Map<String, Object> response = createSignalResponse(signal);
        response.put("adresseIp", signal.getAdresseIp());
        response.put("commentaireAdmin", signal.getCommentaireAdmin());
        response.put("dateTraitement", signal.getDateTraitement());

        // Infos de l'annonce
        Map<String, Object> listingInfo = new HashMap<>();
        listingInfo.put("id", signal.getListing().getId());
        listingInfo.put("titre", signal.getListing().getTitre());
        listingInfo.put("statut", signal.getListing().getStatut());
        response.put("listing", listingInfo);

        // Infos de l'utilisateur qui a signalé
        if (signal.getUser() != null) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", signal.getUser().getId());
            userInfo.put("nom", signal.getUser().getNom());
            response.put("user", userInfo);
        }

        // Infos de l'admin qui a traité
        if (signal.getAdmin() != null) {
            Map<String, Object> adminInfo = new HashMap<>();
            adminInfo.put("id", signal.getAdmin().getId());
            adminInfo.put("nom", signal.getAdmin().getNom());
            response.put("admin", adminInfo);
        }

        return response;
    }

    private Map<String, Object> createListingWithReportCountResponse(Object[] data) {
        com.camerannonces.entity.Listing listing = (com.camerannonces.entity.Listing) data[0];
        Long reportCount = (Long) data[1];

        Map<String, Object> response = new HashMap<>();
        response.put("id", listing.getId());
        response.put("titre", listing.getTitre());
        response.put("statut", listing.getStatut());
        response.put("ville", listing.getVille());
        response.put("dateCreation", listing.getDateCreation());
        response.put("reportCount", reportCount);

        // Infos utilisateur
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", listing.getUser().getId());
        userInfo.put("nom", listing.getUser().getNom());
        userInfo.put("telephone", listing.getUser().getTelephone());
        response.put("user", userInfo);

        return response;
    }

    private Map<String, Object> createUserWithReportCountResponse(Object[] data) {
        com.camerannonces.entity.User user = (com.camerannonces.entity.User) data[0];
        Long reportCount = (Long) data[1];

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("nom", user.getNom());
        response.put("telephone", user.getTelephone());
        response.put("ville", user.getVille());
        response.put("isBoutique", user.getIsBoutique());
        response.put("nomBoutique", user.getNomBoutique());
        response.put("planActuel", user.getPlanActuel());
        response.put("isActive", user.getIsActive());
        response.put("reportCount", reportCount);

        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    /**
     * Obtenir l'adresse IP du client
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}