package com.camerannonces.service;

import com.camerannonces.entity.User;
import com.camerannonces.enums.PlanType;
import com.camerannonces.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Obtenir un utilisateur par ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Obtenir un utilisateur par téléphone
     */
    public Optional<User> getUserByTelephone(String telephone) {
        return userRepository.findByTelephone(telephone);
    }

    /**
     * Mettre à jour le profil utilisateur
     */
    public User updateProfile(Long userId, String nom, String email, String ville, String quartier) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setNom(nom);
        user.setEmail(email);
        user.setVille(ville);
        user.setQuartier(quartier);

        return userRepository.save(user);
    }

    /**
     * Convertir en boutique
     */
    public User convertToBoutique(Long userId, String nomBoutique, String descriptionBoutique) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setIsBoutique(true);
        user.setNomBoutique(nomBoutique);
        user.setDescriptionBoutique(descriptionBoutique);

        return userRepository.save(user);
    }

    /**
     * Changer le plan d'abonnement
     */
    public User changePlan(Long userId, PlanType nouveauPlan) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setPlanActuel(nouveauPlan);

        // Définir la date d'expiration (30 jours)
        if (nouveauPlan != PlanType.GRATUIT) {
            user.setDateExpirationPlan(LocalDateTime.now().plusDays(30));
        } else {
            user.setDateExpirationPlan(null);
        }

        return userRepository.save(user);
    }

    /**
     * Incrémenter le compteur d'annonces publiées ce mois
     */
    public void incrementAnnoncesPubliees(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Réinitialiser le compteur si nouveau mois
        LocalDate aujourdhui = LocalDate.now();
        if (!aujourdhui.equals(user.getDerniereReinitialisationCompteur())) {
            if (aujourdhui.getMonthValue() != user.getDerniereReinitialisationCompteur().getMonthValue()) {
                user.setAnnoncesPublieesCeMois(0);
                user.setDerniereReinitialisationCompteur(aujourdhui);
            }
        }

        user.setAnnoncesPublieesCeMois(user.getAnnoncesPublieesCeMois() + 1);
        userRepository.save(user);
    }

    /**
     * Vérifier si l'utilisateur peut publier une annonce
     */
    public boolean canPublishListing(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier si le plan a expiré
        if (user.getDateExpirationPlan() != null && user.getDateExpirationPlan().isBefore(LocalDateTime.now())) {
            // Plan expiré, repasser en gratuit
            user.setPlanActuel(PlanType.GRATUIT);
            user.setDateExpirationPlan(null);
            userRepository.save(user);
        }

        // Vérifier les limites selon le plan
        PlanType plan = user.getPlanActuel();
        int annoncesPubliees = user.getAnnoncesPublieesCeMois();

        switch (plan) {
            case GRATUIT:
                return annoncesPubliees < 2;
            case BASIC:
                return annoncesPubliees < 5;
            case PRO:
                return annoncesPubliees < 15;
            case BOUTIQUE:
                return true; // Illimité
            default:
                return false;
        }
    }

    /**
     * Obtenir toutes les boutiques
     */
    public Page<User> getAllBoutiques(Pageable pageable) {
        return (Page<User>) userRepository.findByIsBoutiqueTrue(pageable);
    }

    /**
     * Rechercher des utilisateurs
     */
    public Page<User> searchUsers(String keyword, Pageable pageable) {
        return userRepository.searchByKeyword(keyword, pageable);
    }

    /**
     * Suspendre un utilisateur
     */
    public void suspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setIsActive(false);
        userRepository.save(user);
    }

    /**
     * Réactiver un utilisateur
     */
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setIsActive(true);
        userRepository.save(user);
    }

    /**
     * Obtenir les statistiques utilisateur
     */
    public List<Object[]> getUserStatsByPlan() {
        return userRepository.countUsersByPlan();
    }

    /**
     * Vérifier les plans expirés et les remettre en gratuit
     */
    @Transactional
    public void resetExpiredPlans() {
        List<User> expiredUsers = userRepository.findUsersWithExpiredPlan(LocalDateTime.now());

        for (User user : expiredUsers) {
            user.setPlanActuel(PlanType.GRATUIT);
            user.setDateExpirationPlan(null);
        }

        userRepository.saveAll(expiredUsers);
    }
}