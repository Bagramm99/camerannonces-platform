package com.camerannonces.service;

import com.camerannonces.entity.Signal;
import com.camerannonces.entity.Listing;
import com.camerannonces.entity.User;
import com.camerannonces.enums.SignalReason;
import com.camerannonces.enums.ListingStatus;
import com.camerannonces.repository.SignalRepository;
import com.camerannonces.repository.ListingRepository;
import com.camerannonces.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ModerationService {

    @Autowired
    private SignalRepository signalRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Signaler une annonce
     */
    public Signal reportListing(Long listingId, Long userId, SignalReason motif, String description, String adresseIp) {
        // Vérifier que l'annonce existe
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        // Vérifier que l'utilisateur n'a pas déjà signalé cette annonce
        if (userId != null && signalRepository.existsByUserIdAndListingId(userId, listingId)) {
            throw new RuntimeException("Vous avez déjà signalé cette annonce");
        }

        // Récupérer l'utilisateur s'il est connecté
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        // Créer le signalement
        Signal signal = new Signal();
        signal.setListing(listing);
        signal.setUser(user);
        signal.setMotif(motif);
        signal.setDescription(description);
        signal.setAdresseIp(adresseIp);
        signal.setStatut("EN_ATTENTE");

        signal = signalRepository.save(signal);

        // Auto-modération : si trop de signalements, suspendre automatiquement
        long signalCount = signalRepository.countByListingId(listingId);
        if (signalCount >= 3) {
            suspendListingAutomatically(listingId);
        }

        return signal;
    }

    /**
     * Obtenir tous les signalements en attente
     */
    public Page<Signal> getPendingReports(Pageable pageable) {
        return signalRepository.findByStatut("EN_ATTENTE", pageable);
    }

    /**
     * Obtenir les signalements d'une annonce
     */
    public List<Signal> getReportsForListing(Long listingId) {
        return signalRepository.findByListingIdOrderByDateSignalementDesc(listingId);
    }

    /**
     * Obtenir les signalements par motif
     */
    public List<Signal> getReportsByReason(SignalReason motif) {
        return signalRepository.findByMotif(motif);
    }

    /**
     * Traiter un signalement - Approuver
     */
    public void approveReport(Long signalId, Long adminId, String commentaire) {
        Signal signal = signalRepository.findById(signalId)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));

        // Marquer le signalement comme traité
        signal.setStatut("TRAITE");
        signal.setAdmin(admin);
        signal.setCommentaireAdmin(commentaire);
        signal.setDateTraitement(LocalDateTime.now());
        signalRepository.save(signal);

        // Suspendre l'annonce
        suspendListing(signal.getListing().getId(), adminId, "Signalement approuvé: " + commentaire);
    }

    /**
     * Traiter un signalement - Rejeter
     */
    public void rejectReport(Long signalId, Long adminId, String commentaire) {
        Signal signal = signalRepository.findById(signalId)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrateur non trouvé"));

        signal.setStatut("REJETE");
        signal.setAdmin(admin);
        signal.setCommentaireAdmin(commentaire);
        signal.setDateTraitement(LocalDateTime.now());
        signalRepository.save(signal);
    }

    /**
     * Suspendre une annonce manuellement
     */
    public void suspendListing(Long listingId, Long adminId, String raison) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        listing.setStatut(ListingStatus.SUSPENDU);
        listingRepository.save(listing);

        // TODO: Envoyer une notification à l'utilisateur
        // TODO: Logger l'action de modération
    }

    /**
     * Réactiver une annonce
     */
    public void reactivateListing(Long listingId, Long adminId, String raison) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        listing.setStatut(ListingStatus.ACTIVE);
        listingRepository.save(listing);

        // TODO: Envoyer une notification à l'utilisateur
        // TODO: Logger l'action de modération
    }

    /**
     * Suspension automatique basée sur le nombre de signalements
     */
    private void suspendListingAutomatically(Long listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée"));

        listing.setStatut(ListingStatus.SUSPENDU);
        listingRepository.save(listing);

        // TODO: Notifier les administrateurs
        // TODO: Notifier l'utilisateur
    }

    /**
     * Obtenir les annonces les plus signalées
     */
    public List<Object[]> getMostReportedListings() {
        return signalRepository.findMostReportedListings();
    }

    /**
     * Obtenir les annonces avec plusieurs signalements
     */
    public List<Object[]> getListingsWithMultipleReports(int threshold) {
        return signalRepository.findListingsWithMultipleReports(threshold);
    }

    /**
     * Obtenir les utilisateurs les plus signalés
     */
    public List<Object[]> getMostReportedUsers() {
        return signalRepository.findMostReportedUsers();
    }

    /**
     * Obtenir les statistiques de signalements
     */
    public List<Object[]> getSignalStatsByReason() {
        return signalRepository.countSignalsByReason();
    }

    public List<Object[]> getSignalStatsByStatus() {
        return signalRepository.countSignalsByStatus();
    }

    /**
     * Obtenir les signalements d'une période
     */
    public List<Signal> getReportsByDateRange(LocalDateTime start, LocalDateTime end) {
        return signalRepository.findByDateSignalementBetween(start, end);
    }

    /**
     * Traitement en lot des signalements anciens
     */
    @Transactional
    public void processOldReports(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);

        List<Signal> oldReports = signalRepository.findByDateSignalementBetween(
                LocalDateTime.now().minusDays(365), cutoffDate
        );

        for (Signal signal : oldReports) {
            if ("EN_ATTENTE".equals(signal.getStatut())) {
                signal.setStatut("EXPIRE");
                signal.setCommentaireAdmin("Signalement expiré automatiquement après " + daysOld + " jours");
                signal.setDateTraitement(LocalDateTime.now());
            }
        }

        signalRepository.saveAll(oldReports);
    }

    /**
     * Vérifier si une annonce a été signalée par un utilisateur
     */
    public boolean hasUserReportedListing(Long userId, Long listingId) {
        return signalRepository.existsByUserIdAndListingId(userId, listingId);
    }
}