
// CategoryStatsResponse.java
package com.camerannonces.dto;

public class CategoryStatsResponse {

    private Long categoryId;
    private String nomCategorie;
    private String emoji;
    private Long nombreAnnonces;
    private Double pourcentageTotal;

    // CONSTRUCTEURS
    public CategoryStatsResponse() {}

    public CategoryStatsResponse(Long categoryId, String nomCategorie, String emoji, Long nombreAnnonces) {
        this.categoryId = categoryId;
        this.nomCategorie = nomCategorie;
        this.emoji = emoji;
        this.nombreAnnonces = nombreAnnonces;
    }

    // GETTERS ET SETTERS
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getNomCategorie() { return nomCategorie; }
    public void setNomCategorie(String nomCategorie) { this.nomCategorie = nomCategorie; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }

    public Long getNombreAnnonces() { return nombreAnnonces; }
    public void setNombreAnnonces(Long nombreAnnonces) { this.nombreAnnonces = nombreAnnonces; }

    public Double getPourcentageTotal() { return pourcentageTotal; }
    public void setPourcentageTotal(Double pourcentageTotal) { this.pourcentageTotal = pourcentageTotal; }
}
