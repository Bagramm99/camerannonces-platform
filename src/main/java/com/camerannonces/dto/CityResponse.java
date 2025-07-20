// CityResponse.java
package com.camerannonces.dto;

import java.util.List;

public class CityResponse {

    private Long id;
    private String nom;
    private String region;
    private Long nombreAnnonces;
    private List<QuartierResponse> quartiers;

    // CONSTRUCTEURS
    public CityResponse() {}

    public CityResponse(Long id, String nom, String region) {
        this.id = id;
        this.nom = nom;
        this.region = region;
    }

    // GETTERS ET SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Long getNombreAnnonces() { return nombreAnnonces; }
    public void setNombreAnnonces(Long nombreAnnonces) { this.nombreAnnonces = nombreAnnonces; }

    public List<QuartierResponse> getQuartiers() { return quartiers; }
    public void setQuartiers(List<QuartierResponse> quartiers) { this.quartiers = quartiers; }
}
