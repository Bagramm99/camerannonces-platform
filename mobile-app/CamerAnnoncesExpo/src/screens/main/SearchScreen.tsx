// src/screens/main/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ListingCard from '../../components/listings/ListingCard';

const SearchScreen = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = useState(route?.params?.query || '');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [_page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handleSearch = React.useCallback(async (reset = true) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            // Simuler une recherche (remplace par ton service réel)
            const mockResults = [
                {
                    id: 1,
                    titre: 'iPhone 13 Pro Max',
                    description: 'Excellent état, boîte complète',
                    prix: 450000,
                    prix_negociable: true,
                    etat_produit: 'TRES_BON',
                    ville: 'Douala',
                    quartier: 'Bonanjo',
                    date_creation: new Date().toISOString(),
                    is_premium: true,
                    is_urgent: false,
                    vues: 125,
                    images: [],
                    category: { emoji: '📱', nom: 'Téléphones' }
                }
            ];

            if (reset) {
                setListings(mockResults);
                setPage(2);
            } else {
                setListings(prev => [...prev, ...mockResults]);
                setPage(prev => prev + 1);
            }

            setHasMore(mockResults.length === 10);
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert('Erreur', 'Impossible de rechercher');
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery.trim()) {
            handleSearch();
        }
    }, [handleSearch, searchQuery]);

    const handleListingPress = (listing) => {
        navigation.navigate('ListingDetail', { listingId: listing.id });
    };

    const renderListingItem = ({ item }) => (
        <ListingCard
            listing={item}
            onPress={() => handleListingPress(item)}
        />
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="search-off" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>
                {searchQuery ? 'Aucun résultat' : 'Rechercher des annonces'}
            </Text>
            <Text style={styles.emptyText}>
                {searchQuery
                    ? 'Essayez avec d\'autres mots-clés'
                    : 'Tapez ce que vous recherchez'
                }
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Icon name="search" size={24} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Que recherchez-vous ?"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={() => handleSearch(true)}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            style={styles.clearButton}
                        >
                            <Icon name="clear" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => handleSearch(true)}
                >
                    <Text style={styles.searchButtonText}>Rechercher</Text>
                </TouchableOpacity>
            </View>

            {/* Résultats */}
            <FlatList
                data={listings}
                renderItem={renderListingItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={renderEmpty}
                onEndReached={() => hasMore && !loading && handleSearch(false)}
                onEndReachedThreshold={0.1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={listings.length === 0 ? styles.emptyList : undefined}
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0066CC" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    searchContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        padding: 5,
    },
    searchButton: {
        backgroundColor: '#0066CC',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyList: {
        flexGrow: 1,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchScreen;