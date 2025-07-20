package com.camerannonces.service;

import com.camerannonces.entity.Listing;
import com.camerannonces.enums.EtatProduit;
import com.camerannonces.enums.ListingStatus;
import com.camerannonces.repository.ListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SearchService {

    @Autowired
    private ListingRepository listingRepository;

    /**
     * Recherche simple par mot-clé
     */
    public Page<Listing> searchByKeyword(String keyword, Pageable pageable) {
        return listingRepository.searchByKeyword(keyword, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Recherche avec filtres basiques
     */
    public Page<Listing> searchWithBasicFilters(String keyword, Long categoryId, String ville, Pageable pageable) {
        return listingRepository.searchWithFilters(keyword, categoryId, ville, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Recherche avec tous les filtres
     */
    public Page<Listing> searchWithAllFilters(String keyword, Long categoryId, String ville, String quartier,
                                              Integer minPrix, Integer maxPrix, EtatProduit etatProduit,
                                              Boolean prixNegociable, Pageable pageable) {
        return listingRepository.findWithFilters(
                categoryId, ville, quartier, minPrix, maxPrix,
                etatProduit, prixNegociable, ListingStatus.ACTIVE, pageable
        );
    }

    /**
     * Recherche par catégorie
     */
    public Page<Listing> searchByCategory(Long categoryId, Pageable pageable) {
        return listingRepository.findByCategoryIdAndStatut(categoryId, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Recherche par ville
     */
    public Page<Listing> searchByCity(String ville, Pageable pageable) {
        return listingRepository.findByVilleAndStatut(ville, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Recherche par quartier
     */
    public Page<Listing> searchByQuartier(String quartier, Pageable pageable) {
        return listingRepository.findByQuartierAndStatut(quartier, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Recherche par fourchette de prix
     */
    public Page<Listing> searchByPriceRange(Integer minPrix, Integer maxPrix, Pageable pageable) {
        return listingRepository.findByPrixBetween(minPrix, maxPrix, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Recherche par état du produit
     */
    public Page<Listing> searchByEtatProduit(EtatProduit etat, Pageable pageable) {
        return listingRepository.findByEtatProduitAndStatut(etat, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Obtenir les annonces premium
     */
    public Page<Listing> getPremiumListings(Pageable pageable) {
        return listingRepository.findByIsPremiumTrueAndStatutOrderByDateCreationDesc(ListingStatus.ACTIVE, pageable);
    }

    /**
     * Obtenir les annonces urgentes
     */
    public Page<Listing> getUrgentListings(Pageable pageable) {
        return listingRepository.findByIsUrgentTrueAndStatutOrderByDateCreationDesc(ListingStatus.ACTIVE, pageable);
    }

    /**
     * Obtenir les annonces de boutiques
     */
    public Page<Listing> getBoutiqueListings(Pageable pageable) {
        return listingRepository.findBoutiqueListings(ListingStatus.ACTIVE, pageable);
    }

    /**
     * Obtenir les annonces les plus vues
     */
    public Page<Listing> getMostViewedListings(Pageable pageable) {
        return listingRepository.findMostViewedListings(ListingStatus.ACTIVE, pageable);
    }

    /**
     * Obtenir les annonces les plus contactées
     */
    public Page<Listing> getMostContactedListings(Pageable pageable) {
        return listingRepository.findMostContactedListings(ListingStatus.ACTIVE, pageable);
    }

    /**
     * Obtenir les annonces récentes
     */
    public Page<Listing> getRecentListings(int days, Pageable pageable) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return listingRepository.findByDateCreationAfterAndStatut(since, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Obtenir les annonces d'aujourd'hui
     */
    public List<Listing> getTodayListings() {
        return listingRepository.findTodayListings(ListingStatus.ACTIVE);
    }

    /**
     * Obtenir les annonces de cette semaine
     */
    public Page<Listing> getThisWeekListings(Pageable pageable) {
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        return listingRepository.findThisWeekListings(weekStart, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Recherche avec tri personnalisé
     */
    public Page<Listing> searchWithCustomSort(String keyword, Long categoryId, String ville,
                                              String sortBy, String sortDirection, int page, int size) {

        // Créer le sort
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ?
                Sort.Direction.DESC : Sort.Direction.ASC;

        Sort sort;
        switch (sortBy.toLowerCase()) {
            case "prix":
                sort = Sort.by(direction, "prix");
                break;
            case "date":
                sort = Sort.by(direction, "dateCreation");
                break;
            case "vues":
                sort = Sort.by(direction, "vues");
                break;
            case "titre":
                sort = Sort.by(direction, "titre");
                break;
            default:
                sort = Sort.by(Sort.Direction.DESC, "dateCreation");
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        if (keyword != null && !keyword.trim().isEmpty()) {
            return listingRepository.searchWithFilters(keyword, categoryId, ville, ListingStatus.ACTIVE, pageable);
        } else {
            return listingRepository.findWithFilters(categoryId, ville, null, null, null,
                    null, null, ListingStatus.ACTIVE, pageable);
        }
    }

    /**
     * Obtenir des suggestions de recherche
     */
    public List<Listing> getSuggestions(String keyword, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Listing> results = listingRepository.searchByKeyword(keyword, ListingStatus.ACTIVE, pageable);
        return results.getContent();
    }

    /**
     * Recherche avancée avec tous les critères
     */
    public Page<Listing> advancedSearch(String keyword, Long categoryId, String ville, String quartier,
                                        Integer minPrix, Integer maxPrix, EtatProduit etatProduit,
                                        Boolean prixNegociable, Boolean livraisonDomicile,
                                        Boolean paiementMobileMoney, Boolean isBoutique,
                                        String sortBy, String sortDirection, int page, int size) {

        // Créer le pageable avec tri
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ?
                Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy != null ? sortBy : "dateCreation");
        Pageable pageable = PageRequest.of(page, size, sort);

        // Pour l'instant, utiliser les filtres de base
        // TODO: Ajouter support pour livraisonDomicile, paiementMobileMoney, isBoutique
        return listingRepository.findWithFilters(
                categoryId, ville, quartier, minPrix, maxPrix,
                etatProduit, prixNegociable, ListingStatus.ACTIVE, pageable
        );
    }

    /**
     * Compter les résultats de recherche
     */
    public long countSearchResults(String keyword, Long categoryId, String ville) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            Page<Listing> results = listingRepository.searchWithFilters(
                    keyword, categoryId, ville, ListingStatus.ACTIVE, PageRequest.of(0, 1)
            );
            return results.getTotalElements();
        } else {
            Page<Listing> results = listingRepository.findWithFilters(
                    categoryId, ville, null, null, null, null, null,
                    ListingStatus.ACTIVE, PageRequest.of(0, 1)
            );
            return results.getTotalElements();
        }
    }
}