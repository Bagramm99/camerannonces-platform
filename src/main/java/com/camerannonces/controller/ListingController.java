package com.camerannonces.controller;

import com.camerannonces.entity.Listing;
import com.camerannonces.enums.EtatProduit;
import com.camerannonces.enums.ListingStatus;
import com.camerannonces.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "*")
public class ListingController {

    @Autowired
    private ListingService listingService;

    /**
     * Créer une nouvelle annonce
     * POST /api/listings
     */
    @PostMapping
    public ResponseEntity<?> createListing(@RequestBody Map<String, Object> request,
                                           @RequestHeader("User-ID") Long userId) {
        try {
            Long categoryId = Long.valueOf(request.get("categoryId").toString());
            String titre = (String) request.get("titre");
            String description = (String) request.get("description");
            Integer prix = request.get("prix") != null ? Integer.valueOf(request.get("prix").toString()) : null;
            Boolean prixNegociable = (Boolean) request.get("prixNegociable");
            String etatProduitStr = (String) request.get("etatProduit");
            EtatProduit etatProduit = etatProduitStr != null ? EtatProduit.valueOf(etatProduitStr) : null;

            String ville = (String) request.get("ville");
            String quartier = (String) request.get("quartier");
            String adresseComplete = (String) request.get("adresseComplete");
            String telephoneContact = (String) request.get("telephoneContact");
            String emailContact = (String) request.get("emailContact");

            Boolean livraisonSurPlace = (Boolean) request.get("livraisonSurPlace");
            Boolean livraisonDomicile = (Boolean) request.get("livraisonDomicile");
            Boolean livraisonGare = (Boolean) request.get("livraisonGare");

            Boolean paiementCash = (Boolean) request.get("paiementCash");
            Boolean paiementMobileMoney = (Boolean) request.get("paiementMobileMoney");
            Boolean paiementVirement = (Boolean) request.get("paiementVirement");

            // Validation
            if (titre == null || description == null || telephoneContact == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Titre, description et téléphone sont obligatoires"));
            }

            Listing listing = listingService.createListing(
                    userId, categoryId, titre, description, prix, prixNegociable, etatProduit,
                    ville, quartier, adresseComplete, telephoneContact, emailContact,
                    livraisonSurPlace, livraisonDomicile, livraisonGare,
                    paiementCash, paiementMobileMoney, paiementVirement
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Annonce créée avec succès");
            response.put("listing", createListingResponse(listing));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir toutes les annonces actives avec pagination
     * GET /api/listings?page=0&size=20
     */
    @GetMapping
    public ResponseEntity<?> getAllListings(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = listingService.getAllActiveListings(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingSummaryResponse).toList());
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
     * Obtenir une annonce par ID
     * GET /api/listings/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getListingById(@PathVariable Long id) {
        try {
            Optional<Listing> listingOpt = listingService.getListingByIdAndIncrementViews(id);

            if (!listingOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Listing listing = listingOpt.get();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listing", createListingDetailResponse(listing));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Mettre à jour une annonce
     * PUT /api/listings/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateListing(@PathVariable Long id,
                                           @RequestBody Map<String, Object> request,
                                           @RequestHeader("User-ID") Long userId) {
        try {
            String titre = (String) request.get("titre");
            String description = (String) request.get("description");
            Integer prix = request.get("prix") != null ? Integer.valueOf(request.get("prix").toString()) : null;
            Boolean prixNegociable = (Boolean) request.get("prixNegociable");
            String etatProduitStr = (String) request.get("etatProduit");
            EtatProduit etatProduit = etatProduitStr != null ? EtatProduit.valueOf(etatProduitStr) : null;
            String adresseComplete = (String) request.get("adresseComplete");

            Listing listing = listingService.updateListing(
                    id, userId, titre, description, prix, prixNegociable, etatProduit, adresseComplete
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Annonce mise à jour avec succès");
            response.put("listing", createListingResponse(listing));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Supprimer une annonce
     * DELETE /api/listings/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id,
                                           @RequestHeader("User-ID") Long userId) {
        try {
            listingService.deleteListing(id, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Annonce supprimée avec succès");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Marquer une annonce comme vendue
     * POST /api/listings/{id}/mark-sold
     */
    @PostMapping("/{id}/mark-sold")
    public ResponseEntity<?> markAsSold(@PathVariable Long id,
                                        @RequestHeader("User-ID") Long userId) {
        try {
            listingService.markAsSold(id, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Annonce marquée comme vendue");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Remonter une annonce (boost)
     * POST /api/listings/{id}/boost
     */
    @PostMapping("/{id}/boost")
    public ResponseEntity<?> boostListing(@PathVariable Long id,
                                          @RequestHeader("User-ID") Long userId) {
        try {
            listingService.boostListing(id, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Annonce remontée avec succès");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les annonces par catégorie
     * GET /api/listings/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getListingsByCategory(@PathVariable Long categoryId,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = listingService.getListingsByCategory(categoryId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingSummaryResponse).toList());
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
     * Incrémenter le compteur WhatsApp
     * POST /api/listings/{id}/whatsapp-contact
     */
    @PostMapping("/{id}/whatsapp-contact")
    public ResponseEntity<?> incrementWhatsappContact(@PathVariable Long id) {
        try {
            listingService.incrementWhatsappContacts(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Contact WhatsApp enregistré");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les annonces similaires
     * GET /api/listings/{id}/similar
     */
    @GetMapping("/{id}/similar")
    public ResponseEntity<?> getSimilarListings(@PathVariable Long id,
                                                @RequestParam(defaultValue = "5") int limit) {
        try {
            List<Listing> similarListings = listingService.getSimilarListings(id, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", similarListings.stream()
                    .map(this::createListingSummaryResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // MÉTHODES UTILITAIRES
    // ============================================

    private Map<String, Object> createListingResponse(Listing listing) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", listing.getId());
        response.put("titre", listing.getTitre());
        response.put("description", listing.getDescription());
        response.put("prix", listing.getPrix());
        response.put("prixNegociable", listing.getPrixNegociable());
        response.put("etatProduit", listing.getEtatProduit());
        response.put("ville", listing.getVille());
        response.put("quartier", listing.getQuartier());
        response.put("telephoneContact", listing.getTelephoneContact());
        response.put("statut", listing.getStatut());
        response.put("dateCreation", listing.getDateCreation());
        response.put("vues", listing.getVues());
        response.put("contactsWhatsapp", listing.getContactsWhatsapp());
        return response;
    }

    private Map<String, Object> createListingSummaryResponse(Listing listing) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", listing.getId());
        response.put("titre", listing.getTitre());
        response.put("prix", listing.getPrix());
        response.put("ville", listing.getVille());
        response.put("dateCreation", listing.getDateCreation());
        response.put("vues", listing.getVues());
        response.put("isPremium", listing.getIsPremium());
        response.put("isUrgent", listing.getIsUrgent());
        return response;
    }

    private Map<String, Object> createListingDetailResponse(Listing listing) {
        Map<String, Object> response = createListingResponse(listing);

        // Ajouter les détails supplémentaires
        response.put("adresseComplete", listing.getAdresseComplete());
        response.put("emailContact", listing.getEmailContact());
        response.put("livraisonSurPlace", listing.getLivraisonSurPlace());
        response.put("livraisonDomicile", listing.getLivraisonDomicile());
        response.put("livraisonGare", listing.getLivraisonGare());
        response.put("paiementCash", listing.getPaiementCash());
        response.put("paiementMobileMoney", listing.getPaiementMobileMoney());
        response.put("paiementVirement", listing.getPaiementVirement());

        // Ajouter les infos de l'utilisateur
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", listing.getUser().getId());
        userInfo.put("nom", listing.getUser().getNom());
        userInfo.put("isBoutique", listing.getUser().getIsBoutique());
        userInfo.put("nomBoutique", listing.getUser().getNomBoutique());
        response.put("user", userInfo);

        // Ajouter les infos de la catégorie
        Map<String, Object> categoryInfo = new HashMap<>();
        categoryInfo.put("id", listing.getCategory().getId());
        categoryInfo.put("nom", listing.getCategory().getNom());
        categoryInfo.put("emoji", listing.getCategory().getEmoji());
        response.put("category", categoryInfo);

        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}