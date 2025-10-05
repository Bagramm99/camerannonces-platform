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
import { searchService } from '../../services/searchService';

const SearchScreen = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = useState(route?.params?.query || '');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Fonction de recherche RÉELLE
    const handleSearch = async (reset = true) => {
        if (!searchQuery.trim()) {
            setListings([]);
            setTotalElements(0);
            return;
        }

        setLoading(true);
        try {
            const currentPage = reset ? 0 : page;

            console.log('📱 Recherche mobile:', searchQuery, 'page:', currentPage);

            // APPEL RÉEL AU BACKEND
            const response = await searchService.searchByKeyword(
                searchQuery,
                currentPage,
                20
            );

            console.log('📦 Réponse reçue:', response);

            if (response.success) {
                if (reset) {
                    setListings(response.listings);
                    setPage(1);
                } else {
                    setListings(prev => [...prev, ...response.listings]);
                    setPage(prev => prev + 1);
                }

                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);

                console.log(`✅ ${response.totalElements} résultat(s) trouvé(s)`);
            } else {
                Alert.alert('Erreur', 'Impossible de rechercher');
            }
        } catch (error) {
            console.error('❌ Erreur recherche:', error);
            Alert.alert(
                'Erreur de connexion',
                'Impossible de se connecter au serveur. Vérifiez votre connexion.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Debounce pour éviter trop d'appels
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch(true);
            } else {
                setListings([]);
                setTotalElements(0);
            }
        }, 800); // 800ms de délai

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    const handleListingPress = (listing) => {
        navigation.navigate('ListingDetail', { listingId: listing.id });
    };

    const renderListingItem = ({ item }) => (
        <ListingCard
            listing={item}
            onPress={() => handleListingPress(item)}
        />
    );

    const renderEmpty = () => {
        if (loading) return null;

        return (
            <View style={styles.emptyContainer}>
                <Icon name="search-off" size={80} color="#ccc" />
                <Text style={styles.emptyTitle}>
                    {searchQuery ? 'Aucun résultat trouvé' : 'Rechercher des annonces'}
                </Text>
                <Text style={styles.emptyText}>
                    {searchQuery
                        ? `Aucune annonce trouvée pour "${searchQuery}"`
                        : 'Tapez ce que vous recherchez'
                    }
                </Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (!loading || page === 0) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#0066CC" />
            </View>
        );
    };

    const handleLoadMore = () => {
        if (!loading && page < totalPages) {
            handleSearch(false);
        }
    };

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
                        autoFocus={!route?.params?.query}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchQuery('');
                                setListings([]);
                                setTotalElements(0);
                            }}
                            style={styles.clearButton}
                        >
                            <Icon name="clear" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Compteur de résultats */}
                {totalElements > 0 && !loading && (
                    <Text style={styles.resultCount}>
                        {totalElements} résultat{totalElements > 1 ? 's' : ''} pour "{searchQuery}"
                    </Text>
                )}
            </View>

            {/* Résultats */}
            <FlatList
                data={listings}
                renderItem={renderListingItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={listings.length === 0 ? styles.emptyList : styles.listContent}
            />

            {/* Loading overlay (premier chargement uniquement) */}
            {loading && page === 0 && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0066CC" />
                    <Text style={styles.loadingText}>Recherche en cours...</Text>
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
    resultCount: {
        marginTop: 10,
        fontSize: 14,
        color: '#0066CC',
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 60,
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
        textAlign: 'center',
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
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default SearchScreen;