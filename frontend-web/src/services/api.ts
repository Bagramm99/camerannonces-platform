import axios from 'axios';

// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:8081/api';

// Instance axios avec configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 secondes
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur pour les requêtes (ajouter le token JWT plus tard)
api.interceptors.request.use(
    (config) => {
        // Plus tard: ajouter le token JWT ici
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        console.log('🚀 Requête API:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Erreur de requête:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
    (response) => {
        console.log('✅ Réponse API:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('❌ Erreur de réponse:', error);
        if (error.response?.status === 401) {
            // Plus tard: déconnecter l'utilisateur
            console.log('🔐 Token expiré, redirection vers login');
        }
        return Promise.reject(error);
    }
);

// ============================================
// SERVICES DE TEST
// ============================================

export const testApi = {
    // Test de connexion basique
    hello: async () => {
        const response = await api.get('/test/hello');
        return response.data;
    },

    // Test des catégories
    getCategoriesPreview: async () => {
        const response = await api.get('/test/categories-preview');
        return response.data;
    },

    // Test des villes
    getCitiesPreview: async () => {
        const response = await api.get('/test/cities-preview');
        return response.data;
    },

    // Test POST
    echo: async (data: any) => {
        const response = await api.post('/test/echo', data);
        return response.data;
    },
};

// ============================================
// SERVICES MÉTIER RÉELS (PostgreSQL)
// ============================================

export const categoryApi = {
    // Récupérer toutes les catégories
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    // Récupérer les catégories avec compteur d'annonces
    getAllWithCount: async () => {
        const response = await api.get('/categories/with-count');
        return response.data;
    },

    // Récupérer les catégories populaires
    getPopular: async () => {
        const response = await api.get('/categories/popular');
        return response.data;
    },

    // Récupérer une catégorie par ID
    getById: async (id: number) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    // Rechercher des catégories
    search: async (keyword: string) => {
        const response = await api.get(`/categories/search?keyword=${keyword}`);
        return response.data;
    },
};

export const cityApi = {
    // Récupérer toutes les villes
    getAll: async () => {
        const response = await api.get('/cities');
        return response.data;
    },

    // Récupérer toutes les régions
    getRegions: async () => {
        const response = await api.get('/cities/regions');
        return response.data;
    },

    // Récupérer les villes par région
    getByRegion: async (region: string) => {
        const response = await api.get(`/cities/region/${region}`);
        return response.data;
    },

    // Récupérer une ville par ID
    getById: async (id: number) => {
        const response = await api.get(`/cities/${id}`);
        return response.data;
    },

    // Récupérer les villes populaires
    getPopular: async () => {
        const response = await api.get('/cities/popular');
        return response.data;
    },

    // Récupérer les villes avec annonces
    getWithListings: async () => {
        const response = await api.get('/cities/with-listings');
        return response.data;
    },

    // Rechercher des villes
    search: async (keyword: string) => {
        const response = await api.get(`/cities/search?keyword=${keyword}`);
        return response.data;
    },

    // Récupérer les quartiers d'une ville
    getQuartiers: async (cityId: number) => {
        const response = await api.get(`/cities/${cityId}/quartiers`);
        return response.data;
    },

    // Récupérer les quartiers par nom de ville
    getQuartiersByName: async (ville: string) => {
        const response = await api.get(`/cities/quartiers?ville=${ville}`);
        return response.data;
    },

    // Rechercher des quartiers
    searchQuartiers: async (keyword: string) => {
        const response = await api.get(`/cities/quartiers/search?keyword=${keyword}`);
        return response.data;
    },

    // Récupérer les statistiques par région
    getRegionStats: async () => {
        const response = await api.get('/cities/stats-by-region');
        return response.data;
    },
};

export const listingApi = {
    getAll: async (params?: any) => {
        const response = await api.get('/listings', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/listings/${id}`);
        return response.data;
    },

    create: async (listing: any) => {
        const response = await api.post('/listings', listing);
        return response.data;
    },
};

export const searchApi = {
    search: async (filters: any) => {
        const response = await api.post('/search', filters);
        return response.data;
    },
};

export const authApi = {
    login: async (credentials: { email: string; password: string }) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        // Plus tard: invalider le token côté backend
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export default api;