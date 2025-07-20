package com.camerannonces.entity;

import com.camerannonces.enums.SignalReason;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "signals")
public class Signal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SignalReason motif;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "adresse_ip", length = 45)
    private String adresseIp;

    @Column(length = 20)
    private String statut = "EN_ATTENTE"; // EN_ATTENTE, TRAITE, REJETE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin;

    @Column(name = "commentaire_admin", columnDefinition = "TEXT")
    private String commentaireAdmin;

    @CreationTimestamp
    @Column(name = "date_signalement")
    private LocalDateTime dateSignalement;

    @Column(name = "date_traitement")
    private LocalDateTime dateTraitement;

    // CONSTRUCTEURS
    public Signal() {}

    public Signal(Listing listing, User user, SignalReason motif) {
        this.listing = listing;
        this.user = user;
        this.motif = motif;
    }

    // GETTERS ET SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Listing getListing() { return listing; }
    public void setListing(Listing listing) { this.listing = listing; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public SignalReason getMotif() { return motif; }
    public void setMotif(SignalReason motif) { this.motif = motif; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAdresseIp() { return adresseIp; }
    public void setAdresseIp(String adresseIp) { this.adresseIp = adresseIp; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public User getAdmin() { return admin; }
    public void setAdmin(User admin) { this.admin = admin; }

    public String getCommentaireAdmin() { return commentaireAdmin; }
    public void setCommentaireAdmin(String commentaireAdmin) { this.commentaireAdmin = commentaireAdmin; }

    public LocalDateTime getDateSignalement() { return dateSignalement; }
    public void setDateSignalement(LocalDateTime dateSignalement) { this.dateSignalement = dateSignalement; }

    public LocalDateTime getDateTraitement() { return dateTraitement; }
    public void setDateTraitement(LocalDateTime dateTraitement) { this.dateTraitement = dateTraitement; }
}