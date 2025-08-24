// src/screens/user/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
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
import { authService } from '../../services/authService';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        await authService.logout();
                        navigation.replace('Auth');
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header utilisateur */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.nom?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={styles.userName}>{user?.nom || 'Utilisateur'}</Text>
                <Text style={styles.userPhone}>{user?.telephone}</Text>
                {user?.ville && (
                    <Text style={styles.userLocation}>📍 {user.ville}</Text>
                )}
            </View>

            {/* Menu options */}
            <View style={styles.menuSection}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('MyListings')}
                >
                    <Icon name="list" size={24} color="#0066CC" />
                    <Text style={styles.menuText}>Mes annonces</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Icon name="person" size={24} color="#0066CC" />
                    <Text style={styles.menuText}>Modifier le profil</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Icon name="notifications" size={24} color="#0066CC" />
                    <Text style={styles.menuText}>Notifications</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Icon name="help" size={24} color="#0066CC" />
                    <Text style={styles.menuText}>Aide & Support</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Icon name="settings" size={24} color="#0066CC" />
                    <Text style={styles.menuText}>Paramètres</Text>
                    <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>

            {/* Plan actuel */}
            <View style={styles.planSection}>
                <Text style={styles.planTitle}>Plan actuel</Text>
                <View style={styles.planCard}>
                    <Text style={styles.planName}>{user?.plan_actuel || 'GRATUIT'}</Text>
                    <Text style={styles.planDescription}>
                        {user?.plan_actuel === 'GRATUIT' ? '3 annonces/mois' : 'Plan premium'}
                    </Text>
                </View>
            </View>

            {/* Bouton déconnexion */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Icon name="logout" size={20} color="#fff" />
                <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#0066CC',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0066CC',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    userPhone: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 5,
    },
    userLocation: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.8,
    },
    menuSection: {
        backgroundColor: '#fff',
        marginTop: 20,
        marginHorizontal: 15,
        borderRadius: 10,
        shadowColor: '#000',
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
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    planSection: {
        margin: 15,
        marginTop: 30,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    planCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 5,
    },
    planDescription: {
        fontSize: 14,
        color: '#666',
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default ProfileScreen;