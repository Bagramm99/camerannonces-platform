package com.camerannonces.repository;

import com.camerannonces.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    // Recherche de base
    Optional<City> findByNom(String nom);
    List<City> findByRegion(String region);
    List<City> findByNomContainingIgnoreCase(String nom);

    // Villes actives
    List<City> findByIsActiveTrueOrderByNom();
    List<City> findByIsActiveTrue();
    List<City> findByRegionAndIsActiveTrue(String region);

    // Statistiques par région
    @Query("SELECT c.region, COUNT(c) FROM City c GROUP BY c.region ORDER BY c.region")
    List<Object[]> countCitiesByRegion();

    // Recherche textuelle
    @Query("SELECT c FROM City c WHERE " +
            "LOWER(c.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.region) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<City> searchByKeyword(@Param("keyword") String keyword);

    // Villes avec annonces
    @Query("SELECT DISTINCT c FROM City c " +
            "JOIN Listing l ON l.ville = c.nom " +
            "WHERE l.statut = 'ACTIVE'")
    List<City> findCitiesWithActiveListings();

    // Villes populaires (avec le plus d'annonces)
    @Query("SELECT c, COUNT(l) FROM City c " +
            "LEFT JOIN Listing l ON l.ville = c.nom " +
            "WHERE l.statut = 'ACTIVE' " +
            "GROUP BY c " +
            "ORDER BY COUNT(l) DESC")
    List<Object[]> findMostPopularCities();

    // Toutes les régions distinctes
    @Query("SELECT DISTINCT c.region FROM City c ORDER BY c.region")
    List<String> findAllRegions();
}