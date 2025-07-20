package com.camerannonces.controller;

import com.camerannonces.entity.Listing;
import com.camerannonces.enums.EtatProduit;
import com.camerannonces.service.SearchService;
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
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private SearchService searchService;

    /**
     * Recherche simple par mot-clé
     * GET /api/search?keyword=iphone&page=0&size=20
     */
    @GetMapping
    public ResponseEntity<?> searchByKeyword(@RequestParam(required = false) String keyword,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings;

            if (keyword == null || keyword.trim().isEmpty()) {
                // Si pas de mot-clé, retourner toutes les annonces actives
                listings = searchService.searchByKeyword("", pageable);
            } else {
                listings = searchService.searchByKeyword(keyword, pageable);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingResponse).toList());
            response.put("totalElements", listings.getTotalElements());
            response.put("totalPages", listings.getTotalPages());
            response.put("currentPage", page);
            response.put("keyword", keyword);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Recherche avec filtres basiques
     * GET /api/search/filter?keyword=iphone&categoryId=1&ville=Douala
     */
    @GetMapping("/filter")
    public ResponseEntity<?> searchWithBasicFilters(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String ville,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = searchService.searchWithBasicFilters(keyword, categoryId, ville, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingResponse).toList());
            response.put("totalElements", listings.getTotalElements());
            response.put("totalPages", listings.getTotalPages());
            response.put("currentPage", page);
            response.put("filters", Map.of(
                    "keyword", keyword,
                    "categoryId", categoryId,
                    "ville", ville
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Recherche avancée avec tous les filtres
     * POST /api/search/advanced
     */
    @PostMapping("/advanced")
    public ResponseEntity<?> advancedSearch(@RequestBody Map<String, Object> filters) {
        try {
            String keyword = (String) filters.get("keyword");
            Long categoryId = filters.get("categoryId") != null ?
                    Long.valueOf(filters.get("categoryId").toString()) : null;
            String ville = (String) filters.get("ville");
            String quartier = (String) filters.get("quartier");
            Integer minPrix = filters.get("minPrix") != null ?
                    Integer.valueOf(filters.get("minPrix").toString()) : null;
            Integer maxPrix = filters.get("maxPrix") != null ?
                    Integer.valueOf(filters.get("maxPrix").toString()) : null;
            String etatProduitStr = (String) filters.get("etatProduit");
            EtatProduit etatProduit = etatProduitStr != null ? EtatProduit.valueOf(etatProduitStr) : null;
            Boolean prixNegociable = (Boolean) filters.get("prixNegociable");
            Boolean livraisonDomicile = (Boolean) filters.get("livraisonDomicile");
            Boolean paiementMobileMoney = (Boolean) filters.get("paiementMobileMoney");
            Boolean isBoutique = (Boolean) filters.get("isBoutique");
            String sortBy = (String) filters.getOrDefault("sortBy", "dateCreation");
            String sortDirection = (String) filters.getOrDefault("sortDirection", "desc");
            int page = filters.get("page") != null ? Integer.valueOf(filters.get("page").toString()) : 0;
            int size = filters.get("size") != null ? Integer.valueOf(filters.get("size").toString()) : 20;

            Page<Listing> listings = searchService.advancedSearch(
                    keyword, categoryId, ville, quartier, minPrix, maxPrix,
                    etatProduit, prixNegociable, livraisonDomicile, paiementMobileMoney,
                    isBoutique, sortBy, sortDirection, page, size
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingResponse).toList());
            response.put("totalElements", listings.getTotalElements());
            response.put("totalPages", listings.getTotalPages());
            response.put("currentPage", page);
            response.put("appliedFilters", filters);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Recherche par catégorie
     * GET /api/search/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> searchByCategory(@PathVariable Long categoryId,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = searchService.searchByCategory(categoryId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingResponse).toList());
            response.put("totalElements", listings.getTotalElements());
            response.put("totalPages", listings.getTotalPages());
            response.put("currentPage", page);
            response.put("categoryId", categoryId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Recherche par ville
     * GET /api/search/city/{ville}
     */
    @GetMapping("/city/{ville}")
    public ResponseEntity<?> searchByCity(@PathVariable String ville,
                                          @RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = searchService.searchByCity(ville, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingResponse).toList());
            response.put("totalElements", listings.getTotalElements());
            response.put("totalPages", listings.getTotalPages());
            response.put("currentPage", page);
            response.put("ville", ville);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Recherche par fourchette de prix
     * GET /api/search/price?min=50000&max=500000
     */
    @GetMapping("/price")
    public ResponseEntity<?> searchByPriceRange(@RequestParam Integer min,
                                                @RequestParam Integer max,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = searchService.searchByPriceRange(min, max, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingResponse).toList());
            response.put("totalElements", listings.getTotalElements());
            response.put("totalPages", listings.getTotalPages());
            response.put("currentPage", page);
            response.put("priceRange", Map.of("min", min, "max", max));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les annonces premium
     * GET /api/search/premium
     */
    @GetMapping("/premium")
    public ResponseEntity<?> getPremiumListings(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = searchService.getPremiumListings(pageable);

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
     * Obtenir les annonces urgentes
     * GET /api/search/urgent
     */
    @GetMapping("/urgent")
    public ResponseEntity<?> getUrgentListings(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = searchService.getUrgentListings(pageable);

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
     * Obtenir les annonces de boutiques
     * GET /api/search/boutiques
     */
    @GetMapping("/boutiques")
    public ResponseEntity<?> getBoutiqueListings(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = searchService.getBoutiqueListings(pageable);

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
     * Obtenir les annonces les plus vues
     * GET /api/search/most-viewed
     */
    @GetMapping("/most-viewed")
    public ResponseEntity<?> getMostViewedListings(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = searchService.getMostViewedListings(pageable);

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
     * Obtenir les annonces récentes
     * GET /api/search/recent?days=7
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentListings(@RequestParam(defaultValue = "7") int days,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Listing> listings = searchService.getRecentListings(days, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("listings", listings.getContent().stream()
                    .map(this::createListingResponse).toList());
            response.put("totalElements", listings.getTotalElements());
            response.put("totalPages", listings.getTotalPages());
            response.put("currentPage", page);
            response.put("days", days);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir des suggestions de recherche
     * GET /api/search/suggestions?keyword=tel
     */
    @GetMapping("/suggestions")
    public ResponseEntity<?> getSuggestions(@RequestParam String keyword,
                                            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Listing> suggestions = searchService.getSuggestions(keyword, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("suggestions", suggestions.stream()
                    .map(listing -> Map.of(
                            "id", listing.getId(),
                            "titre", listing.getTitre(),
                            "prix", listing.getPrix(),
                            "ville", listing.getVille()
                    )).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Compter les résultats de recherche
     * GET /api/search/count?keyword=iphone&categoryId=1
     */
    @GetMapping("/count")
    public ResponseEntity<?> countSearchResults(@RequestParam(required = false) String keyword,
                                                @RequestParam(required = false) Long categoryId,
                                                @RequestParam(required = false) String ville) {
        try {
            long count = searchService.countSearchResults(keyword, categoryId, ville);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", count);
            response.put("filters", Map.of(
                    "keyword", keyword,
                    "categoryId", categoryId,
                    "ville", ville
            ));

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
        response.put("dateCreation", listing.getDateCreation());
        response.put("vues", listing.getVues());
        response.put("contactsWhatsapp", listing.getContactsWhatsapp());
        response.put("isPremium", listing.getIsPremium());
        response.put("isUrgent", listing.getIsUrgent());

        // Infos utilisateur
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", listing.getUser().getId());
        userInfo.put("nom", listing.getUser().getNom());
        userInfo.put("isBoutique", listing.getUser().getIsBoutique());
        userInfo.put("nomBoutique", listing.getUser().getNomBoutique());
        response.put("user", userInfo);

        // Infos catégorie
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