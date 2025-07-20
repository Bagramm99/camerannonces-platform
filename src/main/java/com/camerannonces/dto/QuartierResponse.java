// QuartierResponse.java
package com.camerannonces.dto;

public class QuartierResponse {

    private Long id;
    private String nom;
    private String nomVille;
    private Long nombreAnnonces;

    // CONSTRUCTEURS
    public QuartierResponse() {}

    public QuartierResponse(Long id, String nom, String nomVille) {
        this.id = id;
        this.nom = nom;
        this.nomVille = nomVille;
    }

    // GETTERS ET SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getNomVille() { return nomVille; }
    public void setNomVille(String nomVille) { this.nomVille = nomVille; }

    public Long getNombreAnnonces() { return nombreAnnonces; }
    public void setNombreAnnonces(Long nombreAnnonces) { this.nombreAnnonces = nombreAnnonces; }
}
