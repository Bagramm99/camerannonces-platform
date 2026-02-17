// src/services/categoryService.ts
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

// ✅ Normalisiert camelCase → snake_case
const normalizeCategory = (data: any): Category => ({
    id: data.id,
    nom: data.nom,
    nom_anglais: data.nomAnglais ?? data.nom_anglais ?? '',
    emoji: data.emoji ?? '',
    description: data.description ?? '',
    ordre_affichage: data.ordreAffichage ?? data.ordre_affichage ?? 0,
    is_active: data.isActive ?? data.is_active ?? true,
});

class CategoryService {
    async getAllCategories(): Promise<Category[]> {
        try {
            const response = await api.get('/categories');
            const raw = response.data.categories || response.data;
            return Array.isArray(raw) ? raw.map(normalizeCategory) : [];
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            throw error;
        }
    }

    async getCategoryById(id: number): Promise<Category> {
        try {
            const response = await api.get(`/categories/${id}`);
            return normalizeCategory(response.data);
        } catch (error) {
            console.error('Erreur chargement catégorie:', error);
            throw error;
        }
    }
}

export const categoryService = new CategoryService();