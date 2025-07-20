package com.camerannonces.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "listing_images")
public class ListingImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "nom_fichier")
    private String nomFichier;

    @Column(name = "taille_fichier")
    private Integer tailleFichier; // en bytes

    @Column(name = "ordre_affichage")
    private Integer ordreAffichage = 1;

    @Column(name = "is_principale")
    private Boolean isPrincipale = false;

    @CreationTimestamp
    @Column(name = "date_upload")
    private LocalDateTime dateUpload;

    // CONSTRUCTEURS
    public ListingImage() {}

    public ListingImage(Listing listing, String url) {
        this.listing = listing;
        this.url = url;
    }

    // GETTERS ET SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Listing getListing() { return listing; }
    public void setListing(Listing listing) { this.listing = listing; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getNomFichier() { return nomFichier; }
    public void setNomFichier(String nomFichier) { this.nomFichier = nomFichier; }

    public Integer getTailleFichier() { return tailleFichier; }
    public void setTailleFichier(Integer tailleFichier) { this.tailleFichier = tailleFichier; }

    public Integer getOrdreAffichage() { return ordreAffichage; }
    public void setOrdreAffichage(Integer ordreAffichage) { this.ordreAffichage = ordreAffichage; }

    public Boolean getIsPrincipale() { return isPrincipale; }
    public void setIsPrincipale(Boolean isPrincipale) { this.isPrincipale = isPrincipale; }

    public LocalDateTime getDateUpload() { return dateUpload; }
    public void setDateUpload(LocalDateTime dateUpload) { this.dateUpload = dateUpload; }
}