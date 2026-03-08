package com.camerannonces.entity;

import com.camerannonces.enums.PlanType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, unique = true, length = 15)
    private String telephone;

    @Column(length = 100)
    private String email;

    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    @Column(length = 50)
    private String ville;

    @Column(length = 50)
    private String quartier;

    // ✅ PROFILE IMAGE
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(name = "is_boutique")
    private Boolean isBoutique = false;

    @Column(name = "nom_boutique", length = 100)
    private String nomBoutique;

    @Column(name = "description_boutique", columnDefinition = "TEXT")
    private String descriptionBoutique;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_actuel")
    private PlanType planActuel = PlanType.GRATUIT;

    @Column(name = "date_expiration_plan")
    private LocalDateTime dateExpirationPlan;

    @Column(name = "annonces_publiees_ce_mois")
    private Integer annoncesPublieesCeMois = 0;

    @Column(name = "derniere_reinitialisation_compteur")
    private LocalDate derniereReinitialisationCompteur = LocalDate.now();

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "derniere_connexion")
    private LocalDateTime derniereConnexion;

    // ✅ VERIFICATION FIELDS
    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "phone_verified", nullable = false)
    private Boolean phoneVerified = false;

    @Column(name = "country_code", length = 5, nullable = false)
    private String countryCode = "+237";

    // EMAIL VERIFICATION (SendGrid)
    @Column(name = "email_verification_code", length = 4)
    private String emailVerificationCode;

    @Column(name = "email_verification_expiry")
    private LocalDateTime emailVerificationExpiry;

    // ✅ SMS VERIFICATION (Africa's Talking) - NEU!
    @Column(name = "phone_verification_code", length = 4)
    private String phoneVerificationCode;

    @Column(name = "phone_verification_expiry")
    private LocalDateTime phoneVerificationExpiry;

    // OLD FIELD (deprecated - wird durch email_verification_code ersetzt)
    @Column(name = "verification_code", length = 4)
    @Deprecated
    private String verificationCode;

    @Column(name = "verification_code_expiry")
    @Deprecated
    private LocalDateTime verificationCodeExpiry;

    // Relations
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Listing> listings;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserFavorite> favoris;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Signal> signalements;

    // CONSTRUCTEURS
    public User() {}

    public User(String nom, String telephone, String motDePasse) {
        this.nom = nom;
        this.telephone = telephone;
        this.motDePasse = motDePasse;
    }

    // GETTERS ET SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public String getQuartier() { return quartier; }
    public void setQuartier(String quartier) { this.quartier = quartier; }

    // ✅ PROFILE IMAGE GETTER/SETTER
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public Boolean getIsBoutique() { return isBoutique; }
    public void setIsBoutique(Boolean isBoutique) { this.isBoutique = isBoutique; }

    public String getNomBoutique() { return nomBoutique; }
    public void setNomBoutique(String nomBoutique) { this.nomBoutique = nomBoutique; }

    public String getDescriptionBoutique() { return descriptionBoutique; }
    public void setDescriptionBoutique(String descriptionBoutique) { this.descriptionBoutique = descriptionBoutique; }

    public PlanType getPlanActuel() { return planActuel; }
    public void setPlanActuel(PlanType planActuel) { this.planActuel = planActuel; }

    public LocalDateTime getDateExpirationPlan() { return dateExpirationPlan; }
    public void setDateExpirationPlan(LocalDateTime dateExpirationPlan) { this.dateExpirationPlan = dateExpirationPlan; }

    public Integer getAnnoncesPublieesCeMois() { return annoncesPublieesCeMois; }
    public void setAnnoncesPublieesCeMois(Integer annoncesPublieesCeMois) { this.annoncesPublieesCeMois = annoncesPublieesCeMois; }

    public LocalDate getDerniereReinitialisationCompteur() { return derniereReinitialisationCompteur; }
    public void setDerniereReinitialisationCompteur(LocalDate derniereReinitialisationCompteur) { this.derniereReinitialisationCompteur = derniereReinitialisationCompteur; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDerniereConnexion() { return derniereConnexion; }
    public void setDerniereConnexion(LocalDateTime derniereConnexion) { this.derniereConnexion = derniereConnexion; }

    // VERIFICATION GETTERS/SETTERS
    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public Boolean getPhoneVerified() { return phoneVerified; }
    public void setPhoneVerified(Boolean phoneVerified) { this.phoneVerified = phoneVerified; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    // EMAIL VERIFICATION
    public String getEmailVerificationCode() { return emailVerificationCode; }
    public void setEmailVerificationCode(String emailVerificationCode) { this.emailVerificationCode = emailVerificationCode; }

    public LocalDateTime getEmailVerificationExpiry() { return emailVerificationExpiry; }
    public void setEmailVerificationExpiry(LocalDateTime emailVerificationExpiry) { this.emailVerificationExpiry = emailVerificationExpiry; }

    // ✅ SMS VERIFICATION - NEU!
    public String getPhoneVerificationCode() { return phoneVerificationCode; }
    public void setPhoneVerificationCode(String phoneVerificationCode) { this.phoneVerificationCode = phoneVerificationCode; }

    public LocalDateTime getPhoneVerificationExpiry() { return phoneVerificationExpiry; }
    public void setPhoneVerificationExpiry(LocalDateTime phoneVerificationExpiry) { this.phoneVerificationExpiry = phoneVerificationExpiry; }

    // DEPRECATED (für Rückwärtskompatibilität)
    @Deprecated
    public String getVerificationCode() { return verificationCode; }
    @Deprecated
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }

    @Deprecated
    public LocalDateTime getVerificationCodeExpiry() { return verificationCodeExpiry; }
    @Deprecated
    public void setVerificationCodeExpiry(LocalDateTime verificationCodeExpiry) { this.verificationCodeExpiry = verificationCodeExpiry; }

    public List<Listing> getListings() { return listings; }
    public void setListings(List<Listing> listings) { this.listings = listings; }

    public List<UserFavorite> getFavoris() { return favoris; }
    public void setFavoris(List<UserFavorite> favoris) { this.favoris = favoris; }

    public List<Signal> getSignalements() { return signalements; }
    public void setSignalements(List<Signal> signalements) { this.signalements = signalements; }
}