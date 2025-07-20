package com.camerannonces.enums;

public enum SignalReason {
    SPAM("Spam"),
    ARNAQUE("Arnaque"),
    CONTENU_INAPPROPRIE("Contenu inapproprié"),
    FAUSSE_ANNONCE("Fausse annonce"),
    PRIX_SUSPECT("Prix suspect");

    private final String displayName;

    SignalReason(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}