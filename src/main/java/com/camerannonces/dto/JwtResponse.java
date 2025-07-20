// ============================================
// 9. DTOs POUR JWT ET SÉCURITÉ
// ============================================

// JwtResponse.java
package com.camerannonces.dto;

public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private UserResponse user;
    private Long expiresIn; // en secondes

    // CONSTRUCTEURS
    public JwtResponse() {}

    public JwtResponse(String token, UserResponse user, Long expiresIn) {
        this.token = token;
        this.user = user;
        this.expiresIn = expiresIn;
    }

    // GETTERS ET SETTERS
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }

    public Long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
}
