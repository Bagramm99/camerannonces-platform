package com.camerannonces.repository;

import com.camerannonces.entity.UserFavorite;
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
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {

    // Recherche par utilisateur
    List<UserFavorite> findByUserIdOrderByDateAjoutDesc(Long userId);
    Page<UserFavorite> findByUserId(Long userId, Pageable pageable);

    // Recherche par annonce
    List<UserFavorite> findByListingId(Long listingId);
    long countByListingId(Long listingId);

    // Vérifier si existe
    boolean existsByUserIdAndListingId(Long userId, Long listingId);
    Optional<UserFavorite> findByUserIdAndListingId(Long userId, Long listingId);

    // Supprimer favori
    void deleteByUserIdAndListingId(Long userId, Long listingId);

    // Favoris récents
    List<UserFavorite> findByDateAjoutAfterOrderByDateAjoutDesc(LocalDateTime date);

    // Statistiques par utilisateur
    @Query("SELECT COUNT(uf) FROM UserFavorite uf WHERE uf.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    // Annonces les plus aimées
    @Query("SELECT uf.listing, COUNT(uf) FROM UserFavorite uf " +
            "GROUP BY uf.listing " +
            "ORDER BY COUNT(uf) DESC")
    List<Object[]> findMostFavoritedListings();

    @Query("SELECT uf.listing, COUNT(uf) FROM UserFavorite uf " +
            "WHERE uf.listing.statut = 'ACTIVE' " +
            "GROUP BY uf.listing " +
            "ORDER BY COUNT(uf) DESC")
    Page<Object[]> findMostFavoritedActiveListings(Pageable pageable);

    // Utilisateurs les plus actifs
    @Query("SELECT uf.user, COUNT(uf) FROM UserFavorite uf " +
            "GROUP BY uf.user " +
            "ORDER BY COUNT(uf) DESC")
    List<Object[]> findMostActiveFavoriteUsers();
}