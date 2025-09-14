// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de base
const API_BASE_URL = __DEV__
    ? 'http://10.0.2.2:8080/api' // Émulateur Android
    : 'https://votre-domaine.com/api'; // Production

// Instance axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Erreur récupération token:', error);
    }
    return config;
});

// Intercepteur pour gérer les erreurs d'auth
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expiré, déconnecter l'utilisateur
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');
            // Rediriger vers login (tu ajouteras la logique navigation)
        }
        return Promise.reject(error);
    }
);

export { api, API_BASE_URL };

// src/services/authService.ts
import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginRequest {
    telephone: string;
    mot_de_passe: string;
}

export interface RegisterRequest {
    nom: string;
    telephone: string;
    email?: string;
    mot_de_passe: string;
    ville?: string;
    quartier?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        user: any;
    };
}

class AuthService {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur de connexion'
            };
        }
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur d\'inscription'
            };
        }
    }

    async saveAuthData(authData: { token: string; user: any }) {
        try {
            await AsyncStorage.setItem('auth_token', authData.token);
            await AsyncStorage.setItem('user_data', JSON.stringify(authData.user));
        } catch (error) {
            console.error('Erreur sauvegarde auth:', error);
        }
    }

    async getAuthData() {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            const userData = await AsyncStorage.getItem('user_data');

            if (token && userData) {
                return {
                    token,
                    user: JSON.parse(userData)
                };
            }
        } catch (error) {
            console.error('Erreur récupération auth:', error);
        }
        return null;
    }

    async logout() {
        try {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');
        } catch (error) {
            console.error('Erreur logout:', error);
        }
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            return !!token;
        } catch (error) {
            console.error('Erreur vérification auth:', error);
            return false;
        }
    }
}

export const authService = new AuthService();

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

class CategoryService {
    async getAllCategories(): Promise<Category[]> {
        try {
            const response = await api.get('/categories');
            return response.data;
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

// src/services/listingService.ts
import { api } from './api';

export interface Listing {
    id: number;
    user_id: number;
    category_id: number;
    titre: string;
    description: string;
    prix?: number;
    prix_negociable: boolean;
    etat_produit: string;
    ville?: string;
    quartier?: string;
    telephone_contact: string;
    vues: number;
    statut: string;
    is_premium: boolean;
    is_urgent: boolean;
    date_creation: string;
    images?: any[];
    category?: any;
}

export interface CreateListingRequest {
    category_id: number;
    titre: string;
    description: string;
    prix?: number;
    prix_negociable: boolean;
    etat_produit: string;
    ville?: string;
    quartier?: string;
    telephone_contact: string;
}

class ListingService {
    async getRecentListings(limit: number = 10): Promise<Listing[]> {
        try {
            const response = await api.get(`/listings?limit=${limit}&sort=date`);
            return response.data.content || response.data;
        } catch (error) {
            console.error('Erreur chargement annonces récentes:', error);
            throw error;
        }
    }

    async getListingsByCategory(
        categoryId: number,
        page: number = 1,
        size: number = 10,
        sortBy: string = 'date',
        filters: any = {}
    ) {
        try {
            const params = {
                page: page - 1, // Backend utilise 0-based indexing
                size,
                sort: sortBy,
                ...filters
            };

            const response = await api.get(`/listings/category/${categoryId}`, { params });
            return {
                data: response.data.content || response.data,
                totalElements: response.data.totalElements || response.data.length,
                totalPages: response.data.totalPages || 1
            };
        } catch (error) {
            console.error('Erreur chargement annonces catégorie:', error);
            throw error;
        }
    }

    async getListingById(id: number): Promise<Listing> {
        try {
            const response = await api.get(`/listings/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement annonce:', error);
            throw error;
        }
    }

    async createListing(listingData: CreateListingRequest): Promise<any> {
        try {
            const response = await api.post('/listings', listingData);
            return response.data;
        } catch (error) {
            console.error('Erreur création annonce:', error);
            throw error;
        }
    }

    async searchListings(query: string, filters: any = {}, page: number = 1) {
        try {
            const params = {
                q: query,
                page: page - 1,
                size: 10,
                ...filters
            };

            const response = await api.get('/search', { params });
            return {
                data: response.data.content || response.data,
                totalElements: response.data.totalElements || response.data.length,
                totalPages: response.data.totalPages || 1
            };
        } catch (error) {
            console.error('Erreur recherche:', error);
            throw error;
        }
    }

    async addToFavorites(listingId: number): Promise<boolean> {
        try {
            await api.post('/favorites', { listing_id: listingId });
            return true;
        } catch (error) {
            console.error('Erreur ajout favoris:', error);
            return false;
        }
    }

    async removeFromFavorites(listingId: number): Promise<boolean> {
        try {
            await api.delete(`/favorites/${listingId}`);
            return true;
        } catch (error) {
            console.error('Erreur suppression favoris:', error);
            return false;
        }
    }

    async getUserFavorites(): Promise<Listing[]> {
        try {
            const response = await api.get('/favorites');
            return response.data;
        } catch (error) {
            console.error('Erreur chargement favoris:', error);
            throw error;
        }
    }

    async incrementWhatsAppContact(listingId: number): Promise<void> {
        try {
            await api.post(`/listings/${listingId}/contact`);
        } catch (error) {
            console.error('Erreur increment contact:', error);
            // Ne pas bloquer l'utilisateur si cette API échoue
        }
    }
}

export const listingService = new ListingService();

// src/services/cityService.ts
import { api } from './api';

export interface City {
    id: number;
    nom: string;
    region: string;
    is_active: boolean;
}

export interface Quartier {
    id: number;
    nom: string;
    city_id: number;
    is_active: boolean;
}

class CityService {
    async getAllCities(): Promise<City[]> {
        try {
            const response = await api.get('/cities');
            return response.data;
        } catch (error) {
            console.error('Erreur chargement villes:', error);
            throw error;
        }
    }

    async getQuartiersByCity(cityId: number): Promise<Quartier[]> {
        try {
            const response = await api.get(`/cities/${cityId}/quartiers`);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement quartiers:', error);
            throw error;
        }
    }
}

export const cityService = new CityService();