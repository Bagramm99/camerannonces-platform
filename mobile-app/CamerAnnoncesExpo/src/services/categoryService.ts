// src/services/categoryService.ts - VERSION AVEC VRAIS APPELS API
import { api } from './api';

export interface Category {
    id: number;
    nom: string;
    nom_anglais: string;
    emoji: string;
    description: string;
    ordre_affichage: number;
    is_active: boolean;
}

class CategoryService {
    async getAllCategories(): Promise<Category[]> {
        try {
            const response = await api.get('/categories');
            console.log('Categories response:', response.data);
            // Extraire le tableau categories de la réponse
            return response.data.categories || response.data;
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            throw error;
        }
    }

    async getCategoryById(id: number): Promise<Category> {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement catégorie:', error);
            throw error;
        }
    }
}

export const categoryService = new CategoryService();