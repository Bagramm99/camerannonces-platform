package com.camerannonces.service;

import com.camerannonces.dto.ListingResponse;
import com.camerannonces.dto.PageResponse;
import com.camerannonces.entity.Listing;
import com.camerannonces.entity.User;
import com.camerannonces.entity.Category;
import com.camerannonces.enums.ListingStatus;
import com.camerannonces.enums.EtatProduit;
import com.camerannonces.repository.ListingRepository;
import com.camerannonces.repository.UserRepository;
import com.camerannonces.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ListingService {

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserService userService;

    /**
     * Créer une nouvelle annonce
     */
    public Listing createListing(Long userId, Long categoryId, String titre, String description,
                                 Integer prix, Boolean prixNegociable, EtatProduit etatProduit,
                                 String ville, String quartier, String adresseComplete,
                                 String telephoneContact, String emailContact,
                                 Boolean livraisonSurPlace, Boolean livraisonDomicile, Boolean livraisonGare,
                                 Boolean paiementCash, Boolean paiementMobileMoney, Boolean paiementVirement) {

        // Vérifier si l'utilisateur peut publier
        if (!userService.canPublishListing(userId)) {
            throw new RuntimeException("Vous avez atteint la limite d'annonces pour votre plan. Passez à un plan supérieur.");
        }

        // Récupérer l'utilisateur et la catégorie
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

        // Créer l'annonce
        Listing listing = new Listing();
        listing.setUser(user);
        listing.setCategory(category);
        listing.setTitre(titre);
        listing.setDescription(description);
        listing.setPrix(prix);
        listing.setPrixNegociable(prixNegociable != null ? prixNegociable : true);
        listing.setEtatProduit(etatProduit != null ? etatProduit : EtatProduit.BON);
        listing.setVille(ville);
        listing.setQuartier(quartier);
        listing.setAdresseComplete(adresseComplete);
        listing.setTelephoneContact(telephoneContact);
        listing.setEmailContact(emailContact);

        // Options de livraison
        listing.setLivraisonSurPlace(livraisonSurPlace != null ? livraisonSurPlace : true);
        listing.setLivraisonDomicile(livraisonDomicile != null ? livraisonDomicile : false);
        listing.setLivraisonGare(livraisonGare != null ? livraisonGare : false);

        // Options de paiement
        listing.setPaiementCash(paiementCash != null ? paiementCash : true);
        listing.setPaiementMobileMoney(paiementMobileMoney != null ? paiementMobileMoney : false);
        listing.setPaiementVirement(paiementVirement != null ? paiementVirement : false);

        listing.setStatut(ListingStatus.ACTIVE);
        listing.setVues(0);
        listing.setContactsWhatsapp(0);

        // Date d'expiration selon le plan
        int joursExpiration = getExpirationDays(user.getPlanActuel());
        listing.setDateExpiration(LocalDateTime.now().plusDays(joursExpiration));

        // Sauvegarder
        listing = listingRepository.save(listing);

        // Incrémenter le compteur d'annonces de l'utilisateur
        userService.incrementAnnoncesPubliees(userId);

        return listing;
    }

    /**
     * Obtenir une annonce par ID
     */
    public Optional<Listing> getListingById(Long id) {
        return listingRepository.findById(id);
    }

    /**
     * Obtenir une annonce par ID et incrémenter les vues
     */
    public Optional<Listing> getListingByIdAndIncrementViews(Long id) {
        Optional<Listing> listingOpt = listingRepository.findById(id);
        if (listingOpt.isPresent()) {
            listingRepository.incrementViews(id);
        }
        return listingOpt;
    }

    /**
     * Mettre à jour une annonce
     */
    public Listing updateListing(Long listingId, Long userId, String titre, String description,
                                 Integer prix, Boolean prixNegociable, EtatProduit etatProduit,
                                 String adresseComplete) {

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        // Vérifier que l'utilisateur est le propriétaire
        if (!listing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette annonce");
        }

        // Mettre à jour les champs
        if (titre != null) listing.setTitre(titre);
        if (description != null) listing.setDescription(description);
        if (prix != null) listing.setPrix(prix);
        if (prixNegociable != null) listing.setPrixNegociable(prixNegociable);
        if (etatProduit != null) listing.setEtatProduit(etatProduit);
        if (adresseComplete != null) listing.setAdresseComplete(adresseComplete);

        return listingRepository.save(listing);
    }

    /**
     * Supprimer une annonce
     */
    public void deleteListing(Long listingId, Long userId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        // Vérifier que l'utilisateur est le propriétaire
        if (!listing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cette annonce");
        }

        listingRepository.delete(listing);
    }

    /**
     * Marquer une annonce comme vendue
     */
    public void markAsSold(Long listingId, Long userId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        if (!listing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette annonce");
        }

        listing.setStatut(ListingStatus.VENDU);
        listingRepository.save(listing);
    }

    /**
     * Remonter une annonce (boosting)
     */
    public void boostListing(Long listingId, Long userId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        if (!listing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette annonce");
        }

        listingRepository.boostListing(listingId, LocalDateTime.now());
    }

    /**
     * Obtenir les annonces d'un utilisateur
     */
    public Page<Listing> getUserListings(Long userId, Pageable pageable) {
        return listingRepository.findByUserId(userId, pageable);
    }

    /**
     * Obtenir les annonces actives d'un utilisateur
     */
    public Page<Listing> getUserActiveListings(Long userId, Pageable pageable) {
        return listingRepository.findByUserIdAndStatut(userId, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Obtenir toutes les annonces actives
     */
    public Page<Listing> getAllActiveListings(Pageable pageable) {
        return listingRepository.findByStatut(ListingStatus.ACTIVE, pageable);
    }

    /**
     * Obtenir les annonces par catégorie
     */
    public Page<Listing> getListingsByCategory(Long categoryId, Pageable pageable) {
        return listingRepository.findByCategoryIdAndStatut(categoryId, ListingStatus.ACTIVE, pageable);
    }

    /**
     * Incrémenter le compteur de contacts WhatsApp
     */
    public void incrementWhatsappContacts(Long listingId) {
        listingRepository.incrementWhatsappContacts(listingId);
    }

    /**
     * Marquer les annonces expirées
     */
    @Transactional
    public int markExpiredListings() {
        return listingRepository.markExpiredListings(LocalDateTime.now());
    }

    /**
     * Obtenir les annonces similaires
     */
    public List<Listing> getSimilarListings(Long listingId, int limit) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        return listingRepository.findSimilarListings(
                listing.getCategory().getId(),
                listing.getVille(),
                listingId,
                ListingStatus.ACTIVE,
                org.springframework.data.domain.PageRequest.of(0, limit)
        );
    }

    /**
     * Obtenir le nombre de jours d'expiration selon le plan
     */
    private int getExpirationDays(com.camerannonces.enums.PlanType plan) {
        switch (plan) {
            case GRATUIT:
                return 14; // 2 semaines
            case BASIC:
                return 30; // 1 mois
            case PRO:
                return 60; // 2 mois
            case BOUTIQUE:
                return 90; // 3 mois
            default:
                return 14;
        }
    }

    /**
     * Obtenir les statistiques des annonces
     */
    public List<Object[]> getListingStatsByCategory() {
        return listingRepository.countByCategory(ListingStatus.ACTIVE);
    }

    public List<Object[]> getListingStatsByCity() {
        return listingRepository.countByCity(ListingStatus.ACTIVE);
    }


}