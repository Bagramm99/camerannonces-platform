package com.camerannonces.enums;

public enum EtatProduit {
    NEUF("Neuf"),
    TRES_BON("Très bon état"),
    BON("Bon état"),
    MOYEN("État moyen"),
    A_REPARER("À réparer");

    private final String displayName;

    EtatProduit(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}