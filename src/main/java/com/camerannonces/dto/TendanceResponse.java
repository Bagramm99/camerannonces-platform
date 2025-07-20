
// TendanceResponse.java
package com.camerannonces.dto;

import java.time.LocalDate;

public class TendanceResponse {

    private LocalDate date;
    private Long nombreAnnonces;
    private Long nombreUtilisateurs;

    // CONSTRUCTEURS
    public TendanceResponse() {}

    public TendanceResponse(LocalDate date, Long nombreAnnonces, Long nombreUtilisateurs) {
        this.date = date;
        this.nombreAnnonces = nombreAnnonces;
        this.nombreUtilisateurs = nombreUtilisateurs;
    }

    // GETTERS ET SETTERS
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Long getNombreAnnonces() { return nombreAnnonces; }
    public void setNombreAnnonces(Long nombreAnnonces) { this.nombreAnnonces = nombreAnnonces; }

    public Long getNombreUtilisateurs() { return nombreUtilisateurs; }
    public void setNombreUtilisateurs(Long nombreUtilisateurs) { this.nombreUtilisateurs = nombreUtilisateurs; }
}
