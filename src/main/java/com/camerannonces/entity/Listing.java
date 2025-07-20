package com.camerannonces.entity;

import com.camerannonces.enums.EtatProduit;
import com.camerannonces.enums.ListingStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "listings")
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 200)
    private String titre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column
    private Integer prix;

    @Column(name = "prix_negociable")
    private Boolean prixNegociable = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat_produit")
    private EtatProduit etatProduit = EtatProduit.BON;

    // Localisation
    @Column(length = 50)
    private String ville;

    @Column(length = 50)
    private String quartier;

    @Column(name = "adresse_complete", columnDefinition = "TEXT")
    private String adresseComplete;

    // Options de livraison
    @Column(name = "livraison_sur_place")
    private Boolean livraisonSurPlace = true;

    @Column(name = "livraison_domicile")
    private Boolean livraisonDomicile = false;

    @Column(name = "livraison_gare")
    private Boolean livraisonGare = false;

    // Options de paiement
    @Column(name = "paiement_cash")
    private Boolean paiementCash = true;

    @Column(name = "paiement_mobile_money")
    private Boolean paiementMobileMoney = false;

    @Column(name = "paiement_virement")
    private Boolean paiementVirement = false;

    // Contact
    @Column(name = "telephone_contact", nullable = false, length = 15)
    private String telephoneContact;

    @Column(name = "email_contact", length = 100)
    private String emailContact;

    // Statistiques
    @Column
    private Integer vues = 0;

    @Column(name = "contacts_whatsapp")
    private Integer contactsWhatsapp = 0;

    // Status et dates
    @Enumerated(EnumType.STRING)
    @Column
    private ListingStatus statut = ListingStatus.ACTIVE;

    @Column(name = "is_premium")
    private Boolean isPremium = false;

    @Column(name = "is_urgent")
    private Boolean isUrgent = false;

    @CreationTimestamp
    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_expiration")
    private LocalDateTime dateExpiration;

    @Column(name = "date_derniere_remontee")
    private LocalDateTime dateDerniereRemontee;

    // Vérification
    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "date_verification")
    private LocalDateTime dateVerification;

    // Relations
    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ListingImage> images;

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserFavorite> favoris;

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Signal> signalements;

    // CONSTRUCTEURS
    public Listing() {}

    // GETTERS ET SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getPrix() { return prix; }
    public void setPrix(Integer prix) { this.prix = prix; }

    public Boolean getPrixNegociable() { return prixNegociable; }
    public void setPrixNegociable(Boolean prixNegociable) { this.prixNegociable = prixNegociable; }

    public EtatProduit getEtatProduit() { return etatProduit; }
    public void setEtatProduit(EtatProduit etatProduit) { this.etatProduit = etatProduit; }

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

    public ListingStatus getStatut() { return statut; }
    public void setStatut(ListingStatus statut) { this.statut = statut; }

    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }

    public Boolean getIsUrgent() { return isUrgent; }
    public void setIsUrgent(Boolean isUrgent) { this.isUrgent = isUrgent; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateExpiration() { return dateExpiration; }
    public void setDateExpiration(LocalDateTime dateExpiration) { this.dateExpiration = dateExpiration; }

    public LocalDateTime getDateDerniereRemontee() { return dateDerniereRemontee; }
    public void setDateDerniereRemontee(LocalDateTime dateDerniereRemontee) { this.dateDerniereRemontee = dateDerniereRemontee; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public LocalDateTime getDateVerification() { return dateVerification; }
    public void setDateVerification(LocalDateTime dateVerification) { this.dateVerification = dateVerification; }

    public List<ListingImage> getImages() { return images; }
    public void setImages(List<ListingImage> images) { this.images = images; }

    public List<UserFavorite> getFavoris() { return favoris; }
    public void setFavoris(List<UserFavorite> favoris) { this.favoris = favoris; }

    public List<Signal> getSignalements() { return signalements; }
    public void setSignalements(List<Signal> signalements) { this.signalements = signalements; }
}