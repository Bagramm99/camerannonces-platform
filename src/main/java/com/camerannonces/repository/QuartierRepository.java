package com.camerannonces.repository;

import com.camerannonces.entity.Quartier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuartierRepository extends JpaRepository<Quartier, Long> {

    // Recherche de base
    List<Quartier> findByCityId(Long cityId);
    List<Quartier> findByCityIdAndIsActiveTrue(Long cityId);
    Optional<Quartier> findByNomAndCityId(String nom, Long cityId);

    // Recherche par ville
    @Query("SELECT q FROM Quartier q JOIN q.city c WHERE c.nom = :cityName")
    List<Quartier> findByCityName(@Param("cityName") String cityName);

    @Query("SELECT q FROM Quartier q JOIN q.city c " +
            "WHERE c.nom = :cityName AND q.isActive = true")
    List<Quartier> findByCityNameAndActive(@Param("cityName") String cityName);

    // Recherche par région
    @Query("SELECT q FROM Quartier q JOIN q.city c WHERE c.region = :region")
    List<Quartier> findByRegion(@Param("region") String region);

    // Quartiers actifs
    List<Quartier> findByIsActiveTrueOrderByNom();

    // Recherche textuelle
    @Query("SELECT q FROM Quartier q JOIN q.city c WHERE " +
            "LOWER(q.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.nom) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Quartier> searchByKeyword(@Param("keyword") String keyword);

    // Quartiers avec annonces
    @Query("SELECT DISTINCT q FROM Quartier q " +
            "JOIN Listing l ON l.quartier = q.nom " +
            "WHERE l.statut = 'ACTIVE'")
    List<Quartier> findQuartiersWithActiveListings();

    // Statistiques
    @Query("SELECT q, COUNT(l) FROM Quartier q " +
            "LEFT JOIN Listing l ON l.quartier = q.nom " +
            "WHERE l.statut = 'ACTIVE' " +
            "GROUP BY q " +
            "ORDER BY COUNT(l) DESC")
    List<Object[]> findMostPopularQuartiers();
}