// src/screens/listings/CategoryScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ListingCard from '../../components/listings/ListingCard';
import FilterModal from '../../components/listings/FilterModal';
import { listingService } from '../../services/listingService';

const CategoryScreen = ({ route, navigation }) => {
    const { categoryId, categoryName, categoryEmoji } = route.params;

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sortBy, setSortBy] = useState('date');
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadListings(true);
    }, [categoryId, sortBy, filters]);

    const loadListings = async (reset = false) => {
        try {
            if (reset) {
                setLoading(true);
                setPage(1);
            } else {
                setLoadingMore(true);
            }

            const currentPage = reset ? 1 : page;
            const response = await listingService.getListingsByCategory(
                categoryId,
                currentPage,
                10,
                sortBy,
                filters
            );

            if (reset) {
                setListings(response.data);
            } else {
                setListings(prev => [...prev, ...response.data]);
            }

            setHasMore(response.data.length === 10);
            setPage(currentPage + 1);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de charger les annonces');
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadListings(true);
    };

    const loadMore = () => {
        if (hasMore && !loadingMore) {
            loadListings(false);
        }
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
    };

    const handleFiltersApply = (newFilters) => {
        setFilters(newFilters);
        setShowFilters(false);
    };

    const handleListingPress = (listing) => {
        navigation.navigate('ListingDetail', { listingId: listing.id });
    };

    const renderSortButton = (sortType, label) => (
        <TouchableOpacity
            style={[
                styles.sortButton,
                sortBy === sortType && styles.sortButtonActive
            ]}
            onPress={() => handleSortChange(sortType)}
        >
            <Text style={[
                styles.sortButtonText,
                sortBy === sortType && styles.sortButtonTextActive
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderListingItem = ({ item }) => (
        <ListingCard
            listing={item}
            onPress={() => handleListingPress(item)}
        />
    );

    const renderHeader = () => (
        <View>
            {/* Header avec stats */}
            <View style={styles.headerStats}>
                <Text style={styles.categoryTitle}>
                    {categoryEmoji} {categoryName}
                </Text>
                <Text style={styles.statsText}>
                    {listings.length} annonce{listings.length > 1 ? 's' : ''} trouvée{listings.length > 1 ? 's' : ''}
                </Text>
            </View>

            {/* Boutons de tri */}
            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Trier par :</Text>
                <View style={styles.sortButtons}>
                    {renderSortButton('date', 'Plus récent')}
                    {renderSortButton('prix_asc', 'Prix ↑')}
                    {renderSortButton('prix_desc', 'Prix ↓')}
                    {renderSortButton('popularite', 'Populaire')}
                </View>
            </View>

            {/* Bouton filtres */}
            <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(true)}
            >
                <Icon name="tune" size={20} color="#0066CC" />
                <Text style={styles.filterButtonText}>Filtres</Text>
                {Object.keys(filters).length > 0 && (
                    <View style={styles.filterBadge}>
                        <Text style={styles.filterBadgeText}>
                            {Object.keys(filters).length}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color="#0066CC" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="search-off" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Aucune annonce trouvée</Text>
            <Text style={styles.emptyText}>
                Il n'y a pas encore d'annonces dans cette catégorie.
            </Text>
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('Publier')}
            >
                <Text style={styles.createButtonText}>
                    Publier la première annonce
                </Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={styles.loadingText}>Chargement des annonces...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={listings}
                renderItem={renderListingItem}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                showsVerticalScrollIndicator={false}
            />

            <FilterModal
                visible={showFilters}
                categoryId={categoryId}
                currentFilters={filters}
                onApply={handleFiltersApply}
                onClose={() => setShowFilters(false)}
            />
        </View>
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
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    headerStats: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    categoryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statsText: {
        fontSize: 16,
        color: '#666',
    },
    sortContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sortLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    sortButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    sortButtonActive: {
        backgroundColor: '#0066CC',
        borderColor: '#0066CC',
    },
    sortButtonText: {
        fontSize: 14,
        color: '#666',
    },
    sortButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 15,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    filterButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#0066CC',
        fontWeight: '600',
    },
    filterBadge: {
        backgroundColor: '#ff4444',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    filterBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    loadingMore: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
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
        marginBottom: 30,
        lineHeight: 24,
    },
    createButton: {
        backgroundColor: '#0066CC',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CategoryScreen;