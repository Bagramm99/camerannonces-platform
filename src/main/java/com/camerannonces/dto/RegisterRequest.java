// ============================================
// 🇨🇲 DTOs POUR PLATEFORME ANNONCES CAMEROUN
// ============================================

// ============================================
// 1. AUTHENTICATION DTOs
// ============================================

// RegisterRequest.java
package com.camerannonces.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String nom;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^237[0-9]{9}$", message = "Format téléphone invalide (ex: 237698123456)")
    private String telephone;

    @Email(message = "Format email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String motDePasse;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    private String quartier;

    private Boolean isBoutique = false;

    @Size(max = 100, message = "Le nom de boutique ne peut dépasser 100 caractères")
    private String nomBoutique;

    @Size(max = 500, message = "La description ne peut dépasser 500 caractères")
    private String descriptionBoutique;

    // CONSTRUCTEURS
    public RegisterRequest() {}

    public RegisterRequest(String nom, String telephone, String motDePasse, String ville) {
        this.nom = nom;
        this.telephone = telephone;
        this.motDePasse = motDePasse;
        this.ville = ville;
    }

    // GETTERS ET SETTERS
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

    @Override
    public String toString() {
        return "RegisterRequest{" +
                "nom='" + nom + '\'' +
                ", telephone='" + telephone + '\'' +
                ", email='" + email + '\'' +
                ", ville='" + ville + '\'' +
                ", quartier='" + quartier + '\'' +
                ", isBoutique=" + isBoutique +
                ", nomBoutique='" + nomBoutique + '\'' +
                '}';
    }
}