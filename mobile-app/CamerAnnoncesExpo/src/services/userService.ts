// src/services/userService.ts
import { api } from './api';
import * as ImageManipulator from 'expo-image-manipulator';

export interface User {
    id: number;
    nom: string;
    email?: string;
    telephone: string;
    ville?: string;
    quartier?: string;
    isBoutique: boolean;
    nomBoutique?: string;
    planActuel: string;
    profileImageUrl?: string;
    dateCreation?: string;
}

class UserService {
    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<User> {
        try {
            const response = await api.get('/users/me');
            return response.data.user || response.data;
        } catch (error: any) {
            console.error('Error fetching current user:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(data: {
        nom?: string;
        email?: string;
        ville?: string;
        quartier?: string;
    }): Promise<User> {
        try {
            const response = await api.put('/users/me', data);
            return response.data.user || response.data;
        } catch (error: any) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    /**
     * Upload profile image
     */
    async uploadProfileImage(imageUri: string): Promise<{ url: string }> {
        try {
            console.log('📸 Starting profile image upload:', imageUri);

            // 1. Compress image
            const compressedImage = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ resize: { width: 800 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );

            console.log('✅ Image compressed:', compressedImage.uri);

            // 2. Create filename and type
            const filename = compressedImage.uri.split('/').pop() || 'profile.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            console.log('📦 File details:', { filename, type });

            // 3. Create FormData
            const formData = new FormData();
            formData.append('file', {
                uri: compressedImage.uri,
                name: filename,
                type: type,
            } as any);

            console.log('📤 Uploading to /images/profile...');

            // 4. Upload with multipart/form-data
            const response = await api.post('/images/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                transformRequest: (data, headers) => {
                    // Let FormData handle it
                    return data;
                },
            });

            console.log('✅ Upload response:', response.data);

            // 5. Extract URL from response
            const imageUrl = response.data.url ||
                response.data.imageUrl ||
                response.data.profileImageUrl ||
                response.data.data?.url;

            if (!imageUrl) {
                console.error('❌ No URL in response:', response.data);
                throw new Error('No image URL returned from server');
            }

            console.log('✅ Final image URL:', imageUrl);

            return { url: imageUrl };

        } catch (error: any) {
            console.error('❌ Profile image upload error:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);

            if (error.response?.status === 403) {
                throw new Error('Non autorisé. Veuillez vous reconnecter.');
            }

            throw new Error(
                error.response?.data?.message ||
                error.message ||
                'Erreur lors du téléchargement de l\'image'
            );
        }
    }

    /**
     * Delete profile image
     */
    async deleteProfileImage(): Promise<void> {
        try {
            await api.delete('/images/profile');
            console.log('✅ Profile image deleted');
        } catch (error: any) {
            console.error('Error deleting profile image:', error);
            throw error;
        }
    }

    /**
     * Get user's listings
     */
    async getUserListings(userId: number): Promise<any[]> {
        try {
            const response = await api.get(`/users/${userId}/listings`);
            return response.data.listings || response.data;
        } catch (error: any) {
            console.error('Error fetching user listings:', error);
            return [];
        }
    }
}

export const userService = new UserService();