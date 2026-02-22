// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
    ? 'http://192.168.178.23:8082/api'
    : 'https://votre-domaine.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ FIXED: Interceptor mit return await!
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            console.log('🔑 Interceptor - Token:', token ? 'VORHANDEN' : 'FEHLT');

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('✅ Authorization Header gesetzt:', config.headers.Authorization?.substring(0, 30));
            } else {
                console.log('⚠️ Kein Token gefunden!');
            }
        } catch (error) {
            console.error('❌ Interceptor Fehler:', error);
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'auth
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('❌ Response Error Status:', error.response?.status);
        console.log('❌ Response Error Data:', error.response?.data);

        if (error.response?.status === 401) {
            console.log('🔒 401 Unauthorized - Lösche Token');
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
            await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
    }
);

export { api, API_BASE_URL };