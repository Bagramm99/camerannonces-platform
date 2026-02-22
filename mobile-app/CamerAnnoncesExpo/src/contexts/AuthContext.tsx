// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

interface User {
    id: number;
    nom: string;
    telephone: string;
    email?: string;
    ville?: string;
    quartier?: string;
    isBoutique: boolean;
    planActuel: string;
}

interface AuthContextData {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (telephone: string, motDePasse: string) => Promise<void>;
    register: (nom: string, telephone: string, motDePasse: string, ville?: string, quartier?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Vérifier si l'utilisateur est déjà connecté au démarrage
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const userData = await AsyncStorage.getItem('user_data');

            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Erreur vérification auth:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (telephone: string, motDePasse: string) => {
        const response = await authService.login(telephone, motDePasse);

        if (response.success && response.user && response.tokens) {
            await AsyncStorage.setItem('access_token', response.tokens.accessToken);
            await AsyncStorage.setItem('refresh_token', response.tokens.refreshToken);
            await AsyncStorage.setItem('user_data', JSON.stringify(response.user));
            setUser(response.user);
        } else {
            throw new Error(response.message || 'Échec de connexion');
        }
    };

    const register = async (
        nom: string,
        telephone: string,
        motDePasse: string,
        ville?: string,
        quartier?: string
    ) => {
        const response = await authService.register(nom, telephone, motDePasse, ville, quartier);

        if (response.success && response.user && response.tokens) {
            await AsyncStorage.setItem('access_token', response.tokens.accessToken);
            await AsyncStorage.setItem('refresh_token', response.tokens.refreshToken);
            await AsyncStorage.setItem('user_data', JSON.stringify(response.user));
            setUser(response.user);
        } else {
            throw new Error(response.message || 'Échec d\'inscription');
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        await AsyncStorage.removeItem('user_data');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);