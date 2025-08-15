package com.camerannonces.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service principal pour la gestion des tokens JWT
 * Localisation: src/main/java/com/camerannonces/jwt/JwtTokenProvider.java
 */
@Service
public class JwtTokenProvider {

    @Autowired
    private JwtProperties jwtProperties;

    /**
     * Générer un token d'accès
     */
    public String generateAccessToken(String telephone, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("type", "access");
        claims.put("telephone", telephone);

        return createToken(claims, telephone, jwtProperties.getAccessToken().getExpiration());
    }

    /**
     * Générer un refresh token
     */
    public String generateRefreshToken(String telephone, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("type", "refresh");
        claims.put("telephone", telephone);

        return createToken(claims, telephone, jwtProperties.getRefreshToken().getExpiration());
    }

    /**
     * Créer un token JWT
     */
    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuer(jwtProperties.getIssuer())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extraire le username (téléphone) du token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extraire l'ID utilisateur du token
     */
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> {
            Object userId = claims.get("userId");
            if (userId instanceof Integer) {
                return ((Integer) userId).longValue();
            } else if (userId instanceof Long) {
                return (Long) userId;
            } else {
                return Long.valueOf(userId.toString());
            }
        });
    }

    /**
     * Extraire le type de token
     */
    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    /**
     * Extraire une claim spécifique
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extraire toutes les claims du token
     */
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token expiré", e);
        } catch (UnsupportedJwtException e) {
            throw new JwtException("Token non supporté", e);
        } catch (MalformedJwtException e) {
            throw new JwtException("Token malformé", e);
        } catch (SecurityException e) {
            throw new JwtException("Signature du token invalide", e);
        } catch (IllegalArgumentException e) {
            throw new JwtException("Token vide ou null", e);
        }
    }

    /**
     * Valider un token
     */
    public boolean validateToken(String token, String telephone) {
        try {
            final String extractedUsername = extractUsername(token);
            return (extractedUsername.equals(telephone)) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Valider spécifiquement un refresh token
     */
    public boolean validateRefreshToken(String token, String telephone) {
        try {
            String tokenType = extractTokenType(token);
            return "refresh".equals(tokenType) && validateToken(token, telephone);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Vérifier si le token est expiré
     */
    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * Extraire la date d'expiration
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Obtenir le temps restant avant expiration (en millisecondes)
     */
    public long getRemainingExpiration(String token) {
        try {
            Date expiration = extractExpiration(token);
            long remaining = expiration.getTime() - System.currentTimeMillis();
            return Math.max(0, remaining);
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * Obtenir la clé de signature
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Créer une réponse JWT complète
     */
    public JwtResponse createJwtResponse(String telephone, Long userId) {
        String accessToken = generateAccessToken(telephone, userId);
        String refreshToken = generateRefreshToken(telephone, userId);

        JwtResponse response = new JwtResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(jwtProperties.getAccessToken().getExpiration());
        response.setRefreshExpiresIn(jwtProperties.getRefreshToken().getExpiration());

        return response;
    }
}