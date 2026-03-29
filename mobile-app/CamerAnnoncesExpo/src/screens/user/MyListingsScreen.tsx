// src/screens/user/MyListingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Alert,
    RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

interface Listing {
    id: number;
    titre: string;
    description: string;
    prix?: number;
    etatProduit: string;
    ville?: string;
    statut: string;
    dateCreation: string;
    mainImageUrl?: string;
    category?: {
        nom: string;
        emoji: string;
    };
}

const MyListingsScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadListings();
    }, []);

    const loadListings = async () => {
        try {
            console.log('📋 Loading my listings...');
            setLoading(true);

            // ✅ NEUER ENDPOINT: /listings/user/me
            const response = await api.get('/listings/user/me?page=0&size=100');

            const data = response.data.listings || response.data.content || response.data;
            console.log('✅ My listings loaded:', data.length);

            setListings(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error('❌ Error loading listings:', error);
            console.error('❌ Error response:', error.response?.data);
            Alert.alert('Erreur', 'Impossible de charger vos annonces');
            setListings([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadListings();
    };

    const handleEdit = (listingId: number) => {
        navigation.navigate('EditListing', { listingId });
    };

    const handleDelete = (listingId: number, titre: string) => {
        Alert.alert(
            'Supprimer l\'annonce',
            `Êtes-vous sûr de vouloir supprimer "${titre}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/listings/${listingId}`);
                            Alert.alert('Succès', 'Annonce supprimée');
                            loadListings();
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de supprimer l\'annonce');
                        }
                    }
                }
            ]
        );
    };

    const handleViewDetails = (listingId: number) => {
        navigation.navigate('ListingDetail', { listingId });
    };

    const formatPrice = (prix?: number) => {
        if (!prix) return 'Prix non spécifié';
        return `${prix.toLocaleString('fr-FR')} FCFA`;
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (statut: string) => {
        switch (statut?.toUpperCase()) {
            case 'ACTIVE':
                return '#00C851';
            case 'PENDING':
                return '#FFB800';
            case 'SOLD':
                return '#999';
            default:
                return '#0066CC';
        }
    };

    const getStatusLabel = (statut: string) => {
        switch (statut?.toUpperCase()) {
            case 'ACTIVE':
                return 'Active';
            case 'PENDING':
                return 'En attente';
            case 'SOLD':
                return 'Vendu';
            default:
                return statut;
        }
    };

    const renderListingItem = ({ item }: { item: Listing }) => (
        <TouchableOpacity
            style={styles.listingCard}
            onPress={() => handleViewDetails(item.id)}
            activeOpacity={0.7}
        >
            {/* Image */}
            <View style={styles.imageContainer}>
                {item.mainImageUrl ? (
                    <Image
                        source={{ uri: item.mainImageUrl }}
                        style={styles.listingImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Icon name="image" size={40} color="#ccc" />
                    </View>
                )}

                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statut) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(item.statut)}</Text>
                </View>

                {/* Category Badge */}
                {item.category && (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryEmoji}>{item.category.emoji}</Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.listingContent}>
                <View style={styles.listingHeader}>
                    <Text style={styles.listingTitle} numberOfLines={2}>
                        {item.titre}
                    </Text>
                    <Text style={styles.listingPrice}>{formatPrice(item.prix)}</Text>
                </View>

                <Text style={styles.listingDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.listingMeta}>
                    <View style={styles.metaItem}>
                        <Icon name="location-on" size={14} color="#666" />
                        <Text style={styles.metaText}>{item.ville || 'Non spécifié'}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Icon name="access-time" size={14} color="#666" />
                        <Text style={styles.metaText}>{formatDate(item.dateCreation)}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEdit(item.id)}
                    >
                        <Icon name="edit" size={18} color="#0066CC" />
                        <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id, item.titre)}
                    >
                        <Icon name="delete" size={18} color="#ff4444" />
                        <Text style={styles.deleteButtonText}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="list-alt" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Aucune annonce</Text>
            <Text style={styles.emptyText}>
                Vous n'avez pas encore publié d'annonces
            </Text>
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Publier' })}
            >
                <Icon name="add" size={20} color="#fff" />
                <Text style={styles.createButtonText}>
                    Publier ma première annonce
                </Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={listings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderListingItem}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={listings.length === 0 ? styles.emptyList : styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#0066CC']}
                    />
                }
                showsVerticalScrollIndicator={false}
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
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    listContent: {
        padding: 15,
    },
    listingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
        height: 180,
    },
    listingImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    categoryBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryEmoji: {
        fontSize: 20,
    },
    listingContent: {
        padding: 15,
    },
    listingHeader: {
        marginBottom: 8,
    },
    listingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    listingPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0066CC',
    },
    listingDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    listingMeta: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        marginRight: 8,
        backgroundColor: '#f0f7ff',
        borderRadius: 8,
    },
    editButtonText: {
        color: '#0066CC',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        marginLeft: 8,
        backgroundColor: '#fff5f5',
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#ff4444',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
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
        marginBottom: 30,
        lineHeight: 24,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0066CC',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default MyListingsScreen;