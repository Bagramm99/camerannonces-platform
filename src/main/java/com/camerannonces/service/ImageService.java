package com.camerannonces.service;

import com.camerannonces.entity.Listing;
import com.camerannonces.entity.ListingImage;
import com.camerannonces.entity.User;
import com.camerannonces.enums.PlanType;
import com.camerannonces.repository.ListingImageRepository;
import com.camerannonces.repository.ListingRepository;
import com.camerannonces.repository.UserRepository;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Service pour gérer les images (Profil + Listings)
 * Stockage: Backblaze B2 Cloud Storage
 */
@Service
@Transactional
public class ImageService {

    @Autowired
    private BackblazeB2Service backblazeService;

    @Autowired
    private ListingImageRepository listingImageRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${upload.max-file-size:5242880}") // 5MB default
    private long maxFileSize;

    @Value("${upload.thumbnail-size:300}")
    private int thumbnailSize;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    );
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "jpg", "jpeg", "png", "webp", "gif"
    );

    // ============================================
    // VALIDATION
    // ============================================

    /**
     * Valider un fichier image
     */
    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Le fichier est vide");
        }

        // Vérifier la taille (max 5MB)
        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("Fichier trop volumineux (max 5MB)");
        }

        // Vérifier le type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new RuntimeException("Type d'image non autorisé. Utilisez: JPG, PNG, WEBP, GIF");
        }

        // Vérifier l'extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String extension = originalFilename.substring(
                    originalFilename.lastIndexOf(".") + 1
            ).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                throw new RuntimeException("Extension non supportée");
            }
        }
    }

    // ============================================
    // PROFILE IMAGES
    // ============================================

    /**
     * Upload image de profil utilisateur
     */
    public String uploadProfileImage(Long userId, MultipartFile file) throws IOException {
        validateImageFile(file);

        // Récupérer l'utilisateur
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Supprimer l'ancienne image si elle existe
        if (user.getProfileImageUrl() != null && !user.getProfileImageUrl().isEmpty()) {
            backblazeService.deleteFile(user.getProfileImageUrl());
        }

        // Créer thumbnail optimisé
        MultipartFile thumbnail = createThumbnail(file, thumbnailSize);

        // Upload vers Backblaze B2
        String imageUrl = backblazeService.uploadFile(thumbnail, "profiles");

        // Mettre à jour l'utilisateur
        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);

        System.out.println("✅ Profile image uploaded for user: " + userId);
        return imageUrl;
    }

    /**
     * Supprimer image de profil
     */
    public void deleteProfileImage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getProfileImageUrl() != null && !user.getProfileImageUrl().isEmpty()) {
            backblazeService.deleteFile(user.getProfileImageUrl());
            user.setProfileImageUrl(null);
            userRepository.save(user);
            System.out.println("🗑️ Profile image deleted for user: " + userId);
        }
    }

    // ============================================
    // LISTING IMAGES
    // ============================================

    /**
     * Upload image pour une annonce
     */
    public ListingImage saveListingImage(Long listingId, Long userId, MultipartFile file, boolean isPrincipale)
            throws IOException {

        validateImageFile(file);

        // Vérifier que l'annonce existe et appartient à l'utilisateur
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        if (!listing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette annonce");
        }

        // Vérifier le nombre d'images selon le plan
        long imageCount = listingImageRepository.countByListingId(listingId);
        int maxImages = getMaxImagesForUser(listing.getUser().getPlanActuel());

        if (imageCount >= maxImages) {
            throw new RuntimeException(
                    "Limite atteinte: " + maxImages + " images max pour votre plan " +
                            listing.getUser().getPlanActuel()
            );
        }

        // Optimiser l'image pour listing (max 1200px width)
        MultipartFile optimizedFile = optimizeImage(file, 1200);

        // Upload vers Backblaze B2
        String imageUrl = backblazeService.uploadFile(optimizedFile, "listings");

        // Créer l'entrée en base de données
        ListingImage image = new ListingImage();
        image.setListing(listing);
        image.setUrl(imageUrl);
        image.setNomFichier(file.getOriginalFilename());
        image.setTailleFichier((int) file.getSize());
        image.setIsPrincipale(isPrincipale);
        image.setOrdreAffichage((int) imageCount + 1);

        ListingImage savedImage = listingImageRepository.save(image);

        System.out.println("✅ Listing image uploaded: " + listingId + " (image " + (imageCount + 1) + "/" + maxImages + ")");
        return savedImage;
    }

    /**
     * Obtenir toutes les images d'une annonce
     */
    public List<ListingImage> getImagesByListing(Long listingId) {
        return listingImageRepository.findByListingIdOrderByOrdreAffichage(listingId);
    }

    /**
     * Obtenir l'image principale
     */
    public ListingImage getMainImage(Long listingId) {
        return listingImageRepository.findByListingIdAndIsPrincipaleTrue(listingId)
                .orElse(null);
    }

    /**
     * Supprimer une image de listing
     */
    public void deleteListingImage(Long imageId, Long userId) {
        ListingImage image = listingImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image non trouvée"));

        // Vérifier que l'utilisateur est le propriétaire
        if (!image.getListing().getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cette image");
        }

        // Supprimer de Backblaze B2
        backblazeService.deleteFile(image.getUrl());

        // Supprimer de la base de données
        listingImageRepository.delete(image);

        System.out.println("🗑️ Listing image deleted: " + imageId);
    }

    /**
     * Définir une image comme principale
     */
    public void setAsMainImage(Long imageId, Long userId) {
        ListingImage image = listingImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image non trouvée"));

        // Vérifier propriétaire
        if (!image.getListing().getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette image");
        }

        // Retirer le statut principal des autres images
        List<ListingImage> images = listingImageRepository.findByListingId(image.getListing().getId());
        for (ListingImage img : images) {
            img.setIsPrincipale(false);
        }
        listingImageRepository.saveAll(images);

        // Définir comme principale
        image.setIsPrincipale(true);
        listingImageRepository.save(image);

        System.out.println("📌 Main image set: " + imageId);
    }

    /**
     * Réorganiser l'ordre des images
     */
    public void reorderImages(Long listingId, List<Long> imageIds, Long userId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        if (!listing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier ces images");
        }

        for (int i = 0; i < imageIds.size(); i++) {
            Long imageId = imageIds.get(i);
            ListingImage image = listingImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image non trouvée: " + imageId));

            image.setOrdreAffichage(i + 1);
            listingImageRepository.save(image);
        }

        System.out.println("🔄 Images reordered for listing: " + listingId);
    }

    // ============================================
    // IMAGE PROCESSING
    // ============================================

    /**
     * Créer un thumbnail
     */
    private MultipartFile createThumbnail(MultipartFile originalFile, int size) throws IOException {
        BufferedImage originalImage = ImageIO.read(originalFile.getInputStream());

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(originalImage)
                .size(size, size)
                .outputFormat("jpg")
                .outputQuality(0.85)
                .toOutputStream(outputStream);

        byte[] thumbnailBytes = outputStream.toByteArray();
        return createMultipartFile(originalFile, thumbnailBytes, "image/jpeg");
    }

    /**
     * Optimiser image
     */
    private MultipartFile optimizeImage(MultipartFile originalFile, int maxWidth) throws IOException {
        BufferedImage originalImage = ImageIO.read(originalFile.getInputStream());

        // Si déjà assez petite, retourner l'original
        if (originalImage.getWidth() <= maxWidth) {
            return originalFile;
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(originalImage)
                .width(maxWidth)
                .outputFormat("jpg")
                .outputQuality(0.9)
                .toOutputStream(outputStream);

        byte[] optimizedBytes = outputStream.toByteArray();
        return createMultipartFile(originalFile, optimizedBytes, "image/jpeg");
    }

    /**
     * Créer MultipartFile depuis byte array
     */
    private MultipartFile createMultipartFile(MultipartFile original, byte[] bytes, String contentType) {
        return new MultipartFile() {
            @Override
            public String getName() { return original.getName(); }

            @Override
            public String getOriginalFilename() { return original.getOriginalFilename(); }

            @Override
            public String getContentType() { return contentType; }

            @Override
            public boolean isEmpty() { return bytes.length == 0; }

            @Override
            public long getSize() { return bytes.length; }

            @Override
            public byte[] getBytes() { return bytes; }

            @Override
            public java.io.InputStream getInputStream() {
                return new ByteArrayInputStream(bytes);
            }

            @Override
            public void transferTo(java.io.File dest) throws IOException {
                throw new UnsupportedOperationException();
            }
        };
    }

    // ============================================
    // PLAN LIMITS
    // ============================================

    /**
     * Obtenir nombre max d'images selon le plan
     */
    private int getMaxImagesForUser(PlanType plan) {
        switch (plan) {
            case GRATUIT: return 2;
            case BASIC: return 5;
            case PRO: return 10;
            case BOUTIQUE: return 20;
            default: return 2;
        }
    }

    // ============================================
    // STATISTICS
    // ============================================

    public Long getTotalStorageUsed() {
        return listingImageRepository.getTotalStorageUsed();
    }

    public Double getAverageFileSize() {
        return listingImageRepository.getAverageFileSize();
    }
}