// src/services/listingService.ts
import { api } from './api';

export interface Listing {
    id: number;
    titre: string;
    description: string;
    prix?: number;
    prix_negociable: boolean;
    etat_produit: string;
    ville?: string;
    quartier?: string;
    date_creation: string;
    is_premium: boolean;
    is_urgent: boolean;
    vues: number;
    statut?: string;
    images?: Array<{ id: number; url: string; is_principale: boolean }>;
    category?: { id: number; nom: string; emoji: string };
}

// ✅ Normalisiert camelCase → snake_case
const normalizeListing = (data: any): Listing => ({
    id: data.id,
    titre: data.titre,
    description: data.description ?? '',
    prix: data.prix,
    prix_negociable: data.prixNegociable ?? data.prix_negociable ?? false,
    etat_produit: data.etatProduit ?? data.etat_produit ?? 'BON',
    ville: data.ville,
    quartier: data.quartier,
    date_creation: data.dateCreation ?? data.date_creation ?? '',
    is_premium: data.isPremium ?? data.is_premium ?? false,
    is_urgent: data.isUrgent ?? data.is_urgent ?? false,
    vues: data.vues ?? 0,
    statut: data.statut ?? 'ACTIVE',
    images: data.images ?? [],
    category: data.category ?? null,
});

class ListingService {
    async getRecentListings(limit: number = 10): Promise<Listing[]> {
        try {
            const response = await api.get(`/listings?limit=${limit}&sort=date`);
            const raw = response.data.listings || response.data.content || response.data;
            return Array.isArray(raw) ? raw.map(normalizeListing) : [];
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
            const response = await api.get(`/listings/category/${categoryId}`, {
                params: { page: page - 1, size, sort: sortBy, ...filters }
            });
            const raw = response.data.listings || response.data.content || response.data;
            return {
                data: Array.isArray(raw) ? raw.map(normalizeListing) : [],
                totalElements: response.data.totalElements ?? 0,
                totalPages: response.data.totalPages ?? 1,
            };
        } catch (error) {
            console.error('Erreur chargement annonces catégorie:', error);
            throw error;
        }
    }

    async getListingById(id: number): Promise<Listing> {
        try {
            const response = await api.get(`/listings/${id}`);
            return normalizeListing(response.data);
        } catch (error) {
            console.error('Erreur chargement annonce:', error);
            throw error;
        }
    }

    async searchListings(query: string, filters: any = {}, page: number = 1) {
        try {
            const response = await api.get('/search', {
                params: { q: query, page: page - 1, size: 10, ...filters }
            });
            const raw = response.data.listings || response.data.content || response.data;
            return {
                data: Array.isArray(raw) ? raw.map(normalizeListing) : [],
                totalElements: response.data.totalElements ?? 0,
                totalPages: response.data.totalPages ?? 1,
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
            return false;
        }
    }

    async removeFromFavorites(listingId: number): Promise<boolean> {
        try {
            await api.delete(`/favorites/${listingId}`);
            return true;
        } catch (error) {
            return false;
        }
    }

    async getUserFavorites(): Promise<Listing[]> {
        try {
            const response = await api.get('/favorites');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async incrementWhatsAppContact(listingId: number): Promise<void> {
        try {
            await api.post(`/listings/${listingId}/contact`);
        } catch (error) {}
    }

    async getUserListings(userId: number): Promise<Listing[]> {
        try {
            const response = await api.get(`/users/${userId}/listings`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export const listingService = new ListingService();