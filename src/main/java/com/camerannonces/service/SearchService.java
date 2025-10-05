package com.camerannonces.service;

import com.camerannonces.entity.Listing;
import com.camerannonces.enums.EtatProduit;
import com.camerannonces.enums.ListingStatus;
import com.camerannonces.repository.ListingRepository;
import com.camerannonces.util.KeywordEnricher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private ListingRepository listingRepository;

    /**
     * Recherche simple par mot-clé avec enrichissement intelligent
     */
    public Page<Listing> searchByKeyword(String keyword, Pageable pageable) {
        String enrichedKeyword = KeywordEnricher.enrich(keyword);

        // Découper en mots individuels et chercher avec chacun
        String[] words = enrichedKeyword.split("\\s+");
        Set<Listing> allResults = new HashSet<>();

        // Chercher avec chaque mot
        for (String word : words) {
            if (word.length() >= 3) { // Ignorer les mots trop courts
                Page<Listing> results = listingRepository.searchByKeyword(word, "ACTIVE", PageRequest.of(0, 100));
                allResults.addAll(results.getContent());
            }
        }

        // Convertir Set en List et paginer
        List<Listing> resultList = allResults.stream()
                .sorted((a, b) -> b.getDateCreation().compareTo(a.getDateCreation()))
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), resultList.size());

        if (start >= resultList.size()) {
            return new PageImpl<>(List.of(), pageable, resultList.size());
        }

        List<Listing> pageContent = resultList.subList(start, end);
        return new PageImpl<>(pageContent, pageable, resultList.size());
    }

    /**
     * Recherche avec filtres basiques et enrichissement intelligent
     */
    public Page<Listing> searchWithBasicFilters(String keyword, Long categoryId, String ville, Pageable pageable) {
        String enrichedKeyword = KeywordEnricher.enrich(keyword);

        // Découper et chercher
        String[] words = enrichedKeyword.split("\\s+");
        Set<Listing> allResults = new HashSet<>();

        for (String word : words) {
            if (word.length() >= 3) {
                Page<Listing> results = listingRepository.searchWithFilters(word, categoryId, ville, "ACTIVE", PageRequest.of(0, 100));
                allResults.addAll(results.getContent());
            }
        }

        List<Listing> resultList = allResults.stream()
                .sorted((a, b) -> b.getDateCreation().compareTo(a.getDateCreation()))
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), resultList.size());

        if (start >= resultList.size()) {
            return new PageImpl<>(List.of(), pageable, resultList.size());
        }

        List<Listing> pageContent = resultList.subList(start, end);
        return new PageImpl<>(pageContent, pageable, resultList.size());
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
     * Recherche avec tri personnalisé et enrichissement intelligent
     */
    public Page<Listing> searchWithCustomSort(String keyword, Long categoryId, String ville,
                                              String sortBy, String sortDirection, int page, int size) {

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
            String enrichedKeyword = KeywordEnricher.enrich(keyword);
            String[] words = enrichedKeyword.split("\\s+");
            Set<Listing> allResults = new HashSet<>();

            for (String word : words) {
                if (word.length() >= 3) {
                    Page<Listing> results = listingRepository.searchWithFilters(word, categoryId, ville, "ACTIVE", PageRequest.of(0, 100));
                    allResults.addAll(results.getContent());
                }
            }

            List<Listing> resultList = allResults.stream()
                    .sorted((a, b) -> b.getDateCreation().compareTo(a.getDateCreation()))
                    .collect(Collectors.toList());

            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), resultList.size());

            if (start >= resultList.size()) {
                return new PageImpl<>(List.of(), pageable, resultList.size());
            }

            List<Listing> pageContent = resultList.subList(start, end);
            return new PageImpl<>(pageContent, pageable, resultList.size());
        } else {
            return listingRepository.findWithFilters(categoryId, ville, null, null, null,
                    null, null, ListingStatus.ACTIVE, pageable);
        }
    }

    /**
     * Obtenir des suggestions de recherche avec enrichissement intelligent
     */
    public List<Listing> getSuggestions(String keyword, int limit) {
        String enrichedKeyword = KeywordEnricher.enrich(keyword);
        String[] words = enrichedKeyword.split("\\s+");
        Set<Listing> allResults = new HashSet<>();

        for (String word : words) {
            if (word.length() >= 3) {
                Page<Listing> results = listingRepository.searchByKeyword(word, "ACTIVE", PageRequest.of(0, limit));
                allResults.addAll(results.getContent());
                if (allResults.size() >= limit) break;
            }
        }

        return allResults.stream()
                .sorted((a, b) -> b.getDateCreation().compareTo(a.getDateCreation()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Recherche avancée avec tous les critères
     */
    public Page<Listing> advancedSearch(String keyword, Long categoryId, String ville, String quartier,
                                        Integer minPrix, Integer maxPrix, EtatProduit etatProduit,
                                        Boolean prixNegociable, Boolean livraisonDomicile,
                                        Boolean paiementMobileMoney, Boolean isBoutique,
                                        String sortBy, String sortDirection, int page, int size) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ?
                Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy != null ? sortBy : "dateCreation");
        Pageable pageable = PageRequest.of(page, size, sort);

        // TODO: Ajouter support pour livraisonDomicile, paiementMobileMoney, isBoutique
        return listingRepository.findWithFilters(
                categoryId, ville, quartier, minPrix, maxPrix,
                etatProduit, prixNegociable, ListingStatus.ACTIVE, pageable
        );
    }

    /**
     * Compter les résultats de recherche avec enrichissement intelligent
     */
    public long countSearchResults(String keyword, Long categoryId, String ville) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            String enrichedKeyword = KeywordEnricher.enrich(keyword);
            String[] words = enrichedKeyword.split("\\s+");
            Set<Listing> allResults = new HashSet<>();

            for (String word : words) {
                if (word.length() >= 3) {
                    Page<Listing> results = listingRepository.searchWithFilters(
                            word, categoryId, ville, "ACTIVE", PageRequest.of(0, 100)
                    );
                    allResults.addAll(results.getContent());
                }
            }

            return allResults.size();
        } else {
            Page<Listing> results = listingRepository.findWithFilters(
                    categoryId, ville, null, null, null, null, null,
                    ListingStatus.ACTIVE, PageRequest.of(0, 1)
            );
            return results.getTotalElements();
        }
    }
}