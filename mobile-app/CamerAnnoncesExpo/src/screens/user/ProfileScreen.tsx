// src/screens/user/ProfileScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id?: number;
    nom?: string;
    email?: string;
    telephone?: string;
    ville?: string;
    quartier?: string;
    planActuel?: 'GRATUIT' | 'BASIC' | 'PRO' | 'BOUTIQUE';
    profileImageUrl?: string;
    isBoutique?: boolean;
}

interface ProfileScreenProps {
    navigation: NavigationProp<any>;
}

const COLORS = {
    primary: '#0066CC',
    secondary: '#f8f9fa',
    white: '#fff',
    text: '#333',
    textLight: '#666',
    error: '#ff4444',
    border: '#f0f0f0',
    shadow: '#000',
    success: '#00C851',
} as const;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const { user: authUser, logout } = useAuth();
    const [user, setUser] = useState<User | null>(authUser);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Load fresh user data on mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            // ✅ FIXED: Use AuthContext user directly (no API call needed)
            setUser(authUser);
        } catch (error) {
            console.error('Error loading user data:', error);
            setUser(authUser);
        } finally {
            setLoading(false);
        }
    };

    const handlePickImage = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission requise',
                    'Nous avons besoin de votre permission pour accéder à la galerie.'
                );
                return;
            }

            // Show options: Gallery or Camera
            Alert.alert(
                'Choisir une photo',
                'Sélectionnez une source',
                [
                    {
                        text: 'Galerie',
                        onPress: () => pickImageFromGallery(),
                    },
                    {
                        text: 'Appareil photo',
                        onPress: () => pickImageFromCamera(),
                    },
                    {
                        text: 'Annuler',
                        style: 'cancel',
                    },
                ]
            );
        } catch (error) {
            console.error('Error requesting permissions:', error);
        }
    };

    const pickImageFromGallery = async () => {
        try {
            console.log('📱 Opening gallery...');

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,  // ✅ GEÄNDERT: false
                quality: 0.8,
            });

            console.log('📸 Gallery result:', JSON.stringify(result, null, 2));

            if (!result.canceled && result.assets && result.assets[0]) {
                console.log('✅ Image selected:', result.assets[0].uri);
                await uploadProfileImage(result.assets[0].uri);
            } else {
                console.log('❌ Image selection cancelled or no assets');
            }
        } catch (error) {
            console.error('❌ Error picking image from gallery:', error);
            Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
        }
    };

    const pickImageFromCamera = async () => {
        try {
            console.log('📷 Requesting camera permission...');

            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                console.log('❌ Camera permission denied');
                Alert.alert(
                    'Permission requise',
                    'Nous avons besoin de votre permission pour accéder à l\'appareil photo.'
                );
                return;
            }

            console.log('✅ Camera permission granted, opening camera...');

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,  // ✅ GEÄNDERT: false
                quality: 0.8,
            });

            console.log('📸 Camera result:', JSON.stringify(result, null, 2));

            if (!result.canceled && result.assets && result.assets[0]) {
                console.log('✅ Photo captured:', result.assets[0].uri);
                await uploadProfileImage(result.assets[0].uri);
            } else {
                console.log('❌ Photo capture cancelled or no assets');
            }
        } catch (error) {
            console.error('❌ Error picking image from camera:', error);
            Alert.alert('Erreur', 'Impossible de prendre la photo');
        }
    };

    const uploadProfileImage = async (imageUri: string) => {
        try {
            setUploadingImage(true);
            console.log('📤 Starting upload for:', imageUri);

            const result = await userService.uploadProfileImage(imageUri);

            console.log('✅ Upload complete! URL:', result.url);

            // Update local state
            setUser(prev => prev ? { ...prev, profileImageUrl: result.url } : null);

            // Update AsyncStorage
            const updatedUser = { ...user, profileImageUrl: result.url };
            await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));

            console.log('✅ AsyncStorage updated');

            Alert.alert('Succès', 'Photo de profil mise à jour !');
        } catch (error: any) {
            console.error('❌ Upload error:', error);
            console.error('❌ Error message:', error.message);
            Alert.alert(
                'Erreur',
                error.message || 'Impossible de télécharger l\'image'
            );
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDeleteProfileImage = async () => {
        Alert.alert(
            'Supprimer la photo',
            'Êtes-vous sûr de vouloir supprimer votre photo de profil ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setUploadingImage(true);
                            console.log('🗑️ Deleting profile image...');

                            await userService.deleteProfileImage();

                            // Update local state
                            setUser(prev => prev ? { ...prev, profileImageUrl: undefined } : null);

                            // Update AsyncStorage
                            const updatedUser = { ...user, profileImageUrl: undefined };
                            await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));

                            console.log('✅ Profile image deleted');
                            Alert.alert('Succès', 'Photo de profil supprimée');
                        } catch (error) {
                            console.error('❌ Error deleting image:', error);
                            Alert.alert('Erreur', 'Impossible de supprimer la photo');
                        } finally {
                            setUploadingImage(false);
                        }
                    }
                }
            ]
        );
    };

    const handleLogout = useCallback(() => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await logout();
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert(
                                'Erreur',
                                'Une erreur est survenue lors de la déconnexion.'
                            );
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    }, [logout]);

    const navigateToScreen = useCallback((screenName: string) => {
        try {
            navigation.navigate(screenName as never);
        } catch (error) {
            console.error(`Navigation error to ${screenName}:`, error);
            Alert.alert(
                'Erreur de navigation',
                'Cette fonctionnalité sera bientôt disponible.'
            );
        }
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header avec photo de profil */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    {user?.profileImageUrl ? (
                        <Image
                            source={{ uri: user.profileImageUrl }}
                            style={styles.avatarImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.nom?.charAt(0).toUpperCase() || 'U'}
                            </Text>
                        </View>
                    )}

                    {/* Upload/Edit Button */}
                    <TouchableOpacity
                        style={styles.editAvatarButton}
                        onPress={handlePickImage}
                        disabled={uploadingImage}
                    >
                        {uploadingImage ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <Icon name="camera-alt" size={20} color={COLORS.white} />
                        )}
                    </TouchableOpacity>

                    {/* Delete Button (only if image exists) */}
                    {user?.profileImageUrl && !uploadingImage && (
                        <TouchableOpacity
                            style={styles.deleteAvatarButton}
                            onPress={handleDeleteProfileImage}
                        >
                            <Icon name="delete" size={18} color={COLORS.white} />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.userName}>{user?.nom || 'Utilisateur'}</Text>
                {user?.telephone && (
                    <Text style={styles.userPhone}>{user.telephone}</Text>
                )}
                {user?.ville && (
                    <Text style={styles.userLocation}>📍 {user.ville}</Text>
                )}
            </View>

            {/* Menu options */}
            <View style={styles.menuSection}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('MyListings')}
                >
                    <Icon name="list" size={24} color={COLORS.primary} />
                    <Text style={styles.menuText}>Mes annonces</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('EditProfile')}
                >
                    <Icon name="person" size={24} color={COLORS.primary} />
                    <Text style={styles.menuText}>Modifier le profil</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('Notifications')}
                >
                    <Icon name="notifications" size={24} color={COLORS.primary} />
                    <Text style={styles.menuText}>Notifications</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('Help')}
                >
                    <Icon name="help" size={24} color={COLORS.primary} />
                    <Text style={styles.menuText}>Aide & Support</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('Settings')}
                >
                    <Icon name="settings" size={24} color={COLORS.primary} />
                    <Text style={styles.menuText}>Paramètres</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>

            {/* Plan actuel */}
            <View style={styles.planSection}>
                <Text style={styles.planTitle}>Plan actuel</Text>
                <View style={styles.planCard}>
                    <Text style={styles.planName}>
                        {user?.planActuel || 'GRATUIT'}
                    </Text>
                    <Text style={styles.planDescription}>
                        {user?.planActuel === 'PRO' || user?.planActuel === 'BOUTIQUE'
                            ? 'Annonces illimitées'
                            : user?.planActuel === 'BASIC'
                                ? '15 annonces/mois'
                                : '5 annonces/mois'}
                    </Text>
                </View>
            </View>

            {/* Bouton déconnexion */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Icon name="logout" size={20} color={COLORS.white} />
                <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
    },
    header: {
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    deleteAvatarButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: COLORS.error,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 5,
        textAlign: 'center',
    },
    userPhone: {
        fontSize: 16,
        color: COLORS.white,
        opacity: 0.9,
        marginBottom: 5,
    },
    userLocation: {
        fontSize: 14,
        color: COLORS.white,
        opacity: 0.8,
    },
    menuSection: {
        backgroundColor: COLORS.white,
        marginTop: 20,
        marginHorizontal: 15,
        borderRadius: 10,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        minHeight: 56,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 15,
        fontWeight: '500',
    },
    planSection: {
        margin: 15,
        marginTop: 30,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    planCard: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 10,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 5,
    },
    planDescription: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: COLORS.error,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 20,
        paddingVertical: 15,
        borderRadius: 10,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    logoutText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    bottomSpacing: {
        height: 80,
    },
});

export default ProfileScreen;