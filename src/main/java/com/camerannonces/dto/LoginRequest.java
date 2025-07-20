// LoginRequest.java
package com.camerannonces.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LoginRequest {

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^237[0-9]{9}$", message = "Format téléphone invalide")
    private String telephone;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String motDePasse;

    // CONSTRUCTEURS
    public LoginRequest() {}

    public LoginRequest(String telephone, String motDePasse) {
        this.telephone = telephone;
        this.motDePasse = motDePasse;
    }

    // GETTERS ET SETTERS
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    @Override
    public String toString() {
        return "LoginRequest{" +
                "telephone='" + telephone + '\'' +
                ", motDePasse='[PROTECTED]'" +
                '}';
    }
}