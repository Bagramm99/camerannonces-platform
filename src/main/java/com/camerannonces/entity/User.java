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

    public List<Listing> getListings() { return listings; }
    public void setListings(List<Listing> listings) { this.listings = listings; }

    public List<UserFavorite> getFavoris() { return favoris; }
    public void setFavoris(List<UserFavorite> favoris) { this.favoris = favoris; }

    public List<Signal> getSignalements() { return signalements; }
    public void setSignalements(List<Signal> signalements) { this.signalements = signalements; }
}