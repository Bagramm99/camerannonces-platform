package com.camerannonces.controller;

import com.camerannonces.entity.Category;
import com.camerannonces.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * Obtenir toutes les catégories actives
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllActiveCategories();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("categories", categories.stream()
                    .map(this::createCategoryResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir une catégorie par ID
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        try {
            Optional<Category> categoryOpt = categoryService.getCategoryById(id);

            if (!categoryOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Category category = categoryOpt.get();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("category", createCategoryResponse(category));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Rechercher des catégories
     * GET /api/categories/search?keyword=telephon
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchCategories(@RequestParam String keyword) {
        try {
            List<Category> categories = categoryService.searchCategories(keyword);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("categories", categories.stream()
                    .map(this::createCategoryResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les catégories avec le nombre d'annonces
     * GET /api/categories/with-count
     */
    @GetMapping("/with-count")
    public ResponseEntity<?> getCategoriesWithCount() {
        try {
            List<Object[]> categoriesWithCount = categoryService.getCategoriesWithListingCount();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("categoriesWithCount", categoriesWithCount.stream()
                    .map(this::createCategoryWithCountResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les catégories les plus populaires
     * GET /api/categories/popular
     */
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularCategories() {
        try {
            List<Category> categories = categoryService.getMostPopularCategories();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("categories", categories.stream()
                    .map(this::createCategoryResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // ENDPOINTS ADMIN (pour plus tard)
    // ============================================

    /**
     * Créer une nouvelle catégorie (ADMIN)
     * POST /api/categories
     */
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Map<String, Object> request) {
        try {
            String nom = (String) request.get("nom");
            String nomAnglais = (String) request.get("nomAnglais");
            String emoji = (String) request.get("emoji");
            String description = (String) request.get("description");
            Integer ordreAffichage = request.get("ordreAffichage") != null ?
                    Integer.valueOf(request.get("ordreAffichage").toString()) : null;

            if (nom == null || nom.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Le nom de la catégorie est obligatoire"));
            }

            Category category = categoryService.createCategory(
                    nom, nomAnglais, emoji, description, ordreAffichage
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Catégorie créée avec succès");
            response.put("category", createCategoryResponse(category));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Mettre à jour une catégorie (ADMIN)
     * PUT /api/categories/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,
                                            @RequestBody Map<String, Object> request) {
        try {
            String nom = (String) request.get("nom");
            String nomAnglais = (String) request.get("nomAnglais");
            String emoji = (String) request.get("emoji");
            String description = (String) request.get("description");
            Integer ordreAffichage = request.get("ordreAffichage") != null ?
                    Integer.valueOf(request.get("ordreAffichage").toString()) : null;
            Boolean isActive = (Boolean) request.get("isActive");

            Category category = categoryService.updateCategory(
                    id, nom, nomAnglais, emoji, description, ordreAffichage, isActive
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Catégorie mise à jour avec succès");
            response.put("category", createCategoryResponse(category));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Activer/Désactiver une catégorie (ADMIN)
     * POST /api/categories/{id}/toggle-status
     */
    @PostMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleCategoryStatus(@PathVariable Long id) {
        try {
            categoryService.toggleCategoryStatus(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statut de la catégorie modifié avec succès");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // MÉTHODES UTILITAIRES
    // ============================================

    private Map<String, Object> createCategoryResponse(Category category) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", category.getId());
        response.put("nom", category.getNom());
        response.put("nomAnglais", category.getNomAnglais());
        response.put("emoji", category.getEmoji());
        response.put("description", category.getDescription());
        response.put("ordreAffichage", category.getOrdreAffichage());
        response.put("isActive", category.getIsActive());
        response.put("dateCreation", category.getDateCreation());
        return response;
    }

    private Map<String, Object> createCategoryWithCountResponse(Object[] data) {
        Category category = (Category) data[0];
        Long count = (Long) data[1];

        Map<String, Object> response = createCategoryResponse(category);
        response.put("nombreAnnonces", count);
        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}