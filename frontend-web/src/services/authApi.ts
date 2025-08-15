// src/services/authApi.ts
import api from './api';

// ============================================
// TYPES POUR AUTHENTIFICATION JWT
// ============================================

export interface LoginRequest {
    telephone: string;
    motDePasse: string;
}

export interface RegisterRequest {
    nom: string;
    telephone: string;
    motDePasse: string;
    ville?: string;
    quartier?: string;
}

export interface User {
    id: number;
    nom: string;
    telephone: string;
    email?: string;
    ville?: string;
    quartier?: string;
    isBoutique: boolean;
    nomBoutique?: string;
    planActuel: string;
    dateCreation: string;
    isActive: boolean;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    refreshExpiresIn: number;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
    tokens: AuthTokens;
}

// ============================================
// STOCKAGE LOCAL
// ============================================

const TOKEN_KEY = 'camerannonces_access_token';
const REFRESH_TOKEN_KEY = 'camerannonces_refresh_token';
const USER_KEY = 'camerannonces_user';

export const tokenStorage = {
    saveTokens: (tokens: AuthTokens) => {
        localStorage.setItem(TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    },

    getAccessToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    clearTokens: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        console.log('🗑️ Tokens supprimés du localStorage');
    },

    saveUser: (user: User) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        console.log('💾 Utilisateur sauvegardé:', user.nom);
    },

    getUser: (): User | null => {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    isLoggedIn: (): boolean => {
        const token = tokenStorage.getAccessToken();
        return !!token;
    }
};

// ============================================
// SERVICE AUTHENTIFICATION JWT
// ============================================

export const authApi = {
    // Inscription
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        try {
            console.log('🔄 AuthAPI: Inscription utilisateur...', { telephone: data.telephone });

            const response = await api.post('/auth/register', data);

            if (response.data.success) {
                tokenStorage.saveTokens(response.data.tokens);
                tokenStorage.saveUser(response.data.user);

                console.log('✅ AuthAPI: Inscription réussie:', response.data.user.nom);
                return response.data;
            } else {
                throw new Error(response.data.message || 'Erreur lors de l\'inscription');
            }
        } catch (error: any) {
            console.error('❌ AuthAPI: Erreur inscription:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Erreur de connexion au serveur';

            throw new Error(errorMessage);
        }
    },

    // Connexion
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        try {
            console.log('🔄 AuthAPI: Connexion utilisateur...', { telephone: data.telephone });

            const response = await api.post('/auth/login', data);

            if (response.data.success) {
                tokenStorage.saveTokens(response.data.tokens);
                tokenStorage.saveUser(response.data.user);

                console.log('✅ AuthAPI: Connexion réussie:', response.data.user.nom);
                return response.data;
            } else {
                throw new Error(response.data.message || 'Erreur lors de la connexion');
            }
        } catch (error: any) {
            console.error('❌ AuthAPI: Erreur connexion:', error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Identifiants incorrects';

            throw new Error(errorMessage);
        }
    },

    // Déconnexion
    logout: async (): Promise<void> => {
        try {
            console.log('🔄 AuthAPI: Déconnexion...');

            // Essayer d'appeler l'endpoint de déconnexion
            try {
                await api.post('/auth/logout');
                console.log('✅ AuthAPI: Déconnexion serveur OK');
            } catch (error) {
                console.warn('⚠️ AuthAPI: Erreur API logout (ignorée):', error);
            }

            // Toujours nettoyer le localStorage
            tokenStorage.clearTokens();
            console.log('✅ AuthAPI: Déconnexion locale terminée');
        } catch (error) {
            console.error('❌ AuthAPI: Erreur déconnexion:', error);
            // Forcer le nettoyage même en cas d'erreur
            tokenStorage.clearTokens();
        }
    },

    // Récupérer profil utilisateur
    getProfile: async (): Promise<User> => {
        try {
            console.log('🔄 AuthAPI: Récupération du profil...');

            const response = await api.get('/auth/me');

            if (response.data.success) {
                tokenStorage.saveUser(response.data.user);
                console.log('✅ AuthAPI: Profil récupéré:', response.data.user.nom);
                return response.data.user;
            } else {
                throw new Error(response.data.message || 'Erreur lors de la récupération du profil');
            }
        } catch (error: any) {
            console.error('❌ AuthAPI: Erreur récupération profil:', error);
            throw error;
        }
    },

    // Rafraîchir le token
    refreshToken: async (): Promise<AuthTokens> => {
        try {
            console.log('🔄 AuthAPI: Rafraîchissement token...');

            const refreshToken = tokenStorage.getRefreshToken();
            if (!refreshToken) {
                throw new Error('Aucun refresh token disponible');
            }

            const response = await api.post('/auth/refresh', {
                refreshToken
            });

            if (response.data.success) {
                tokenStorage.saveTokens(response.data.tokens);
                console.log('✅ AuthAPI: Token rafraîchi');
                return response.data.tokens;
            } else {
                throw new Error(response.data.message || 'Erreur lors du rafraîchissement');
            }
        } catch (error: any) {
            console.error('❌ AuthAPI: Erreur rafraîchissement token:', error);
            throw error;
        }
    },

    // Vérifier disponibilité téléphone
    checkPhoneAvailability: async (telephone: string): Promise<boolean> => {
        try {
            const response = await api.get(`/auth/check-phone?telephone=${telephone}`);
            return response.data.available;
        } catch (error) {
            console.error('❌ AuthAPI: Erreur vérification téléphone:', error);
            return false;
        }
    }
};

// ============================================
// UTILITAIRES
// ============================================

export const authUtils = {
    // Formater numéro téléphone camerounais
    formatCameroonPhone: (phone: string): string => {
        const cleanPhone = phone.replace(/[^\d]/g, '');

        if (cleanPhone.startsWith('237')) {
            return cleanPhone;
        }

        if (cleanPhone.startsWith('6') || cleanPhone.startsWith('2')) {
            return '237' + cleanPhone;
        }

        return cleanPhone;
    },

    // Valider numéro téléphone camerounais
    isValidCameroonPhone: (phone: string): boolean => {
        const formatted = authUtils.formatCameroonPhone(phone);
        return /^237[0-9]{9}$/.test(formatted);
    },

    // Valider mot de passe
    isValidPassword: (password: string): { valid: boolean; message?: string } => {
        if (!password || password.length < 6) {
            return { valid: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
        }
        return { valid: true };
    },

    // Obtenir utilisateur actuel
    getCurrentUser: (): User | null => {
        return tokenStorage.getUser();
    },

    // Vérifier si authentifié
    isAuthenticated: (): boolean => {
        return tokenStorage.isLoggedIn();
    },

    // Vérifier si le token est expiré (basique)
    isTokenExpired: (): boolean => {
        const token = tokenStorage.getAccessToken();
        if (!token) return true;

        try {
            // Decode JWT basique (sans vérification de signature)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.warn('⚠️ Erreur décodage token:', error);
            return true;
        }
    }
};

// Export par défaut
export default authApi;