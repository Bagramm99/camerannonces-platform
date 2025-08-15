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

// ============================================
// UTILITAIRES TOKEN (importés du authApi)
// ============================================

const getAccessToken = (): string | null => {
    return localStorage.getItem('camerannonces_access_token');
};

const getRefreshToken = (): string | null => {
    return localStorage.getItem('camerannonces_refresh_token');
};

const clearTokens = () => {
    localStorage.removeItem('camerannonces_access_token');
    localStorage.removeItem('camerannonces_refresh_token');
    localStorage.removeItem('camerannonces_user');
};

// ============================================
// INTERCEPTEURS JWT
// ============================================

// Intercepteur pour les requêtes (ajouter le token JWT automatiquement)
api.interceptors.request.use(
    (config) => {
        // Ajouter le token JWT si disponible
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('🚀 Requête API:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Erreur de requête:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses (gestion auto-refresh et erreurs JWT)
api.interceptors.response.use(
    (response) => {
        console.log('✅ Réponse API:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        console.error('❌ Erreur de réponse:', error.response?.status, error.config?.url);

        // Si erreur 401 (Unauthorized) et qu'on n'a pas déjà tenté de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            console.log('🔄 Token expiré, tentative de rafraîchissement...');

            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    // Appeler l'endpoint de refresh
                    const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken
                    });

                    if (refreshResponse.data.success) {
                        // Sauvegarder les nouveaux tokens
                        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.tokens;
                        localStorage.setItem('camerannonces_access_token', accessToken);
                        localStorage.setItem('camerannonces_refresh_token', newRefreshToken);

                        // Mettre à jour le header de la requête originale
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                        console.log('✅ Token rafraîchi, nouvelle tentative de requête');

                        // Relancer la requête originale
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('❌ Erreur lors du rafraîchissement du token:', refreshError);

                    // Impossible de rafraîchir, déconnecter l'utilisateur
                    clearTokens();

                    // Rediriger vers la page de connexion ou afficher modal
                    console.log('🔐 Redirection vers login nécessaire');

                    // Emettre un événement pour informer l'application
                    window.dispatchEvent(new CustomEvent('auth:logout', {
                        detail: { reason: 'token_refresh_failed' }
                    }));
                }
            } else {
                console.log('🔐 Aucun refresh token, redirection vers login');
                clearTokens();

                // Emettre un événement pour informer l'application
                window.dispatchEvent(new CustomEvent('auth:logout', {
                    detail: { reason: 'no_refresh_token' }
                }));
            }
        }

        return Promise.reject(error);
    }
);

// ============================================
// SERVICES DE TEST (inchangés)
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
// SERVICES MÉTIER (inchangés mais avec JWT automatique)
// ============================================

export const categoryApi = {
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getAllWithCount: async () => {
        const response = await api.get('/categories/with-count');
        return response.data;
    },

    getPopular: async () => {
        const response = await api.get('/categories/popular');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    search: async (keyword: string) => {
        const response = await api.get(`/categories/search?keyword=${keyword}`);
        return response.data;
    },
};

export const cityApi = {
    getAll: async () => {
        const response = await api.get('/cities');
        return response.data;
    },

    getRegions: async () => {
        const response = await api.get('/cities/regions');
        return response.data;
    },

    getByRegion: async (region: string) => {
        const response = await api.get(`/cities/region/${region}`);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/cities/${id}`);
        return response.data;
    },

    getPopular: async () => {
        const response = await api.get('/cities/popular');
        return response.data;
    },

    getWithListings: async () => {
        const response = await api.get('/cities/with-listings');
        return response.data;
    },

    search: async (keyword: string) => {
        const response = await api.get(`/cities/search?keyword=${keyword}`);
        return response.data;
    },

    getQuartiers: async (cityId: number) => {
        const response = await api.get(`/cities/${cityId}/quartiers`);
        return response.data;
    },

    getQuartiersByName: async (ville: string) => {
        const response = await api.get(`/cities/quartiers?ville=${ville}`);
        return response.data;
    },

    searchQuartiers: async (keyword: string) => {
        const response = await api.get(`/cities/quartiers/search?keyword=${keyword}`);
        return response.data;
    },

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

    // 🔒 PROTÉGÉ : Nécessite authentification JWT
    create: async (listing: any) => {
        const response = await api.post('/listings', listing);
        return response.data;
    },

    // 🔒 PROTÉGÉ : Nécessite authentification JWT
    update: async (id: number, listing: any) => {
        const response = await api.put(`/listings/${id}`, listing);
        return response.data;
    },

    // 🔒 PROTÉGÉ : Nécessite authentification JWT
    delete: async (id: number) => {
        const response = await api.delete(`/listings/${id}`);
        return response.data;
    },
};

export const searchApi = {
    search: async (filters: any) => {
        const response = await api.post('/search', filters);
        return response.data;
    },
};

// ============================================
// SERVICES PROTÉGÉS (nécessitent JWT)
// ============================================

export const userApi = {
    // 🔒 Récupérer mes annonces
    getMyListings: async () => {
        const response = await api.get('/user/my-listings');
        return response.data;
    },

    // 🔒 Récupérer mes favoris
    getFavorites: async () => {
        const response = await api.get('/favorites');
        return response.data;
    },

    // 🔒 Ajouter aux favoris
    addToFavorites: async (listingId: number) => {
        const response = await api.post(`/favorites/${listingId}`);
        return response.data;
    },

    // 🔒 Retirer des favoris
    removeFromFavorites: async (listingId: number) => {
        const response = await api.delete(`/favorites/${listingId}`);
        return response.data;
    },
};

export default api;