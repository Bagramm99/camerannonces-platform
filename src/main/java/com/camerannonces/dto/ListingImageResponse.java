// ListingImageResponse.java
package com.camerannonces.dto;

public class ListingImageResponse {

    private Long id;
    private String url;
    private String nomFichier;
    private Integer tailleFichier;
    private Integer ordreAffichage;
    private Boolean isPrincipale;

    // CONSTRUCTEURS
    public ListingImageResponse() {}

    public ListingImageResponse(Long id, String url, Boolean isPrincipale) {
        this.id = id;
        this.url = url;
        this.isPrincipale = isPrincipale;
    }

    // GETTERS ET SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getNomFichier() {
        return nomFichier;
    }

    public void setNomFichier(String nomFichier) {
        this.nomFichier = nomFichier;
    }

    public Integer getTailleFichier() {
        return tailleFichier;
    }

    public void setTailleFichier(Integer tailleFichier) {
        this.tailleFichier = tailleFichier;
    }

    public Integer getOrdreAffichage() {
        return ordreAffichage;
    }

    public void setOrdreAffichage(Integer ordreAffichage) {
        this.ordreAffichage = ordreAffichage;
    }

    public Boolean getIsPrincipale() {
        return isPrincipale;
    }

    public void setIsPrincipale(Boolean isPrincipale) {
        this.isPrincipale = isPrincipale;
    }
}
