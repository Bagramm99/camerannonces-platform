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
    needsVerification?: boolean;
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
    //ResetPassword
    async resetPassword(telephone: string, nouveauMotDePasse: string): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/reset-password', {
                telephone,
                nouveauMotDePasse,
            });

            return response.data;
        } catch (error: any) {
            console.error('❌ Reset password error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors de la réinitialisation'
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

    // ✅ Inscription avec email et country code
    async registerWithEmail(
        nom: string,
        telephone: string,
        email: string | null,
        motDePasse: string,
        countryCode: string,
        ville?: string,
        quartier?: string
    ): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/register-with-email', {
                nom,
                telephone,
                email: email || undefined,
                motDePasse,
                countryCode,
                ville,
                quartier,
            });

            return response.data;
        } catch (error: any) {
            console.error('❌ Register with email error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors de l\'inscription'
            );
        }
    }

    // ✅ NOUVEAU: Vérifier le code
    async verifyCode(telephone: string, code: string): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/verify-code', {
                telephone,
                code,
            });

            return response.data;
        } catch (error: any) {
            console.error('❌ Verify code error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Code de vérification invalide'
            );
        }
    }

    // ✅ NOUVEAU: Renvoyer le code
    async resendCode(telephone: string): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/resend-code', {
                telephone,
            });

            return response.data;
        } catch (error: any) {
            console.error('❌ Resend code error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors du renvoi du code'
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

    // ✅ NOUVEAU: Vérifier disponibilité email
    async checkEmailAvailability(email: string): Promise<boolean> {
        try {
            const response = await api.get(`/auth/check-email?email=${email}`);
            return response.data.available;
        } catch (error) {
            return false;
        }
    }
}



export const authService = new AuthService();