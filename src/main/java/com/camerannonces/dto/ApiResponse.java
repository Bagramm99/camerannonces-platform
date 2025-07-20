// ============================================
// 7. DTOs DE RÉPONSE GÉNÉRIQUES
// ============================================

// ApiResponse.java
package com.camerannonces.dto;

import java.time.LocalDateTime;

public class ApiResponse<T> {

    private Boolean success;
    private String message;
    private T data;
    private String errorCode;
    private LocalDateTime timestamp;

    // CONSTRUCTEURS
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ApiResponse(Boolean success, String message, T data) {
        this();
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Méthodes statiques pour faciliter la création
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Succès", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        ApiResponse<T> response = new ApiResponse<>(false, message, null);
        response.setErrorCode(errorCode);
        return response;
    }

    // GETTERS ET SETTERS
    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
