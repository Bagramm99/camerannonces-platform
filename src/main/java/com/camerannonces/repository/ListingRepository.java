package com.camerannonces.repository;

import com.camerannonces.entity.Listing;
import com.camerannonces.enums.EtatProduit;
import com.camerannonces.enums.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    // ============================================
    // RECHERCHES DE BASE
    // ============================================

    // Recherche par statut (CORRIGÉ - Une seule méthode de chaque)
    List<Listing> findByStatutOrderByDateCreationDesc(ListingStatus statut);
    Page<Listing> findByStatut(ListingStatus statut, Pageable pageable);

    // Recherche par utilisateur
    List<Listing> findByUserIdOrderByDateCreationDesc(Long userId);
    Page<Listing> findByUserId(Long userId, Pageable pageable);
    Page<Listing> findByUserIdAndStatut(Long userId, ListingStatus statut, Pageable pageable);

    // Recherche par catégorie
    List<Listing> findByCategoryIdAndStatutOrderByDateCreationDesc(Long categoryId, ListingStatus statut);
    Page<Listing> findByCategoryIdAndStatut(Long categoryId, ListingStatus statut, Pageable pageable);

    // ============================================
    // RECHERCHES PAR LOCALISATION
    // ============================================

    // Par ville
    List<Listing> findByVilleAndStatutOrderByDateCreationDesc(String ville, ListingStatus statut);
    Page<Listing> findByVilleAndStatut(String ville, ListingStatus statut, Pageable pageable);

    // Par ville et catégorie
    Page<Listing> findByVilleAndCategoryIdAndStatut(String ville, Long categoryId,
                                                    ListingStatus statut, Pageable pageable);

    // Par quartier
    Page<Listing> findByQuartierAndStatut(String quartier, ListingStatus statut, Pageable pageable);

    // Par ville et quartier
    Page<Listing> findByVilleAndQuartierAndStatut(String ville, String quartier,
                                                  ListingStatus statut, Pageable pageable);

    // ============================================
    // RECHERCHES PAR PRIX
    // ============================================

    // Prix entre min et max
    @Query("SELECT l FROM Listing l WHERE l.statut = :statut " +
            "AND l.prix BETWEEN :minPrix AND :maxPrix " +
            "ORDER BY l.dateCreation DESC")
    Page<Listing> findByPrixBetween(@Param("minPrix") Integer minPrix,
                                    @Param("maxPrix") Integer maxPrix,
                                    @Param("statut") ListingStatus statut,
                                    Pageable pageable);

    // Prix maximum
    Page<Listing> findByPrixLessThanEqualAndStatut(Integer maxPrix, ListingStatus statut, Pageable pageable);

    // Prix minimum
    Page<Listing> findByPrixGreaterThanEqualAndStatut(Integer minPrix, ListingStatus statut, Pageable pageable);

    // Prix négociable
    Page<Listing> findByPrixNegociableAndStatut(Boolean negociable, ListingStatus statut, Pageable pageable);

    // ============================================
    // RECHERCHES PAR ÉTAT
    // ============================================

    Page<Listing> findByEtatProduitAndStatut(EtatProduit etat, ListingStatus statut, Pageable pageable);

    // ============================================
    // RECHERCHES COMBINÉES AVANCÉES
    // ============================================

    // Recherche complète avec tous les filtres
    @Query("SELECT l FROM Listing l WHERE " +
            "(:categoryId IS NULL OR l.category.id = :categoryId) AND " +
            "(:ville IS NULL OR l.ville = :ville) AND " +
            "(:quartier IS NULL OR l.quartier = :quartier) AND " +
            "(:minPrix IS NULL OR l.prix >= :minPrix) AND " +
            "(:maxPrix IS NULL OR l.prix <= :maxPrix) AND " +
            "(:etatProduit IS NULL OR l.etatProduit = :etatProduit) AND " +
            "(:prixNegociable IS NULL OR l.prixNegociable = :prixNegociable) AND " +
            "l.statut = :statut")
    Page<Listing> findWithFilters(@Param("categoryId") Long categoryId,
                                  @Param("ville") String ville,
                                  @Param("quartier") String quartier,
                                  @Param("minPrix") Integer minPrix,
                                  @Param("maxPrix") Integer maxPrix,
                                  @Param("etatProduit") EtatProduit etatProduit,
                                  @Param("prixNegociable") Boolean prixNegociable,
                                  @Param("statut") ListingStatus statut,
                                  Pageable pageable);

    // ============================================
    // RECHERCHE TEXTUELLE
    // ============================================

    // Recherche dans titre et description
    @Query("SELECT l FROM Listing l WHERE l.statut = :statut AND " +
            "(LOWER(l.titre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Listing> searchByKeyword(@Param("keyword") String keyword,
                                  @Param("statut") ListingStatus statut,
                                  Pageable pageable);

    // Recherche textuelle avec filtres
    @Query("SELECT l FROM Listing l WHERE l.statut = :statut AND " +
            "(:categoryId IS NULL OR l.category.id = :categoryId) AND " +
            "(:ville IS NULL OR l.ville = :ville) AND " +
            "(LOWER(l.titre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Listing> searchWithFilters(@Param("keyword") String keyword,
                                    @Param("categoryId") Long categoryId,
                                    @Param("ville") String ville,
                                    @Param("statut") ListingStatus statut,
                                    Pageable pageable);

    // ============================================
    // ANNONCES PREMIUM ET SPÉCIALES
    // ============================================

    // Annonces premium
    Page<Listing> findByIsPremiumTrueAndStatutOrderByDateCreationDesc(ListingStatus statut, Pageable pageable);

    // Annonces urgentes
    Page<Listing> findByIsUrgentTrueAndStatutOrderByDateCreationDesc(ListingStatus statut, Pageable pageable);

    // Annonces vérifiées
    Page<Listing> findByIsVerifiedTrueAndStatutOrderByDateCreationDesc(ListingStatus statut, Pageable pageable);

    // Annonces de boutiques
    @Query("SELECT l FROM Listing l WHERE l.user.isBoutique = true AND l.statut = :statut")
    Page<Listing> findBoutiqueListings(@Param("statut") ListingStatus statut, Pageable pageable);

    // ============================================
    // RECHERCHES PAR DATE
    // ============================================

    // Annonces récentes
    List<Listing> findByDateCreationAfterAndStatutOrderByDateCreationDesc(LocalDateTime date, ListingStatus statut);
    Page<Listing> findByDateCreationAfterAndStatut(LocalDateTime date, ListingStatus statut, Pageable pageable);

    // Annonces d'aujourd'hui
    @Query("SELECT l FROM Listing l WHERE l.statut = :statut AND " +
            "CAST(l.dateCreation AS date) = CURRENT_DATE " +
            "ORDER BY l.dateCreation DESC")
    List<Listing> findTodayListings(@Param("statut") ListingStatus statut);

    // Annonces de cette semaine
    @Query("SELECT l FROM Listing l WHERE l.statut = :statut AND " +
            "l.dateCreation >= :weekStart ORDER BY l.dateCreation DESC")
    Page<Listing> findThisWeekListings(@Param("weekStart") LocalDateTime weekStart,
                                       @Param("statut") ListingStatus statut,
                                       Pageable pageable);

    // ============================================
    // ANNONCES POPULAIRES ET STATISTIQUES
    // ============================================

    // Annonces les plus vues
    @Query("SELECT l FROM Listing l WHERE l.statut = :statut ORDER BY l.vues DESC")
    Page<Listing> findMostViewedListings(@Param("statut") ListingStatus statut, Pageable pageable);

    // Annonces avec le plus de contacts WhatsApp
    @Query("SELECT l FROM Listing l WHERE l.statut = :statut ORDER BY l.contactsWhatsapp DESC")
    Page<Listing> findMostContactedListings(@Param("statut") ListingStatus statut, Pageable pageable);

    // Annonces similaires (même catégorie et ville)
    @Query("SELECT l FROM Listing l WHERE l.statut = :statut AND " +
            "l.category.id = :categoryId AND l.ville = :ville AND l.id != :excludeId " +
            "ORDER BY l.dateCreation DESC")
    List<Listing> findSimilarListings(@Param("categoryId") Long categoryId,
                                      @Param("ville") String ville,
                                      @Param("excludeId") Long excludeId,
                                      @Param("statut") ListingStatus statut,
                                      Pageable pageable);

    // ============================================
    // ANNONCES EXPIRÉES ET GESTION
    // ============================================

    // Annonces expirées
    @Query("SELECT l FROM Listing l WHERE l.dateExpiration < :now AND l.statut = 'ACTIVE'")
    List<Listing> findExpiredListings(@Param("now") LocalDateTime now);

    // Annonces à expirer bientôt
    @Query("SELECT l FROM Listing l WHERE l.dateExpiration BETWEEN :now AND :soon AND l.statut = 'ACTIVE'")
    List<Listing> findListingsExpiringSoon(@Param("now") LocalDateTime now,
                                           @Param("soon") LocalDateTime soon);

    // ============================================
    // STATISTIQUES
    // ============================================

    // Compter par statut
    long countByStatut(ListingStatus statut);

    // Compter par catégorie
    @Query("SELECT l.category.nom, COUNT(l) FROM Listing l WHERE l.statut = :statut GROUP BY l.category")
    List<Object[]> countByCategory(@Param("statut") ListingStatus statut);

    // Compter par ville
    @Query("SELECT l.ville, COUNT(l) FROM Listing l WHERE l.statut = :statut GROUP BY l.ville ORDER BY COUNT(l) DESC")
    List<Object[]> countByCity(@Param("statut") ListingStatus statut);

    // Compter par mois
    @Query("SELECT YEAR(l.dateCreation), MONTH(l.dateCreation), COUNT(l) FROM Listing l " +
            "WHERE l.statut = :statut GROUP BY YEAR(l.dateCreation), MONTH(l.dateCreation) " +
            "ORDER BY YEAR(l.dateCreation) DESC, MONTH(l.dateCreation) DESC")
    List<Object[]> countByMonth(@Param("statut") ListingStatus statut);

    // ============================================
    // MÉTHODES DE MISE À JOUR
    // ============================================

    // Incrémenter les vues
    @Modifying
    @Query("UPDATE Listing l SET l.vues = l.vues + 1 WHERE l.id = :id")
    void incrementViews(@Param("id") Long id);

    // Incrémenter les contacts WhatsApp
    @Modifying
    @Query("UPDATE Listing l SET l.contactsWhatsapp = l.contactsWhatsapp + 1 WHERE l.id = :id")
    void incrementWhatsappContacts(@Param("id") Long id);

    // Mettre à jour le statut
    @Modifying
    @Query("UPDATE Listing l SET l.statut = :statut WHERE l.id = :id")
    void updateStatus(@Param("id") Long id, @Param("statut") ListingStatus statut);

    // Marquer comme premium
    @Modifying
    @Query("UPDATE Listing l SET l.isPremium = :premium, l.dateDerniereRemontee = :now WHERE l.id = :id")
    void updatePremiumStatus(@Param("id") Long id, @Param("premium") Boolean premium, @Param("now") LocalDateTime now);

    // Remonter une annonce
    @Modifying
    @Query("UPDATE Listing l SET l.dateDerniereRemontee = :now WHERE l.id = :id")
    void boostListing(@Param("id") Long id, @Param("now") LocalDateTime now);

    // Marquer comme expiré
    @Modifying
    @Query("UPDATE Listing l SET l.statut = 'EXPIRE' WHERE l.dateExpiration < :now AND l.statut = 'ACTIVE'")
    int markExpiredListings(@Param("now") LocalDateTime now);
}