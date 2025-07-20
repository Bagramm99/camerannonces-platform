package com.camerannonces.service;

import com.camerannonces.entity.Category;
import com.camerannonces.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Obtenir toutes les catégories actives ordonnées
     */
    public List<Category> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByOrdreAffichage();
    }

    /**
     * Obtenir toutes les catégories
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByOrdreAffichage();
    }

    /**
     * Obtenir une catégorie par ID
     */
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    /**
     * Obtenir une catégorie par nom
     */
    public Optional<Category> getCategoryByNom(String nom) {
        return categoryRepository.findByNom(nom);
    }

    /**
     * Rechercher des catégories
     */
    public List<Category> searchCategories(String keyword) {
        return categoryRepository.searchByKeyword(keyword);
    }

    /**
     * Obtenir les catégories avec le nombre d'annonces
     */
    public List<Object[]> getCategoriesWithListingCount() {
        return categoryRepository.getCategoriesWithListingCount();
    }

    /**
     * Obtenir les catégories les plus populaires
     */
    public List<Category> getMostPopularCategories() {
        return categoryRepository.findMostPopularCategories();
    }

    /**
     * Créer une nouvelle catégorie (pour admin)
     */
    @Transactional
    public Category createCategory(String nom, String nomAnglais, String emoji,
                                   String description, Integer ordreAffichage) {
        // Vérifier si la catégorie existe déjà
        if (categoryRepository.findByNom(nom).isPresent()) {
            throw new RuntimeException("Une catégorie avec ce nom existe déjà");
        }

        Category category = new Category();
        category.setNom(nom);
        category.setNomAnglais(nomAnglais);
        category.setEmoji(emoji);
        category.setDescription(description);
        category.setOrdreAffichage(ordreAffichage);
        category.setIsActive(true);

        return categoryRepository.save(category);
    }

    /**
     * Mettre à jour une catégorie (pour admin)
     */
    @Transactional
    public Category updateCategory(Long id, String nom, String nomAnglais, String emoji,
                                   String description, Integer ordreAffichage, Boolean isActive) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

        if (nom != null) category.setNom(nom);
        if (nomAnglais != null) category.setNomAnglais(nomAnglais);
        if (emoji != null) category.setEmoji(emoji);
        if (description != null) category.setDescription(description);
        if (ordreAffichage != null) category.setOrdreAffichage(ordreAffichage);
        if (isActive != null) category.setIsActive(isActive);

        return categoryRepository.save(category);
    }

    /**
     * Activer/Désactiver une catégorie
     */
    @Transactional
    public void toggleCategoryStatus(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

        category.setIsActive(!category.getIsActive());
        categoryRepository.save(category);
    }
}