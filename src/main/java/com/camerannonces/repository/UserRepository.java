package com.camerannonces.repository;

import com.camerannonces.entity.User;
import com.camerannonces.enums.PlanType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Recherche de base
    Optional<User> findByTelephone(String telephone);
    Optional<User> findByEmail(String email);
    boolean existsByTelephone(String telephone);
    boolean existsByEmail(String email);

    // Recherche par localisation
    List<User> findByVille(String ville);
    List<User> findByVilleAndQuartier(String ville, String quartier);

    // Recherche par type
    List<User> findByIsBoutiqueTrue(Pageable pageable);
    List<User> findByIsBoutiqueFalse();

    // Recherche par plan
    List<User> findByPlanActuel(PlanType planActuel);
    Page<User> findByPlanActuel(PlanType planActuel, Pageable pageable);

    // Utilisateurs actifs
    List<User> findByIsActiveTrue();
    Page<User> findByIsActiveTrue(Pageable pageable);

    // Recherche par dates
    List<User> findByDateCreationAfter(LocalDateTime date);
    List<User> findByDerniereConnexionAfter(LocalDateTime date);

    // Plans expirés
    @Query("SELECT u FROM User u WHERE u.dateExpirationPlan < :now AND u.planActuel != 'GRATUIT'")
    List<User> findUsersWithExpiredPlan(@Param("now") LocalDateTime now);

    // Statistiques
    @Query("SELECT COUNT(u) FROM User u WHERE u.isBoutique = true")
    long countBoutiques();

    @Query("SELECT u.planActuel, COUNT(u) FROM User u GROUP BY u.planActuel")
    List<Object[]> countUsersByPlan();

    // Recherche textuelle
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.nomBoutique) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.nomBoutique) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}