package com.camerannonces.repository;

import com.camerannonces.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Recherche de base
    Optional<Category> findByNom(String nom);
    Optional<Category> findByNomAnglais(String nomAnglais);

    // Catégories actives
    List<Category> findByIsActiveTrueOrderByOrdreAffichage();
    List<Category> findByIsActiveTrue();

    // Recherche textuelle
    @Query("SELECT c FROM Category c WHERE " +
            "LOWER(c.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.nomAnglais) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Category> searchByKeyword(@Param("keyword") String keyword);

    // Statistiques
    @Query("SELECT c, COUNT(l) FROM Category c LEFT JOIN c.listings l GROUP BY c")
    List<Object[]> getCategoriesWithListingCount();

    @Query("SELECT c FROM Category c LEFT JOIN c.listings l " +
            "WHERE l.statut = 'ACTIVE' " +
            "GROUP BY c " +
            "ORDER BY COUNT(l) DESC")
    List<Category> findMostPopularCategories();

    // Ordre d'affichage
    List<Category> findAllByOrderByOrdreAffichage();
    Optional<Category> findTopByOrderByOrdreAffichageDesc();
}