package com.camerannonces.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service JWT qui utilise JwtTokenProvider
 * Localisation: src/main/java/com/camerannonces/jwt/JwtService.java
 */
@Service
public class JwtService {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Générer une paire de tokens
     */
    public JwtResponse generateTokens(Long userId, String telephone) {
        return jwtTokenProvider.createJwtResponse(telephone, userId);
    }

    /**
     * Valider un token avec téléphone
     */
    public boolean validateToken(String token, String telephone) {
        return jwtTokenProvider.validateToken(token, telephone);
    }

    /**
     * Valider un token (version simple)
     */
    public boolean validateToken(String token) {
        try {
            String telephone = jwtTokenProvider.extractUsername(token);
            return jwtTokenProvider.validateToken(token, telephone);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extraire l'ID utilisateur
     */
    public Long extractUserId(String token) {
        return jwtTokenProvider.extractUserId(token);
    }

    /**
     * Extraire le téléphone
     */
    public String extractTelephone(String token) {
        return jwtTokenProvider.extractUsername(token);
    }

    /**
     * Rafraîchir les tokens
     */
    public JwtResponse refreshTokens(String refreshToken) {
        try {
            // Valider le refresh token
            String telephone = jwtTokenProvider.extractUsername(refreshToken);
            if (!jwtTokenProvider.validateRefreshToken(refreshToken, telephone)) {
                throw new JwtException("Refresh token invalide ou expiré");
            }

            // Extraire les infos et générer de nouveaux tokens
            Long userId = jwtTokenProvider.extractUserId(refreshToken);
            return jwtTokenProvider.createJwtResponse(telephone, userId);

        } catch (Exception e) {
            throw new JwtException("Erreur lors du rafraîchissement du token: " + e.getMessage());
        }
    }

    /**
     * Vérifier si token expiré
     */
    public boolean isTokenExpired(String token) {
        return jwtTokenProvider.isTokenExpired(token);
    }

    /**
     * Obtenir le temps restant (en millisecondes)
     */
    public long getRemainingTime(String token) {
        return jwtTokenProvider.getRemainingExpiration(token);
    }

    /**
     * Obtenir le temps restant (en secondes)
     */
    public long getRemainingTimeInSeconds(String token) {
        return jwtTokenProvider.getRemainingExpiration(token) / 1000;
    }

    /**
     * Valider token et extraire les informations utilisateur
     */
    public TokenInfo validateAndExtractInfo(String token) {
        try {
            String telephone = extractTelephone(token);
            Long userId = extractUserId(token);
            String tokenType = jwtTokenProvider.extractTokenType(token);
            boolean isExpired = isTokenExpired(token);
            long remainingTime = getRemainingTimeInSeconds(token);

            return new TokenInfo(userId, telephone, tokenType, !isExpired, remainingTime);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Classe interne pour les informations du token
     */
    public static class TokenInfo {
        private final Long userId;
        private final String telephone;
        private final String tokenType;
        private final boolean valid;
        private final long remainingTimeSeconds;

        public TokenInfo(Long userId, String telephone, String tokenType, boolean valid, long remainingTimeSeconds) {
            this.userId = userId;
            this.telephone = telephone;
            this.tokenType = tokenType;
            this.valid = valid;
            this.remainingTimeSeconds = remainingTimeSeconds;
        }

        // Getters
        public Long getUserId() { return userId; }
        public String getTelephone() { return telephone; }
        public String getTokenType() { return tokenType; }
        public boolean isValid() { return valid; }
        public long getRemainingTimeSeconds() { return remainingTimeSeconds; }
    }
}