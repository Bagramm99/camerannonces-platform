// src/services/categoryService.ts
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
            // Mock data - remplace par ton service réel
            const mockCategories: Category[] = [
                {
                    id: 1,
                    nom: 'Téléphones & Accessoires',
                    nom_anglais: 'Phones & Accessories',
                    emoji: '📱',
                    description: 'Smartphones, tablettes, écouteurs',
                    ordre_affichage: 1,
                    is_active: true
                },
                {
                    id: 2,
                    nom: 'Véhicules',
                    nom_anglais: 'Vehicles',
                    emoji: '🚗',
                    description: 'Voitures, motos, camions',
                    ordre_affichage: 2,
                    is_active: true
                },
                {
                    id: 3,
                    nom: 'Immobilier',
                    nom_anglais: 'Real Estate',
                    emoji: '🏠',
                    description: 'Locations, ventes, terrains',
                    ordre_affichage: 3,
                    is_active: true
                },
                {
                    id: 4,
                    nom: 'Mode & Beauté',
                    nom_anglais: 'Fashion & Beauty',
                    emoji: '👕',
                    description: 'Vêtements, chaussures, cosmétiques',
                    ordre_affichage: 4,
                    is_active: true
                },
                {
                    id: 5,
                    nom: 'Emplois & Services',
                    nom_anglais: 'Jobs & Services',
                    emoji: '💼',
                    description: 'Offres d\'emploi, services',
                    ordre_affichage: 5,
                    is_active: true
                },
                {
                    id: 6,
                    nom: 'Électronique',
                    nom_anglais: 'Electronics',
                    emoji: '🖥️',
                    description: 'TV, ordinateurs, consoles',
                    ordre_affichage: 6,
                    is_active: true
                }
            ];

            // Simulation d'un délai réseau
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockCategories;
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            throw error;
        }
    }

    async getCategoryById(id: number): Promise<Category | null> {
        try {
            const categories = await this.getAllCategories();
            return categories.find(cat => cat.id === id) || null;
        } catch (error) {
            console.error('Erreur chargement catégorie:', error);
            throw error;
        }
    }
}

export const categoryService = new CategoryService();

// src/services/listingService.ts
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

class ListingService {
    private _sortBy: string;
    private _filters: any;
    async getRecentListings(limit: number = 10): Promise<Listing[]> {
        try {
            // Mock data - remplace par ton service réel
            const mockListings: Listing[] = [
                {
                    id: 1,
                    user_id: 1,
                    category_id: 1,
                    titre: 'iPhone 13 Pro Max 256GB',
                    description: 'iPhone en parfait état, boîte complète',
                    prix: 450000,
                    prix_negociable: true,
                    etat_produit: 'TRES_BON',
                    ville: 'Douala',
                    quartier: 'Bonanjo',
                    telephone_contact: '237698123456',
                    vues: 125,
                    statut: 'ACTIVE',
                    is_premium: true,
                    is_urgent: false,
                    date_creation: new Date().toISOString(),
                    images: [
                        {
                            id: 1,
                            url: 'https://via.placeholder.com/400x300/0066CC/FFFFFF?text=iPhone',
                            is_principale: true
                        }
                    ],
                    category: {
                        id: 1,
                        nom: 'Téléphones & Accessoires',
                        emoji: '📱'
                    }
                },
                {
                    id: 2,
                    user_id: 2,
                    category_id: 2,
                    titre: 'Toyota Corolla 2018',
                    description: 'Voiture en excellent état, entretien régulier',
                    prix: 8500000,
                    prix_negociable: false,
                    etat_produit: 'BON',
                    ville: 'Yaoundé',
                    quartier: 'Bastos',
                    telephone_contact: '237677987654',
                    vues: 89,
                    statut: 'ACTIVE',
                    is_premium: false,
                    is_urgent: true,
                    date_creation: new Date(Date.now() - 86400000).toISOString(),
                    images: [],
                    category: {
                        id: 2,
                        nom: 'Véhicules',
                        emoji: '🚗'
                    }
                }
            ];

            // Simulation d'un délai réseau
            await new Promise(resolve => setTimeout(resolve, 800));
            return mockListings.slice(0, limit);
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
        this._sortBy = sortBy;
        this._filters = filters;
        try {
            // Mock data basée sur la catégorie
            const mockListings = await this.getRecentListings(20);
            const filteredListings = mockListings.filter(listing =>
                listing.category_id === categoryId
            );

            // Simulation pagination
            const startIndex = (page - 1) * size;
            const endIndex = startIndex + size;
            const paginatedListings = filteredListings.slice(startIndex, endIndex);

            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                data: paginatedListings,
                totalElements: filteredListings.length,
                totalPages: Math.ceil(filteredListings.length / size)
            };
        } catch (error) {
            console.error('Erreur chargement annonces catégorie:', error);
            throw error;
        }
    }

    async getListingById(id: number): Promise<Listing | null> {
        try {
            const listings = await this.getRecentListings(50);
            return listings.find(listing => listing.id === id) || null;
        } catch (error) {
            console.error('Erreur chargement annonce:', error);
            throw error;
        }
    }

    async searchListings(query: string, _filters: any = {}, page: number = 1) {
        try {
            const allListings = await this.getRecentListings(50);
            const filteredListings = allListings.filter(listing =>
                listing.titre.toLowerCase().includes(query.toLowerCase()) ||
                listing.description.toLowerCase().includes(query.toLowerCase())
            );

            const startIndex = (page - 1) * 10;
            const paginatedListings = filteredListings.slice(startIndex, startIndex + 10);

            await new Promise(resolve => setTimeout(resolve, 800));

            return {
                data: paginatedListings,
                totalElements: filteredListings.length,
                totalPages: Math.ceil(filteredListings.length / 10)
            };
        } catch (error) {
            console.error('Erreur recherche:', error);
            throw error;
        }
    }

    async addToFavorites(_listingId: number): Promise<boolean> {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        } catch (error) {
            console.error('Erreur ajout favoris:', error);
            return false;
        }
    }

    async removeFromFavorites(_listingId: number): Promise<boolean> {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        } catch (error) {
            console.error('Erreur suppression favoris:', error);
            return false;
        }
    }

    async getUserFavorites(): Promise<Listing[]> {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            return []; // Mock: aucun favori pour l'instant
        } catch (error) {
            console.error('Erreur chargement favoris:', error);
            throw error;
        }
    }

    async incrementWhatsAppContact(listingId: number): Promise<void> {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            // Mock: juste log pour debug
            console.log(`Contact WhatsApp incrementé pour annonce ${listingId}`);
        } catch (error) {
            console.error('Erreur increment contact:', error);
        }
    }
}

export const listingService = new ListingService();