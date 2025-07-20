package com.camerannonces.enums;

public enum PlanType {
    GRATUIT("Gratuit", 0, 2, 2),
    BASIC("Basic", 500, 5, 5),
    PRO("Pro", 2000, 15, 10),
    BOUTIQUE("Boutique", 4000, -1, 20); // -1 = illimité

    private final String displayName;
    private final int prixMensuel;
    private final int maxAnnonces;
    private final int maxPhotos;

    PlanType(String displayName, int prixMensuel, int maxAnnonces, int maxPhotos) {
        this.displayName = displayName;
        this.prixMensuel = prixMensuel;
        this.maxAnnonces = maxAnnonces;
        this.maxPhotos = maxPhotos;
    }

    public String getDisplayName() { return displayName; }
    public int getPrixMensuel() { return prixMensuel; }
    public int getMaxAnnonces() { return maxAnnonces; }
    public int getMaxPhotos() { return maxPhotos; }
}