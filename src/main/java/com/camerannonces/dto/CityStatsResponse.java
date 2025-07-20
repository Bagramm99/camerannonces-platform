// CityStatsResponse.java
package com.camerannonces.dto;

public class CityStatsResponse {

    private Long cityId;
    private String nomVille;
    private String region;
    private Long nombreAnnonces;
    private Double pourcentageTotal;

    // CONSTRUCTEURS
    public CityStatsResponse() {}

    public CityStatsResponse(Long cityId, String nomVille, String region, Long nombreAnnonces) {
        this.cityId = cityId;
        this.nomVille = nomVille;
        this.region = region;
        this.nombreAnnonces = nombreAnnonces;
    }

    // GETTERS ET SETTERS
    public Long getCityId() { return cityId; }
    public void setCityId(Long cityId) { this.cityId = cityId; }

    public String getNomVille() { return nomVille; }
    public void setNomVille(String nomVille) { this.nomVille = nomVille; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Long getNombreAnnonces() { return nombreAnnonces; }
    public void setNombreAnnonces(Long nombreAnnonces) { this.nombreAnnonces = nombreAnnonces; }

    public Double getPourcentageTotal() { return pourcentageTotal; }
    public void setPourcentageTotal(Double pourcentageTotal) { this.pourcentageTotal = pourcentageTotal; }
}
