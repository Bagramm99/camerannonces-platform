// src/services/searchService.ts
import { api } from './api';

export interface SearchFilters {
    keyword?: string;
    categoryId?: number;
    ville?: string;
    quartier?: string;
    minPrix?: number;
    maxPrix?: number;
    etatProduit?: string;
    prixNegociable?: boolean;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    size?: number;
}

export const searchService = {
    // Recherche simple par mot-clé
    searchByKeyword: async (keyword: unknown, page = 0, size = 20) => {
        try {
            const response = await api.get('/search', {
                params: { keyword, page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur recherche par mot-clé:', error);
            throw error;
        }
    },

    // Recherche avec filtres basiques
    searchWithBasicFilters: async (filters: SearchFilters) => {
        try {
            const response = await api.get('/search/filter', {
                params: {
                    keyword: filters.keyword,
                    categoryId: filters.categoryId,
                    ville: filters.ville,
                    page: filters.page || 0,
                    size: filters.size || 20,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur recherche avec filtres:', error);
            throw error;
        }
    },

    // Recherche avancée
    advancedSearch: async (filters: SearchFilters) => {
        try {
            const response = await api.post('/search/advanced', filters);
            return response.data;
        } catch (error) {
            console.error('Erreur recherche avancée:', error);
            throw error;
        }
    },

    // Recherche par catégorie
    searchByCategory: async (categoryId: number, page = 0, size = 20) => {
        try {
            const response = await api.get(`/search/category/${categoryId}`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur recherche par catégorie:', error);
            throw error;
        }
    },

    // Recherche par ville
    searchByCity: async (ville: string, page = 0, size = 20) => {
        try {
            const response = await api.get(`/search/city/${ville}`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur recherche par ville:', error);
            throw error;
        }
    },

    // Annonces premium
    getPremiumListings: async (page = 0, size = 20) => {
        try {
            const response = await api.get('/search/premium', {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur récupération annonces premium:', error);
            throw error;
        }
    },

    // Annonces urgentes
    getUrgentListings: async (page = 0, size = 20) => {
        try {
            const response = await api.get('/search/urgent', {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur récupération annonces urgentes:', error);
            throw error;
        }
    },

    // Suggestions de recherche
    getSuggestions: async (keyword: string, limit = 10) => {
        try {
            const response = await api.get('/search/suggestions', {
                params: { keyword, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur suggestions:', error);
            throw error;
        }
    },

    // Compter les résultats
    countResults: async (keyword?: string, categoryId?: number, ville?: string) => {
        try {
            const response = await api.get('/search/count', {
                params: { keyword, categoryId, ville }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur comptage résultats:', error);
            throw error;
        }
    },
};