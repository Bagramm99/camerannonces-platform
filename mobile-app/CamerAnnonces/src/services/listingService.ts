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
    private API_BASE_URL = __DEV__
        ? 'http://10.0.2.2:8080/api'  // Émulateur Android
        : 'https://votre-domaine.com/api'; // Production

    async getRecentListings(limit: number = 10): Promise<Listing[]> {
        try {
            // Mock data - remplace par ton service réel
            const mockListings: Listing[] = [
                {
                    id: 1,
                    user_id: 1,
                    category_id: 1,
                    titre: 'iPhone 13 Pro Max 256GB',
                    description: 'iPhone en parfait état, boîte complète avec tous les accessoires',
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
                            url: 'https://via.placeholder.com/400x300/0066CC/FFFFFF?text=iPhone+13',
                            is_principale: true
                        },
                        {
                            id: 2,
                            url: 'https://via.placeholder.com/400x300/333333/FFFFFF?text=iPhone+Back',
                            is_principale: false
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
                    titre: 'Toyota Corolla 2018 Automatique',
                    description: 'Voiture en excellent état, entretien régulier, climatisée, pneus neufs',
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
                    images: [
                        {
                            id: 3,
                            url: 'https://via.placeholder.com/400x300/ff6b6b/FFFFFF?text=Toyota+Corolla',
                            is_principale: true
                        }
                    ],
                    category: {
                        id: 2,
                        nom: 'Véhicules',
                        emoji: '🚗'
                    }
                },
                {
                    id: 3,
                    user_id: 1,
                    category_id: 3,
                    titre: 'Appartement 3 chambres Bastos',
                    description: 'Bel appartement moderne, 3 chambres, 2 salles de bain, cuisine équipée',
                    prix: 180000,
                    prix_negociable: true,
                    etat_produit: 'BON',
                    ville: 'Yaoundé',
                    quartier: 'Bastos',
                    telephone_contact: '237698123456',
                    vues: 67,
                    statut: 'ACTIVE',
                    is_premium: true,
                    is_urgent: false,
                    date_creation: new Date(Date.now() - 172800000).toISOString(),
                    images: [],
                    category: {
                        id: 3,
                        nom: 'Immobilier',
                        emoji: '🏠'
                    }
                },
                {
                    id: 4,
                    user_id: 3,
                    category_id: 4,
                    titre: 'Robe de soirée élégante',
                    description: 'Magnifique robe de soirée, taille M, portée une seule fois',
                    prix: 35000,
                    prix_negociable: true,
                    etat_produit: 'TRES_BON',
                    ville: 'Douala',
                    quartier: 'Akwa',
                    telephone_contact: '237655112233',
                    vues: 43,
                    statut: 'ACTIVE',
                    is_premium: false,
                    is_urgent: false,
                    date_creation: new Date(Date.now() - 259200000).toISOString(),
                    images: [
                        {
                            id: 4,
                            url: 'https://via.placeholder.com/400x300/ff9ff3/FFFFFF?text=Robe+Soiree',
                            is_principale: true
                        }
                    ],
                    category: {
                        id: 4,
                        nom: 'Mode & Beauté',
                        emoji: '👕'
                    }
                },
                {
                    id: 5,
                    user_id: 2,
                    category_id: 6,
                    titre: 'MacBook Air M1 2021',
                    description: 'MacBook Air M1 2021, 8GB RAM, 256GB SSD, excellent état',
                    prix: 650000,
                    prix_negociable: false,
                    etat_produit: 'TRES_BON',
                    ville: 'Bafoussam',
                    quartier: 'Marché A',
                    telephone_contact: '237677987654',
                    vues: 156,
                    statut: 'ACTIVE',
                    is_premium: true,
                    is_urgent: true,
                    date_creation: new Date(Date.now() - 345600000).toISOString(),
                    images: [
                        {
                            id: 5,
                            url: 'https://via.placeholder.com/400x300/54a0ff/FFFFFF?text=MacBook+Air',
                            is_principale: true
                        }
                    ],
                    category: {
                        id: 6,
                        nom: 'Électronique',
                        emoji: '🖥️'
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
        try {
            const allListings = await this.getRecentListings(50);

            // Filtrer par catégorie
            let filteredListings = allListings.filter(listing =>
                listing.category_id === categoryId
            );

            // Appliquer les filtres
            if (filters.prix_min) {
                filteredListings = filteredListings.filter(listing =>
                    listing.prix && listing.prix >= parseInt(filters.prix_min)
                );
            }

            if (filters.prix_max) {
                filteredListings = filteredListings.filter(listing =>
                    listing.prix && listing.prix <= parseInt(filters.prix_max)
                );
            }

            if (filters.etat_produit) {
                filteredListings = filteredListings.filter(listing =>
                    listing.etat_produit === filters.etat_produit
                );
            }

            if (filters.ville) {
                filteredListings = filteredListings.filter(listing =>
                    listing.ville?.toLowerCase().includes(filters.ville.toLowerCase())
                );
            }

            // Tri
            switch (sortBy) {
                case 'prix_asc':
                    filteredListings.sort((a, b) => (a.prix || 0) - (b.prix || 0));
                    break;
                case 'prix_desc':
                    filteredListings.sort((a, b) => (b.prix || 0) - (a.prix || 0));
                    break;
                case 'popularite':
                    filteredListings.sort((a, b) => b.vues - a.vues);
                    break;
                case 'date':
                default:
                    filteredListings.sort((a, b) =>
                        new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
                    );
                    break;
            }

            // Pagination
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

            // Recherche dans titre et description
            const filteredListings = allListings.filter(listing =>
                listing.titre.toLowerCase().includes(query.toLowerCase()) ||
                listing.description.toLowerCase().includes(query.toLowerCase())
            );

            // Pagination
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

    async createListing(listingData: CreateListingRequest): Promise<any> {
        try {
            // Mock création - remplace par ton service réel
            const mockResponse = {
                success: true,
                message: 'Annonce créée avec succès',
                data: {
                    id: Math.floor(Math.random() * 1000) + 100,
                    ...listingData,
                    user_id: 1, // Mock user ID
                    vues: 0,
                    statut: 'ACTIVE',
                    is_premium: false,
                    is_urgent: false,
                    date_creation: new Date().toISOString()
                }
            };

            await new Promise(resolve => setTimeout(resolve, 1500));
            return mockResponse;
        } catch (error) {
            console.error('Erreur création annonce:', error);
            throw error;
        }
    }

    async addToFavorites(listingId: number): Promise<boolean> {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`Ajouté aux favoris: ${listingId}`);
            return true;
        } catch (error) {
            console.error('Erreur ajout favoris:', error);
            return false;
        }
    }

    async removeFromFavorites(listingId: number): Promise<boolean> {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`Retiré des favoris: ${listingId}`);
            return true;
        } catch (error) {
            console.error('Erreur suppression favoris:', error);
            return false;
        }
    }

    async getUserFavorites(): Promise<Listing[]> {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            // Mock: retourne quelques favoris pour les tests
            const allListings = await this.getRecentListings(10);
            return allListings.slice(0, 2); // 2 favoris pour test
        } catch (error) {
            console.error('Erreur chargement favoris:', error);
            throw error;
        }
    }

    async incrementWhatsAppContact(listingId: number): Promise<void> {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            console.log(`Contact WhatsApp incrementé pour annonce ${listingId}`);
        } catch (error) {
            console.error('Erreur increment contact:', error);
            // Ne pas bloquer l'utilisateur si cette API échoue
        }
    }

    async getUserListings(_userId: number): Promise<Listing[]> {
        try {
            const allListings = await this.getRecentListings(50);
            return allListings.filter(listing => listing.user_id === 1); // Mock: toujours user 1
        } catch (error) {
            console.error('Erreur chargement annonces utilisateur:', error);
            throw error;
        }
    }
}

export const listingService = new ListingService();