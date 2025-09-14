// src/services/authService.ts
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
    private API_BASE_URL = __DEV__
        ? 'http://10.0.2.2:8080/api'  // Émulateur Android
        : 'https://votre-domaine.com/api'; // Production

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            // Mock response - remplace par un vrai appel API
            const mockResponse = {
                success: true,
                message: 'Connexion réussie',
                data: {
                    token: 'mock-jwt-token-' + Date.now(),
                    user: {
                        id: 1,
                        nom: 'Jean Dupont',
                        telephone: credentials.telephone,
                        email: 'jean.dupont@email.cm',
                        ville: 'Douala',
                        quartier: 'Akwa',
                        is_boutique: false,
                        plan_actuel: 'GRATUIT',
                        date_creation: new Date().toISOString()
                    }
                }
            };

            // Simulation d'un délai réseau
            await new Promise(resolve => setTimeout(resolve, 1000));

            return mockResponse;

            /* Remplace par ceci pour un vrai appel API :
            const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(credentials),
            });

            const data = await response.json();
            return data;
            */
        } catch (error: any) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Erreur de connexion'
            };
        }
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            // Mock response - remplace par un vrai appel API
            const mockResponse = {
                success: true,
                message: 'Inscription réussie',
                data: {
                    token: 'mock-jwt-token-' + Date.now(),
                    user: {
                        id: 2,
                        nom: userData.nom,
                        telephone: userData.telephone,
                        email: userData.email,
                        ville: userData.ville,
                        is_boutique: false,
                        plan_actuel: 'GRATUIT',
                        date_creation: new Date().toISOString()
                    }
                }
            };

            // Simulation d'un délai réseau
            await new Promise(resolve => setTimeout(resolve, 1500));

            return mockResponse;

            /* Remplace par ceci pour un vrai appel API :
            const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            });

            const data = await response.json();
            return data;
            */
        } catch (error: any) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.message || 'Erreur d\'inscription'
            };
        }
    }

    async saveAuthData(authData: { token: string; user: any } | undefined) {
        try {
            if (authData) {
                await AsyncStorage.setItem('auth_token', authData.token);
            }
            if (authData) {
                await AsyncStorage.setItem('user_data', JSON.stringify(authData.user));
            }
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

    async getCurrentUser() {
        try {
            const userData = await AsyncStorage.getItem('user_data');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Erreur récupération utilisateur:', error);
            return null;
        }
    }
}

export const authService = new AuthService();