// ============================================
// 6. DTOs AUXILIAIRES
// ============================================

// CategoryResponse.java
package com.camerannonces.dto;

public class CategoryResponse {

    private Long id;
    private String nom;
    private String nomAnglais;
    private String emoji;
    private String description;
    private Integer ordreAffichage;
    private Long nombreAnnonces; // Nombre d'annonces dans cette catégorie

    // CONSTRUCTEURS
    public CategoryResponse() {}

    public CategoryResponse(Long id, String nom, String emoji) {
        this.id = id;
        this.nom = nom;
        this.emoji = emoji;
    }

    // GETTERS ET SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getNomAnglais() { return nomAnglais; }
    public void setNomAnglais(String nomAnglais) { this.nomAnglais = nomAnglais; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getOrdreAffichage() { return ordreAffichage; }
    public void setOrdreAffichage(Integer ordreAffichage) { this.ordreAffichage = ordreAffichage; }

    public Long getNombreAnnonces() { return nombreAnnonces; }
    public void setNombreAnnonces(Long nombreAnnonces) { this.nombreAnnonces = nombreAnnonces; }
}
