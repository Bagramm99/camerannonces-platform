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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

// Types
interface User {
    nom?: string;
    telephone?: string;
    ville?: string;
    planActuel?: 'GRATUIT' | 'PREMIUM';
}

interface ProfileScreenProps {
    navigation: NavigationProp<any>;
}

// Theme constants
const COLORS = {
    primary: '#0066CC',
    secondary: '#f8f9fa',
    white: '#fff',
    text: '#333',
    textLight: '#666',
    error: '#ff4444',
    border: '#f0f0f0',
    shadow: '#000',
} as const;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);

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
                            // Navigation wird automatisch durch AuthContext gehandhabt
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
                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                    accessibilityLabel="Chargement"
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header utilisateur */}
            <View style={styles.header}>
                <View
                    style={styles.avatar}
                    accessibilityLabel={`Avatar de ${user?.nom || 'l\'utilisateur'}`}
                >
                    <Text style={styles.avatarText}>
                        {user?.nom?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={styles.userName}>{user?.nom || 'Utilisateur'}</Text>
                {user?.telephone && (
                    <Text style={styles.userPhone}>{user.telephone}</Text>
                )}
                {user?.ville && (
                    <Text
                        style={styles.userLocation}
                        accessibilityLabel={`Localisation: ${user.ville}`}
                    >
                        📍 {user.ville}
                    </Text>
                )}
            </View>

            {/* Menu options */}
            <View style={styles.menuSection}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('MyListings')}
                    accessibilityLabel="Accéder à mes annonces"
                    accessibilityRole="button"
                >
                    <Icon name="list" size={24} color={COLORS.primary} />
                    <Text style={styles.menuText}>Mes annonces</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('EditProfile')}
                    accessibilityLabel="Modifier le profil"
                    accessibilityRole="button"
                >
                    <Icon name="person" size={24} color={COLORS.primary} />
                    <Text style={styles.menuText}>Modifier le profil</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('Notifications')}
                    accessibilityLabel="Voir les notifications"
                    accessibilityRole="button"
                >
                    <Icon name="notifications" size={24} color={COLORS.primary} />
                    <Text style={styles.menuText}>Notifications</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('Help')}
                    accessibilityLabel="Accéder à l'aide et au support"
                    accessibilityRole="button"
                >
                    <Icon name="help" size={24} color={COLORS.primary} />
                    <Text style={styles.menuText}>Aide & Support</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigateToScreen('Settings')}
                    accessibilityLabel="Accéder aux paramètres"
                    accessibilityRole="button"
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
                    <Text
                        style={styles.planName}
                        accessibilityLabel={`Plan actuel: ${user?.planActuel || 'GRATUIT'}`}
                    >
                        {user?.planActuel || 'GRATUIT'}
                    </Text>
                    <Text style={styles.planDescription}>
                        {user?.planActuel === 'PREMIUM' ? 'Annonces illimitées' : '3 annonces/mois'}
                    </Text>
                </View>
            </View>

            {/* Bouton déconnexion */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                accessibilityLabel="Se déconnecter de l'application"
                accessibilityRole="button"
            >
                <Icon name="logout" size={20} color={COLORS.white} />
                <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
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
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
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
        marginVertical: 12,
        marginBottom: 70,
        paddingVertical: 20,
        borderRadius: 10,
        minHeight: 48,
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
});

export default ProfileScreen;