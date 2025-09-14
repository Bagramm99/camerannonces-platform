// src/screens/main/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { categoryService } from '../../services/categoryService';
import { listingService } from '../../services/listingService';

const HomeScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [recentListings, setRecentListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [backendConnected, setBackendConnected] = useState(false);

    useEffect(() => {
        testBackendConnection();
    }, []);

    const testBackendConnection = async () => {
        try {
            console.log('🔄 Testing backend connection...');

            // Test connection aux catégories
            const categoriesData = await categoryService.getAllCategories();
            console.log('✅ Categories loaded from backend:', categoriesData);
            setCategories(categoriesData);
            setBackendConnected(true);

            // Test connection aux annonces
            const listingsData = await listingService.getRecentListings(5);
            console.log('✅ Listings loaded from backend:', listingsData);
            setRecentListings(listingsData);

        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            Alert.alert(
                'Erreur de connexion',
                'Impossible de se connecter au serveur backend. Vérifiez que le serveur Spring Boot est démarré.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={styles.loadingText}>Connexion au backend...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🇨🇲 CamerAnnonces</Text>
                <Text style={styles.connectionStatus}>
                    {backendConnected ? '✅ Backend connecté' : '❌ Backend déconnecté'}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Catégories du backend :</Text>
                {categories.map((category) => (
                    <View key={category.id} style={styles.categoryItem}>
                        <Text style={styles.categoryText}>
                            {category.emoji} {category.nom}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Annonces du backend :</Text>
                {recentListings.map((listing) => (
                    <View key={listing.id} style={styles.listingItem}>
                        <Text style={styles.listingTitle}>{listing.titre}</Text>
                        <Text style={styles.listingPrice}>
                            {listing.prix ? `${listing.prix.toLocaleString()} FCFA` : 'Prix non spécifié'}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: '#0066CC',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    connectionStatus: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
    },
    section: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    categoryItem: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    categoryText: {
        fontSize: 16,
    },
    listingItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    listingPrice: {
        fontSize: 14,
        color: '#0066CC',
        marginTop: 5,
    },
});

export default HomeScreen;