// ============================================
// 3. LISTING DTOs
// ============================================

// CreateListingRequest.java
package com.camerannonces.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class CreateListingRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 5, max = 200, message = "Le titre doit contenir entre 5 et 200 caractères")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    @Size(min = 20, max = 2000, message = "La description doit contenir entre 20 et 2000 caractères")
    private String description;

    @NotNull(message = "La catégorie est obligatoire")
    private Long categoryId;

    @Min(value = 0, message = "Le prix doit être positif")
    private Integer prix;


    private Boolean prixNegociable = true;

    @NotBlank(message = "L'état du produit est obligatoire")
    @Pattern(regexp = "NEUF|TRES_BON|BON|MOYEN|A_REPARER",
            message = "État invalide")
    private String etatProduit;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    private String quartier;
    private String adresseComplete;

    // Options de livraison
    private Boolean livraisonSurPlace = true;
    private Boolean livraisonDomicile = false;
    private Boolean livraisonGare = false;

    // Options de paiement
    private Boolean paiementCash = true;
    private Boolean paiementMobileMoney = false;
    private Boolean paiementVirement = false;

    @NotBlank(message = "Le téléphone de contact est obligatoire")
    @Pattern(regexp = "^237[0-9]{9}$", message = "Format téléphone invalide")
    private String telephoneContact;

    @Email(message = "Format email invalide")
    private String emailContact;

    private Boolean isUrgent = false;

    // URLs des images (seront uploadées séparément)
    private List<String> imageUrls;

    // CONSTRUCTEURS
    public CreateListingRequest() {}

    // GETTERS ET SETTERS
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Integer getPrix() { return prix; }
    public void setPrix(Integer prix) { this.prix = prix; }

    public Boolean getPrixNegociable() { return prixNegociable; }
    public void setPrixNegociable(Boolean prixNegociable) { this.prixNegociable = prixNegociable; }

    public String getEtatProduit() { return etatProduit; }
    public void setEtatProduit(String etatProduit) { this.etatProduit = etatProduit; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public String getQuartier() { return quartier; }
    public void setQuartier(String quartier) { this.quartier = quartier; }

    public String getAdresseComplete() { return adresseComplete; }
    public void setAdresseComplete(String adresseComplete) { this.adresseComplete = adresseComplete; }

    public Boolean getLivraisonSurPlace() { return livraisonSurPlace; }
    public void setLivraisonSurPlace(Boolean livraisonSurPlace) { this.livraisonSurPlace = livraisonSurPlace; }

    public Boolean getLivraisonDomicile() { return livraisonDomicile; }
    public void setLivraisonDomicile(Boolean livraisonDomicile) { this.livraisonDomicile = livraisonDomicile; }

    public Boolean getLivraisonGare() { return livraisonGare; }
    public void setLivraisonGare(Boolean livraisonGare) { this.livraisonGare = livraisonGare; }

    public Boolean getPaiementCash() { return paiementCash; }
    public void setPaiementCash(Boolean paiementCash) { this.paiementCash = paiementCash; }

    public Boolean getPaiementMobileMoney() { return paiementMobileMoney; }
    public void setPaiementMobileMoney(Boolean paiementMobileMoney) { this.paiementMobileMoney = paiementMobileMoney; }

    public Boolean getPaiementVirement() { return paiementVirement; }
    public void setPaiementVirement(Boolean paiementVirement) { this.paiementVirement = paiementVirement; }

    public String getTelephoneContact() { return telephoneContact; }
    public void setTelephoneContact(String telephoneContact) { this.telephoneContact = telephoneContact; }

    public String getEmailContact() { return emailContact; }
    public void setEmailContact(String emailContact) { this.emailContact = emailContact; }

    public Boolean getIsUrgent() { return isUrgent; }
    public void setIsUrgent(Boolean isUrgent) { this.isUrgent = isUrgent; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
