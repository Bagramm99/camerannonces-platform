// ============================================
// 2. USER DTOs
// ============================================

// UserResponse.java
package com.camerannonces.dto;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String nom;
    private String telephone;
    private String email;
    private String ville;
    private String quartier;
    private Boolean isBoutique;
    private String nomBoutique;
    private String descriptionBoutique;
    private String planActuel;
    private LocalDateTime dateExpirationPlan;
    private Integer annoncesPublieesCeMois;
    private Boolean isActive;
    private LocalDateTime dateCreation;
    private LocalDateTime derniereConnexion;

    // CONSTRUCTEURS
    public UserResponse() {}

    public UserResponse(Long id, String nom, String telephone, String ville) {
        this.id = id;
        this.nom = nom;
        this.telephone = telephone;
        this.ville = ville;
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

    public String getPlanActuel() { return planActuel; }
    public void setPlanActuel(String planActuel) { this.planActuel = planActuel; }

    public LocalDateTime getDateExpirationPlan() { return dateExpirationPlan; }
    public void setDateExpirationPlan(LocalDateTime dateExpirationPlan) { this.dateExpirationPlan = dateExpirationPlan; }

    public Integer getAnnoncesPublieesCeMois() { return annoncesPublieesCeMois; }
    public void setAnnoncesPublieesCeMois(Integer annoncesPublieesCeMois) { this.annoncesPublieesCeMois = annoncesPublieesCeMois; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDerniereConnexion() { return derniereConnexion; }
    public void setDerniereConnexion(LocalDateTime derniereConnexion) { this.derniereConnexion = derniereConnexion; }
}
