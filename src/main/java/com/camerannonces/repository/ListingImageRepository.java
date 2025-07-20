package com.camerannonces.repository;

import com.camerannonces.entity.ListingImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ListingImageRepository extends JpaRepository<ListingImage, Long> {

    // Recherche par annonce
    List<ListingImage> findByListingIdOrderByOrdreAffichage(Long listingId);
    List<ListingImage> findByListingId(Long listingId);

    // Image principale
    Optional<ListingImage> findByListingIdAndIsPrincipaleTrue(Long listingId);

    // Nombre d'images par annonce
    @Query("SELECT COUNT(li) FROM ListingImage li WHERE li.listing.id = :listingId")
    long countByListingId(@Param("listingId") Long listingId);

    // Images récentes
    List<ListingImage> findByDateUploadAfterOrderByDateUploadDesc(LocalDateTime date);

    // Suppression en masse
    void deleteByListingId(Long listingId);

    // Statistiques
    @Query("SELECT AVG(li.tailleFichier) FROM ListingImage li")
    Double getAverageFileSize();

    @Query("SELECT SUM(li.tailleFichier) FROM ListingImage li")
    Long getTotalStorageUsed();

    // Images par URL
    boolean existsByUrl(String url);
    Optional<ListingImage> findByUrl(String url);
}