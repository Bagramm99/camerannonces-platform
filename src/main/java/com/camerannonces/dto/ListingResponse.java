
// ListingResponse.java
package com.camerannonces.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ListingResponse {

    private Long id;
    private String titre;
    private String description;
    private Integer prix;
    private Boolean prixNegociable;
    private String etatProduit;
    private String ville;
    private String quartier;
    private String adresseComplete;

    // Options de livraison et paiement
    private Boolean livraisonSurPlace;
    private Boolean livraisonDomicile;
    private Boolean livraisonGare;
    private Boolean paiementCash;
    private Boolean paiementMobileMoney;
    private Boolean paiementVirement;

    // Contact
    private String telephoneContact;
    private String emailContact;

    // Statistiques
    private Integer vues;
    private Integer contactsWhatsapp;

    // Status
    private String statut;
    private Boolean isPremium;
    private Boolean isUrgent;
    private Boolean isFavorite; // Pour l'utilisateur connecté

    // Dates
    private LocalDateTime dateCreation;
    private LocalDateTime dateExpiration;
    private LocalDateTime dateDerniereRemontee;

    // Relations
    private CategoryResponse category;
    private UserResponse vendeur;
    private List<ListingImageResponse> images;

    // CONSTRUCTEURS
    public ListingResponse() {}

    // GETTERS ET SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getPrix() { return prix; }
    public void setPrix(Integer prix) { this.prix = prix; }

    public Boolean getPrixNegociable() { return prixNegociable; }
    public void setPrixNegociable(Boolean prixNegociable) { this.prixNegociable = prixNegociable; }

    public String getEtatProduit() { return etatProduit; }
    public void setEtatProduit(String etatProduit) { this.etatProduit = etatProduit; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public String getQuartier() { return quartier; }
    public void setQuartier(String quartier) { this.quartier = quartier; }

    public String getAdresseComplete() { return adresseComplete; }
    public void setAdresseComplete(String adresseComplete) { this.adresseComplete = adresseComplete; }

    public Boolean getLivraisonSurPlace() { return livraisonSurPlace; }
    public void setLivraisonSurPlace(Boolean livraisonSurPlace) { this.livraisonSurPlace = livraisonSurPlace; }

    public Boolean getLivraisonDomicile() { return livraisonDomicile; }
    public void setLivraisonDomicile(Boolean livraisonDomicile) { this.livraisonDomicile = livraisonDomicile; }

    public Boolean getLivraisonGare() { return livraisonGare; }
    public void setLivraisonGare(Boolean livraisonGare) { this.livraisonGare = livraisonGare; }

    public Boolean getPaiementCash() { return paiementCash; }
    public void setPaiementCash(Boolean paiementCash) { this.paiementCash = paiementCash; }

    public Boolean getPaiementMobileMoney() { return paiementMobileMoney; }
    public void setPaiementMobileMoney(Boolean paiementMobileMoney) { this.paiementMobileMoney = paiementMobileMoney; }

    public Boolean getPaiementVirement() { return paiementVirement; }
    public void setPaiementVirement(Boolean paiementVirement) { this.paiementVirement = paiementVirement; }

    public String getTelephoneContact() { return telephoneContact; }
    public void setTelephoneContact(String telephoneContact) { this.telephoneContact = telephoneContact; }

    public String getEmailContact() { return emailContact; }
    public void setEmailContact(String emailContact) { this.emailContact = emailContact; }

    public Integer getVues() { return vues; }
    public void setVues(Integer vues) { this.vues = vues; }

    public Integer getContactsWhatsapp() { return contactsWhatsapp; }
    public void setContactsWhatsapp(Integer contactsWhatsapp) { this.contactsWhatsapp = contactsWhatsapp; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }

    public Boolean getIsUrgent() { return isUrgent; }
    public void setIsUrgent(Boolean isUrgent) { this.isUrgent = isUrgent; }

    public Boolean getIsFavorite() { return isFavorite; }
    public void setIsFavorite(Boolean isFavorite) { this.isFavorite = isFavorite; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateExpiration() { return dateExpiration; }
    public void setDateExpiration(LocalDateTime dateExpiration) { this.dateExpiration = dateExpiration; }

    public LocalDateTime getDateDerniereRemontee() { return dateDerniereRemontee; }
    public void setDateDerniereRemontee(LocalDateTime dateDerniereRemontee) { this.dateDerniereRemontee = dateDerniereRemontee; }

    public CategoryResponse getCategory() { return category; }
    public void setCategory(CategoryResponse category) { this.category = category; }

    public UserResponse getVendeur() { return vendeur; }
    public void setVendeur(UserResponse vendeur) { this.vendeur = vendeur; }

    public List<ListingImageResponse> getImages() { return images; }
    public void setImages(List<ListingImageResponse> images) { this.images = images; }
}
