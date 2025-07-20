
// ============================================
// 10. DTOs POUR L'UPLOAD D'IMAGES
// ============================================

// ImageUploadResponse.java
package com.camerannonces.dto;

public class ImageUploadResponse {

    private String url;
    private String nomFichier;
    private Integer tailleFichier;
    private String contentType;
    private Boolean success;
    private String message;

    // CONSTRUCTEURS
    public ImageUploadResponse() {}

    public ImageUploadResponse(String url, String nomFichier, Integer tailleFichier) {
        this.url = url;
        this.nomFichier = nomFichier;
        this.tailleFichier = tailleFichier;
        this.success = true;
    }

    // GETTERS ET SETTERS
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getNomFichier() { return nomFichier; }
    public void setNomFichier(String nomFichier) { this.nomFichier = nomFichier; }

    public Integer getTailleFichier() { return tailleFichier; }
    public void setTailleFichier(Integer tailleFichier) { this.tailleFichier = tailleFichier; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
