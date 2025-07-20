// ============================================
// 5. SIGNALEMENT DTOs
// ============================================

// SignalRequest.java
package com.camerannonces.dto;

import jakarta.validation.constraints.*;

public class SignalRequest {

    @NotNull(message = "L'ID de l'annonce est obligatoire")
    private Long listingId;

    @NotBlank(message = "Le motif est obligatoire")
    @Pattern(regexp = "SPAM|ARNAQUE|CONTENU_INAPPROPRIE|FAUSSE_ANNONCE|PRIX_SUSPECT|AUTRE",
            message = "Motif de signalement invalide")
    private String motif;

    @Size(max = 500, message = "La description ne peut dépasser 500 caractères")
    private String description;

    private String adresseIp;

    // CONSTRUCTEURS
    public SignalRequest() {}

    public SignalRequest(Long listingId, String motif, String description) {
        this.listingId = listingId;
        this.motif = motif;
        this.description = description;
    }

    // GETTERS ET SETTERS
    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAdresseIp() { return adresseIp; }
    public void setAdresseIp(String adresseIp) { this.adresseIp = adresseIp; }
}
