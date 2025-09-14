// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de base
const API_BASE_URL = __DEV__
    ? 'http://192.168.178.23:8082/api'
    : 'https://votre-domaine.com/api';

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
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
    }
);

export { api, API_BASE_URL };