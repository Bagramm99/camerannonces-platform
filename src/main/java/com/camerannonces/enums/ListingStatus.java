package com.camerannonces.enums;

public enum ListingStatus {
    ACTIVE("Active"),
    VENDU("Vendu"),
    EXPIRE("Expiré"),
    SUSPENDU("Suspendu");

    private final String displayName;

    ListingStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}