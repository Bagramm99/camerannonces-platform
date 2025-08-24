// src/screens/main/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    RefreshControl,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CategoryCard from '../../components/common/CategoryCard';
import ListingCard from '../../components/listings/ListingCard';
import { categoryService } from '../../services/categoryService';
import { listingService } from '../../services/listingService';

const HomeScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [recentListings, setRecentListings] = useState([]);
    const [_loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [categoriesData, listingsData] = await Promise.all([
                categoryService.getAllCategories(),
                listingService.getRecentListings(6) // 6 annonces récentes
            ]);

            setCategories(categoriesData);
            setRecentListings(listingsData);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de charger les données');
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            navigation.navigate('Recherche', { query: searchText });
        }
    };

    const handleCategoryPress = (category) => {
        navigation.navigate('CategoryScreen', {
            categoryId: category.id,
            categoryName: category.nom,
            categoryEmoji: category.emoji
        });
    };

    const handleListingPress = (listing) => {
        navigation.navigate('ListingDetail', { listingId: listing.id });
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header avec recherche */}
            <View style={styles.header}>
                <Text style={styles.welcomeText}>
                    Bienvenue sur CamerAnnonces 🇨🇲
                </Text>
                <Text style={styles.subText}>
                    Trouvez tout ce que vous cherchez au Cameroun
                </Text>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Que recherchez-vous ?"
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearch}
                    >
                        <Icon name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Catégories */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📂 Toutes les catégories</Text>
                <View style={styles.categoriesGrid}>
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onPress={() => handleCategoryPress(category)}
                        />
                    ))}
                </View>
            </View>

            {/* Annonces récentes */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>🆕 Annonces récentes</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Recherche')}
                    >
                        <Text style={styles.seeAllText}>Voir tout</Text>
                    </TouchableOpacity>
                </View>

                {recentListings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        listing={listing}
                        onPress={() => handleListingPress(listing)}
                    />
                ))}
            </View>

            {/* Section informative */}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>💡 Pourquoi CamerAnnonces ?</Text>
                <View style={styles.featureItem}>
                    <Icon name="verified" size={20} color="#00C851" />
                    <Text style={styles.featureText}>Annonces vérifiées</Text>
                </View>
                <View style={styles.featureItem}>
                    <Icon name="phone" size={20} color="#00C851" />
                    <Text style={styles.featureText}>Contact direct WhatsApp</Text>
                </View>
                <View style={styles.featureItem}>
                    <Icon name="location-on" size={20} color="#00C851" />
                    <Text style={styles.featureText}>Géolocalisation Cameroun</Text>
                </View>
                <View style={styles.featureItem}>
                    <Icon name="security" size={20} color="#00C851" />
                    <Text style={styles.featureText}>Transactions sécurisées</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#0066CC',
        padding: 20,
        paddingTop: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    subText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.9,
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: '#0066CC',
        padding: 8,
        borderRadius: 20,
        marginLeft: 5,
    },
    section: {
        padding: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAllText: {
        color: '#0066CC',
        fontSize: 16,
        fontWeight: '600',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    infoSection: {
        backgroundColor: '#fff',
        margin: 15,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#555',
    },
});

export default HomeScreen;