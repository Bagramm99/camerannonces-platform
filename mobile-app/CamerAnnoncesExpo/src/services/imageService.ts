// src/services/imageService.ts
import { api } from './api';
import * as FileSystem from 'expo-file-system';

interface ImageUploadResponse {
    success: boolean;
    message: string;
    imageUrl?: string;
    image?: any;
}

interface ListingImagesResponse {
    success: boolean;
    images: Array<{
        id: number;
        url: string;
        nomFichier: string;
        isPrincipale: boolean;
        ordreAffichage: number;
    }>;
}

class ImageService {
    /**
     * Upload image de profil
     */
    async uploadProfileImage(imageUri: string): Promise<ImageUploadResponse> {
        try {
            const formData = new FormData();

            // Créer l'objet file depuis l'URI
            const filename = imageUri.split('/').pop() || 'profile.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('file', {
                uri: imageUri,
                name: filename,
                type: type,
            } as any);

            const response = await api.post('/images/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error: any) {
            console.error('❌ Profile image upload error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors de l\'upload'
            );
        }
    }

    /**
     * Supprimer image de profil
     */
    async deleteProfileImage(): Promise<void> {
        try {
            await api.delete('/images/profile');
        } catch (error: any) {
            console.error('❌ Delete profile image error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors de la suppression'
            );
        }
    }

    /**
     * Upload image pour listing
     */
    async uploadListingImage(
        listingId: number,
        imageUri: string,
        isPrincipale: boolean = false
    ): Promise<ImageUploadResponse> {
        try {
            const formData = new FormData();

            const filename = imageUri.split('/').pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('file', {
                uri: imageUri,
                name: filename,
                type: type,
            } as any);

            formData.append('isPrincipale', isPrincipale.toString());

            const response = await api.post(
                `/images/listing/${listingId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('❌ Listing image upload error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors de l\'upload'
            );
        }
    }

    /**
     * Upload plusieurs images pour listing
     */
    async uploadMultipleListingImages(
        listingId: number,
        imageUris: string[],
        onProgress?: (current: number, total: number) => void
    ): Promise<{ successCount: number; errorCount: number }> {
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < imageUris.length; i++) {
            try {
                const isPrincipale = i === 0; // Première image = principale
                await this.uploadListingImage(listingId, imageUris[i], isPrincipale);
                successCount++;

                if (onProgress) {
                    onProgress(i + 1, imageUris.length);
                }
            } catch (error) {
                errorCount++;
                console.error(`❌ Error uploading image ${i + 1}:`, error);
            }
        }

        return { successCount, errorCount };
    }

    /**
     * Obtenir toutes les images d'un listing
     */
    async getListingImages(listingId: number): Promise<ListingImagesResponse> {
        try {
            const response = await api.get(`/images/listing/${listingId}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Get listing images error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors du chargement'
            );
        }
    }

    /**
     * Supprimer une image de listing
     */
    async deleteListingImage(imageId: number): Promise<void> {
        try {
            await api.delete(`/images/${imageId}`);
        } catch (error: any) {
            console.error('❌ Delete listing image error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors de la suppression'
            );
        }
    }

    /**
     * Définir une image comme principale
     */
    async setMainImage(imageId: number): Promise<void> {
        try {
            await api.post(`/images/${imageId}/set-main`);
        } catch (error: any) {
            console.error('❌ Set main image error:', error.response?.data);
            throw new Error(
                error.response?.data?.message || 'Erreur lors de la mise à jour'
            );
        }
    }

    /**
     * Compresser une image avant upload
     */
    async compressImage(uri: string, quality: number = 0.8): Promise<string> {
        try {
            const { ImageManipulator } = await import('expo-image-manipulator');

            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1200 } }], // Max 1200px width
                { compress: quality, format: 'jpeg' }
            );

            return manipResult.uri;
        } catch (error) {
            console.error('❌ Compression error:', error);
            return uri; // Return original if compression fails
        }
    }
}

export const imageService = new ImageService();