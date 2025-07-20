// ============================================
// 4. SEARCH DTOs
// ============================================

// SearchFilter.java
package com.camerannonces.dto;

import java.util.List;

public class SearchFilter {

    private String motCle;
    private Long categoryId;
    private String ville;
    private String quartier;
    private String region;

    // Filtres de prix
    private Integer prixMin;
    private Integer prixMax;
    private Boolean prixNegociable;

    // Filtres d'état
    private List<String> etatsAcceptes; // NEUF, TRES_BON, BON, etc.

    // Filtres de livraison
    private Boolean livraisonDomicile;
    private Boolean livraisonGare;

    // Filtres de paiement
    private Boolean paiementMobileMoney;
    private Boolean paiementVirement;

    // Filtres de statut
    private Boolean uniquementPremium;
    private Boolean uniquementUrgent;
    private Boolean uniquementBoutiques;

    // Pagination et tri
    private Integer page = 0;
    private Integer size = 20;
    private String sortBy = "dateCreation"; // dateCreation, prix, vues, titre
    private String sortDirection = "DESC"; // ASC, DESC

    // Filtres de date
    private String periode; // AUJOURD_HUI, CETTE_SEMAINE, CE_MOIS, TOUS

    // CONSTRUCTEURS
    public SearchFilter() {}

    public SearchFilter(String motCle, Long categoryId, String ville) {
        this.motCle = motCle;
        this.categoryId = categoryId;
        this.ville = ville;
    }

    // GETTERS ET SETTERS
    public String getMotCle() { return motCle; }
    public void setMotCle(String motCle) { this.motCle = motCle; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public String getQuartier() { return quartier; }
    public void setQuartier(String quartier) { this.quartier = quartier; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Integer getPrixMin() { return prixMin; }
    public void setPrixMin(Integer prixMin) { this.prixMin = prixMin; }

    public Integer getPrixMax() { return prixMax; }
    public void setPrixMax(Integer prixMax) { this.prixMax = prixMax; }

    public Boolean getPrixNegociable() { return prixNegociable; }
    public void setPrixNegociable(Boolean prixNegociable) { this.prixNegociable = prixNegociable; }

    public List<String> getEtatsAcceptes() { return etatsAcceptes; }
    public void setEtatsAcceptes(List<String> etatsAcceptes) { this.etatsAcceptes = etatsAcceptes; }

    public Boolean getLivraisonDomicile() { return livraisonDomicile; }
    public void setLivraisonDomicile(Boolean livraisonDomicile) { this.livraisonDomicile = livraisonDomicile; }

    public Boolean getLivraisonGare() { return livraisonGare; }
    public void setLivraisonGare(Boolean livraisonGare) { this.livraisonGare = livraisonGare; }

    public Boolean getPaiementMobileMoney() { return paiementMobileMoney; }
    public void setPaiementMobileMoney(Boolean paiementMobileMoney) { this.paiementMobileMoney = paiementMobileMoney; }

    public Boolean getPaiementVirement() { return paiementVirement; }
    public void setPaiementVirement(Boolean paiementVirement) { this.paiementVirement = paiementVirement; }

    public Boolean getUniquementPremium() { return uniquementPremium; }
    public void setUniquementPremium(Boolean uniquementPremium) { this.uniquementPremium = uniquementPremium; }

    public Boolean getUniquementUrgent() { return uniquementUrgent; }
    public void setUniquementUrgent(Boolean uniquementUrgent) { this.uniquementUrgent = uniquementUrgent; }

    public Boolean getUniquementBoutiques() { return uniquementBoutiques; }
    public void setUniquementBoutiques(Boolean uniquementBoutiques) { this.uniquementBoutiques = uniquementBoutiques; }

    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }

    public Integer getSize() { return size; }
    public void setSize(Integer size) { this.size = size; }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }

    public String getSortDirection() { return sortDirection; }
    public void setSortDirection(String sortDirection) { this.sortDirection = sortDirection; }

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }
}
