package com.camerannonces.service;

import com.camerannonces.entity.Listing;
import com.camerannonces.entity.ListingImage;
import com.camerannonces.repository.ListingImageRepository;
import com.camerannonces.repository.ListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ImageService {

    @Autowired
    private ListingImageRepository listingImageRepository;

    @Autowired
    private ListingRepository listingRepository;

    // Dossier de stockage des images (à configurer selon votre environnement)
    private final String uploadDir = "uploads/images/";

    /**
     * Sauvegarder une image pour une annonce
     */
    public ListingImage saveImage(Long listingId, MultipartFile file, boolean isPrincipale) {
        // Vérifier que l'annonce existe
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        // Vérifier le nombre d'images existantes
        long imageCount = listingImageRepository.countByListingId(listingId);
        int maxImages = getMaxImagesForUser(listing.getUser().getPlanActuel());

        if (imageCount >= maxImages) {
            throw new RuntimeException("Vous avez atteint le nombre maximum d'images pour votre plan (" + maxImages + ")");
        }

        // Valider le fichier
        validateImageFile(file);

        try {
            // Créer le dossier s'il n'existe pas
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Générer un nom unique pour le fichier
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;

            // Sauvegarder le fichier
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // Créer l'entrée en base de données
            ListingImage image = new ListingImage();
            image.setListing(listing);
            image.setUrl("/images/" + filename); // URL relative
            image.setNomFichier(originalFilename);
            image.setTailleFichier((int) file.getSize());
            image.setIsPrincipale(isPrincipale);

            // Définir l'ordre d'affichage
            image.setOrdreAffichage((int) imageCount + 1);

            return listingImageRepository.save(image);

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la sauvegarde de l'image: " + e.getMessage());
        }
    }

    /**
     * Obtenir toutes les images d'une annonce
     */
    public List<ListingImage> getImagesByListing(Long listingId) {
        return listingImageRepository.findByListingIdOrderByOrdreAffichage(listingId);
    }

    /**
     * Obtenir l'image principale d'une annonce
     */
    public ListingImage getMainImage(Long listingId) {
        return listingImageRepository.findByListingIdAndIsPrincipaleTrue(listingId)
                .orElse(null);
    }

    /**
     * Supprimer une image
     */
    public void deleteImage(Long imageId, Long userId) {
        ListingImage image = listingImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image non trouvée"));

        // Vérifier que l'utilisateur est le propriétaire de l'annonce
        if (!image.getListing().getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cette image");
        }

        try {
            // Supprimer le fichier physique
            String filename = image.getUrl().substring(image.getUrl().lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, filename);
            Files.deleteIfExists(filePath);

            // Supprimer de la base de données
            listingImageRepository.delete(image);

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la suppression de l'image: " + e.getMessage());
        }
    }

    /**
     * Définir une image comme principale
     */
    public void setAsMainImage(Long imageId, Long userId) {
        ListingImage image = listingImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image non trouvée"));

        // Vérifier que l'utilisateur est le propriétaire
        if (!image.getListing().getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette image");
        }

        // Retirer le statut principal des autres images de cette annonce
        List<ListingImage> images = listingImageRepository.findByListingId(image.getListing().getId());
        for (ListingImage img : images) {
            img.setIsPrincipale(false);
        }
        listingImageRepository.saveAll(images);

        // Définir cette image comme principale
        image.setIsPrincipale(true);
        listingImageRepository.save(image);
    }

    /**
     * Réorganiser l'ordre des images
     */
    public void reorderImages(Long listingId, List<Long> imageIds, Long userId) {
        // Vérifier que l'utilisateur est le propriétaire
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        if (!listing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier ces images");
        }

        // Mettre à jour l'ordre
        for (int i = 0; i < imageIds.size(); i++) {
            Long imageId = imageIds.get(i);
            ListingImage image = listingImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image non trouvée: " + imageId));

            image.setOrdreAffichage(i + 1);
            listingImageRepository.save(image);
        }
    }

    /**
     * Valider un fichier image
     */
    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Le fichier est vide");
        }

        // Vérifier la taille (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("La taille du fichier ne doit pas dépasser 5MB");
        }

        // Vérifier le type de fichier
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Le fichier doit être une image");
        }

        // Types autorisés
        List<String> allowedTypes = List.of("image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");
        if (!allowedTypes.contains(contentType.toLowerCase())) {
            throw new RuntimeException("Type d'image non autorisé. Utilisez: JPG, PNG, GIF ou WebP");
        }
    }

    /**
     * Obtenir le nombre maximum d'images selon le plan
     */
    private int getMaxImagesForUser(com.camerannonces.enums.PlanType plan) {
        switch (plan) {
            case GRATUIT:
                return 2;
            case BASIC:
                return 5;
            case PRO:
                return 10;
            case BOUTIQUE:
                return 20;
            default:
                return 2;
        }
    }

    /**
     * Obtenir les statistiques des images
     */
    public Long getTotalStorageUsed() {
        return listingImageRepository.getTotalStorageUsed();
    }

    public Double getAverageFileSize() {
        return listingImageRepository.getAverageFileSize();
    }
}