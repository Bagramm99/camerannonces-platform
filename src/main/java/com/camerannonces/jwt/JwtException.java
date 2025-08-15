package com.camerannonces.jwt;

/**
 * Exception personnalisée pour les erreurs JWT
 * Localisation: src/main/java/com/camerannonces/jwt/JwtException.java
 */
public class JwtException extends RuntimeException {

    public JwtException(String message) {
        super(message);
    }

    public JwtException(String message, Throwable cause) {
        super(message, cause);
    }
}