package com.camerannonces.service;

import com.camerannonces.dto.JwtResponse;
import com.camerannonces.entity.User;
import com.camerannonces.enums.PlanType;
import com.camerannonces.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Inscription d'un nouvel utilisateur
     */
    public User register(String nom, String telephone, String motDePasse, String ville, String quartier) {
        // Vérifier si le téléphone existe déjà
        if (userRepository.existsByTelephone(telephone)) {
            throw new RuntimeException("Ce numéro de téléphone est déjà utilisé");
        }

        // Valider le format du téléphone camerounais
        if (!telephone.matches("^237[0-9]{9}$")) {
            throw new RuntimeException("Format de téléphone invalide. Utilisez le format : 237XXXXXXXXX");
        }

        // Créer le nouvel utilisateur
        User user = new User();
        user.setNom(nom);
        user.setTelephone(telephone);
        user.setMotDePasse(passwordEncoder.encode(motDePasse));
        user.setVille(ville);
        user.setQuartier(quartier);
        user.setPlanActuel(PlanType.GRATUIT);
        user.setIsActive(true);
        user.setIsBoutique(false);
        user.setAnnoncesPublieesCeMois(0);

        return userRepository.save(user);
    }

    /**
     * Connexion d'un utilisateur
     */
    public User login(String telephone, String motDePasse) {
        // Chercher l'utilisateur par téléphone
        Optional<User> userOpt = userRepository.findByTelephone(telephone);

        if (!userOpt.isPresent()) {
            throw new RuntimeException("Numéro de téléphone ou mot de passe incorrect");
        }

        User user = userOpt.get();

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(motDePasse, user.getMotDePasse())) {
            throw new RuntimeException("Numéro de téléphone ou mot de passe incorrect");
        }

        // Vérifier si le compte est actif
        if (!user.getIsActive()) {
            throw new RuntimeException("Votre compte a été suspendu. Contactez l'administration.");
        }

        // Mettre à jour la dernière connexion
        user.setDerniereConnexion(LocalDateTime.now());
        userRepository.save(user);

        return user;
    }

    /**
     * Vérifier si un téléphone est disponible
     */
    public boolean isTelephoneAvailable(String telephone) {
        return !userRepository.existsByTelephone(telephone);
    }

    /**
     * Vérifier si un email est disponible
     */
    public boolean isEmailAvailable(String email) {
        if (email == null || email.trim().isEmpty()) {
            return true; // Email optionnel
        }
        return !userRepository.existsByEmail(email);
    }

    /**
     * Changer le mot de passe
     */
    public void changePassword(Long userId, String ancienMotDePasse, String nouveauMotDePasse) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(ancienMotDePasse, user.getMotDePasse())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        // Mettre à jour le mot de passe
        user.setMotDePasse(passwordEncoder.encode(nouveauMotDePasse));
        userRepository.save(user);
    }

    /**
     * Réinitialiser le mot de passe (simple version)
     */
    public void resetPassword(String telephone, String nouveauMotDePasse) {
        User user = userRepository.findByTelephone(telephone)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setMotDePasse(passwordEncoder.encode(nouveauMotDePasse));
        userRepository.save(user);
    }


}