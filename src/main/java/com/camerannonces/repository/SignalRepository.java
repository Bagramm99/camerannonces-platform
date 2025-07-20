package com.camerannonces.repository;

import com.camerannonces.entity.Signal;
import com.camerannonces.enums.SignalReason;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SignalRepository extends JpaRepository<Signal, Long> {

    // Recherche par annonce
    List<Signal> findByListingIdOrderByDateSignalementDesc(Long listingId);
    long countByListingId(Long listingId);

    // Recherche par utilisateur
    List<Signal> findByUserIdOrderByDateSignalementDesc(Long userId);
    Page<Signal> findByUserId(Long userId, Pageable pageable);

    // Recherche par statut
    List<Signal> findByStatutOrderByDateSignalementDesc(String statut);
    Page<Signal> findByStatut(String statut, Pageable pageable);

    // Signalements en attente
    List<Signal> findByStatutOrderByDateSignalementAsc(String statut);
    Page<Signal> findByStatutEquals(String statut, Pageable pageable);

    // Recherche par motif
    List<Signal> findByMotif(SignalReason motif);
    List<Signal> findByMotifAndStatut(SignalReason motif, String statut);

    // Signalements récents
    List<Signal> findByDateSignalementAfterOrderByDateSignalementDesc(LocalDateTime date);

    // Statistiques par motif
    @Query("SELECT s.motif, COUNT(s) FROM Signal s GROUP BY s.motif ORDER BY COUNT(s) DESC")
    List<Object[]> countSignalsByReason();

    // Statistiques par statut
    @Query("SELECT s.statut, COUNT(s) FROM Signal s GROUP BY s.statut")
    List<Object[]> countSignalsByStatus();

    // Annonces les plus signalées
    @Query("SELECT s.listing, COUNT(s) FROM Signal s " +
            "GROUP BY s.listing " +
            "ORDER BY COUNT(s) DESC")
    List<Object[]> findMostReportedListings();

    @Query("SELECT s.listing, COUNT(s) FROM Signal s " +
            "WHERE s.statut = 'EN_ATTENTE' " +
            "GROUP BY s.listing " +
            "HAVING COUNT(s) >= :threshold " +
            "ORDER BY COUNT(s) DESC")
    List<Object[]> findListingsWithMultipleReports(@Param("threshold") long threshold);

    // Utilisateurs les plus signalés
    @Query("SELECT s.listing.user, COUNT(s) FROM Signal s " +
            "GROUP BY s.listing.user " +
            "ORDER BY COUNT(s) DESC")
    List<Object[]> findMostReportedUsers();

    // Signalements traités par admin
    List<Signal> findByAdminIdOrderByDateTraitementDesc(Long adminId);

    // Vérifier si une annonce a déjà été signalée par un utilisateur
    boolean existsByUserIdAndListingId(Long userId, Long listingId);

    // Signalements par période
    @Query("SELECT s FROM Signal s WHERE s.dateSignalement BETWEEN :start AND :end")
    List<Signal> findByDateSignalementBetween(@Param("start") LocalDateTime start,
                                              @Param("end") LocalDateTime end);
}