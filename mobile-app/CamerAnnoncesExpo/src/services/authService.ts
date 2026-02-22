// src/services/authService.ts
import { api } from './api';

interface AuthResponse {
    success: boolean;
    message: string;
    user?: any;
    tokens?: {
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
    };
}

class AuthService {
    async login(telephone: string, motDePasse: string): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/login', {
                telephone,
                motDePasse,
            });

            return response.data;
        } catch (error: any) {
            console.error('❌ Login error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Numéro ou mot de passe incorrect'
            );
        }
    }

    async register(
        nom: string,
        telephone: string,
        motDePasse: string,
        ville?: string,
        quartier?: string
    ): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/register', {
                nom,
                telephone,
                motDePasse,
                ville,
                quartier,
            });

            return response.data;
        } catch (error: any) {
            console.error('❌ Register error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors de l\'inscription'
            );
        }
    }

    async checkPhoneAvailability(telephone: string): Promise<boolean> {
        try {
            const response = await api.get(`/auth/check-phone?telephone=${telephone}`);
            return response.data.available;
        } catch (error) {
            return false;
        }
    }
}

export const authService = new AuthService();