// src/services/listingService.ts - VERSION AVEC VRAIS APPELS API
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
    images?: Array<{
        id: number;
        url: string;
        is_principale: boolean;
    }>;
    category?: {
        id: number;
        nom: string;
        emoji: string;
    };
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
            console.log('Listings response:', response.data);
            // Extraire le tableau listings de la réponse
            return response.data.listings || response.data.content || response.data;
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
                page: page - 1,
                size,
                sort: sortBy,
                ...filters
            };

            const response = await api.get(`/listings/category/${categoryId}`, { params });
            return {
                data: response.data.listings || response.data.content || response.data,
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
                data: response.data.listings || response.data.content || response.data,
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
        }
    }

    async getUserListings(userId: number): Promise<Listing[]> {
        try {
            const response = await api.get(`/users/${userId}/listings`);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement annonces utilisateur:', error);
            throw error;
        }
    }
}

export const listingService = new ListingService();