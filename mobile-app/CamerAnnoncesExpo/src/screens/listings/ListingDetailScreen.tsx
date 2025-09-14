// src/screens/listings/ListingDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WhatsAppButton from '../../components/common/WhatsAppButton';
import { formatPrice, formatDate, formatLocation } from '../../utils/formatters';

const { width } = Dimensions.get('window');

const ListingDetailScreen = ({ route, navigation }) => {
    const { listingId } = route.params;
    const [listing, setListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        loadListingDetails();
    }, [listingId, loadListingDetails]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadListingDetails = async () => {
        try {
            setLoading(true);

            // Mock data - remplace par ton service réel
            const mockListing = {
                id: listingId,
                titre: 'iPhone 13 Pro Max 256GB',
                description: 'iPhone 13 Pro Max en parfait état, 256GB, couleur bleu Sierra. Boîte complète avec chargeur et écouteurs. Aucune rayure. Toujours sous garantie Apple jusqu\'en décembre 2024. Raison de vente : upgrade vers iPhone 15.',
                prix: 450000,
                prix_negociable: true,
                etat_produit: 'TRES_BON',
                ville: 'Douala',
                quartier: 'Bonanjo',
                adresse_complete: 'Carrefour Bonanjo, près de la banque',
                telephone_contact: '237698123456',
                email_contact: 'jean.dupont@email.cm',
                date_creation: '2024-08-20T10:00:00Z',
                vues: 125,
                contacts_whatsapp: 15,
                is_premium: true,
                is_urgent: false,
                is_verified: true,
                livraison_sur_place: true,
                livraison_domicile: true,
                livraison_gare: false,
                paiement_cash: true,
                paiement_mobile_money: true,
                paiement_virement: false,
                user: {
                    nom: 'Jean Dupont',
                    telephone: '237698123456',
                    is_boutique: false,
                    date_creation: '2023-01-15T00:00:00Z'
                },
                category: {
                    id: 1,
                    nom: 'Téléphones & Accessoires',
                    emoji: '📱'
                },
                images: [
                    { id: 1, url: 'https://via.placeholder.com/400x300/0066CC/FFFFFF?text=iPhone+Front', is_principale: true },
                    { id: 2, url: 'https://via.placeholder.com/400x300/333333/FFFFFF?text=iPhone+Back', is_principale: false },
                    { id: 3, url: 'https://via.placeholder.com/400x300/666666/FFFFFF?text=iPhone+Box', is_principale: false },
                ]
            };

            setListing(mockListing);
        } catch (error) {
            console.error('Error loading listing:', error);
            Alert.alert('Erreur', 'Impossible de charger l\'annonce');
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppContact = () => {
        if (listing) {
            // Incrémenter le compteur de contacts (optionnel)
            // listingService.incrementWhatsAppContact(listing.id);
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Ajouter/retirer des favoris via service
    };

    const getConditionColor = (condition) => {
        const colors = {
            'NEUF': '#00C851',
            'TRES_BON': '#2E7D32',
            'BON': '#FF9800',
            'MOYEN': '#FF5722',
            'A_REPARER': '#F44336'
        };
        return colors[condition] || '#666';
    };

    const getConditionText = (condition) => {
        const texts = {
            'NEUF': 'Neuf',
            'TRES_BON': 'Très bon état',
            'BON': 'Bon état',
            'MOYEN': 'État moyen',
            'A_REPARER': 'À réparer'
        };
        return texts[condition] || condition;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    if (!listing) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="error-outline" size={80} color="#ccc" />
                <Text style={styles.errorText}>Annonce introuvable</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Images */}
                {listing.images && listing.images.length > 0 && (
                    <View style={styles.imageSection}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={(event) => {
                                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                                setCurrentImageIndex(index);
                            }}
                            scrollEventThrottle={16}
                        >
                            {listing.images.map((image, _index) => (
                                <Image
                                    key={image.id}
                                    source={{ uri: image.url }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            ))}
                        </ScrollView>

                        {/* Indicateur d'images */}
                        {listing.images.length > 1 && (
                            <View style={styles.imageIndicator}>
                                <Text style={styles.imageIndicatorText}>
                                    {currentImageIndex + 1} / {listing.images.length}
                                </Text>
                            </View>
                        )}

                        {/* Bouton favoris */}
                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={toggleFavorite}
                        >
                            <Icon
                                name={isFavorite ? 'favorite' : 'favorite-border'}
                                size={24}
                                color={isFavorite ? '#ff4444' : '#fff'}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Informations principales */}
                <View style={styles.mainInfo}>
                    {/* Badges */}
                    <View style={styles.badgesRow}>
                        {listing.is_premium && (
                            <View style={styles.premiumBadge}>
                                <Icon name="star" size={16} color="#FFD700" />
                                <Text style={styles.badgeText}>PREMIUM</Text>
                            </View>
                        )}
                        {listing.is_urgent && (
                            <View style={styles.urgentBadge}>
                                <Icon name="flash-on" size={16} color="#fff" />
                                <Text style={styles.badgeTextWhite}>URGENT</Text>
                            </View>
                        )}
                        {listing.is_verified && (
                            <View style={styles.verifiedBadge}>
                                <Icon name="verified" size={16} color="#fff" />
                                <Text style={styles.badgeTextWhite}>VÉRIFIÉ</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.title}>{listing.titre}</Text>

                    {/* Prix */}
                    <View style={styles.priceSection}>
                        {listing.prix ? (
                            <>
                                <Text style={styles.price}>
                                    {formatPrice(listing.prix)} FCFA
                                </Text>
                                {listing.prix_negociable && (
                                    <Text style={styles.negotiable}>Négociable</Text>
                                )}
                            </>
                        ) : (
                            <Text style={styles.priceOnRequest}>Prix sur demande</Text>
                        )}
                    </View>

                    {/* État et catégorie */}
                    <View style={styles.detailsRow}>
                        <View style={styles.conditionContainer}>
                            <View style={[
                                styles.conditionDot,
                                { backgroundColor: getConditionColor(listing.etat_produit) }
                            ]} />
                            <Text style={styles.conditionText}>
                                {getConditionText(listing.etat_produit)}
                            </Text>
                        </View>

                        <View style={styles.categoryContainer}>
                            <Text style={styles.categoryText}>
                                {listing.category.emoji} {listing.category.nom}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📝 Description</Text>
                    <Text style={styles.description}>{listing.description}</Text>
                </View>

                {/* Localisation */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📍 Localisation</Text>
                    <View style={styles.locationInfo}>
                        <Icon name="location-on" size={20} color="#666" />
                        <Text style={styles.locationText}>
                            {formatLocation(listing.ville, listing.quartier)}
                        </Text>
                    </View>
                    {listing.adresse_complete && (
                        <Text style={styles.addressText}>{listing.adresse_complete}</Text>
                    )}
                </View>

                {/* Options de livraison */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🚚 Livraison</Text>
                    <View style={styles.optionsGrid}>
                        {listing.livraison_sur_place && (
                            <View style={styles.optionItem}>
                                <Icon name="store" size={16} color="#00C851" />
                                <Text style={styles.optionText}>Sur place</Text>
                            </View>
                        )}
                        {listing.livraison_domicile && (
                            <View style={styles.optionItem}>
                                <Icon name="home" size={16} color="#00C851" />
                                <Text style={styles.optionText}>À domicile</Text>
                            </View>
                        )}
                        {listing.livraison_gare && (
                            <View style={styles.optionItem}>
                                <Icon name="directions-bus" size={16} color="#00C851" />
                                <Text style={styles.optionText}>En gare</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Options de paiement */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💳 Paiement</Text>
                    <View style={styles.optionsGrid}>
                        {listing.paiement_cash && (
                            <View style={styles.optionItem}>
                                <Icon name="payments" size={16} color="#00C851" />
                                <Text style={styles.optionText}>Espèces</Text>
                            </View>
                        )}
                        {listing.paiement_mobile_money && (
                            <View style={styles.optionItem}>
                                <Icon name="phone-android" size={16} color="#00C851" />
                                <Text style={styles.optionText}>Mobile Money</Text>
                            </View>
                        )}
                        {listing.paiement_virement && (
                            <View style={styles.optionItem}>
                                <Icon name="account-balance" size={16} color="#00C851" />
                                <Text style={styles.optionText}>Virement</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Informations vendeur */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👤 Vendeur</Text>
                    <View style={styles.sellerInfo}>
                        <View style={styles.sellerDetails}>
                            <Text style={styles.sellerName}>{listing.user.nom}</Text>
                            <Text style={styles.sellerType}>
                                {listing.user.is_boutique ? '🏪 Boutique' : '👤 Particulier'}
                            </Text>
                            <Text style={styles.memberSince}>
                                Membre depuis {formatDate(listing.user.date_creation)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Statistiques */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Statistiques</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Icon name="visibility" size={20} color="#666" />
                            <Text style={styles.statText}>{listing.vues} vues</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="message" size={20} color="#25D366" />
                            <Text style={styles.statText}>{listing.contacts_whatsapp} contacts</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="schedule" size={20} color="#666" />
                            <Text style={styles.statText}>Publié {formatDate(listing.date_creation)}</Text>
                        </View>
                    </View>
                </View>

                {/* Espace pour le bouton flottant */}
                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Bouton contact flottant */}
            <View style={styles.contactSection}>
                <WhatsAppButton
                    phoneNumber={listing.telephone_contact}
                    listingTitle={listing.titre}
                    onPress={handleWhatsAppContact}
                    style={styles.whatsappButton}
                />
            </View>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 30,
    },
    backButton: {
        backgroundColor: '#0066CC',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    imageSection: {
        position: 'relative',
    },
    image: {
        width: width,
        height: 300,
    },
    imageIndicator: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    imageIndicatorText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
    },
    mainInfo: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    badgesRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    premiumBadge: {
        backgroundColor: '#FFD700',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    urgentBadge: {
        backgroundColor: '#ff4444',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    verifiedBadge: {
        backgroundColor: '#00C851',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 4,
    },
    badgeTextWhite: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        lineHeight: 30,
    },
    priceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0066CC',
    },
    negotiable: {
        fontSize: 14,
        color: '#00C851',
        marginLeft: 10,
        fontWeight: '600',
    },
    priceOnRequest: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
        fontStyle: 'italic',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    conditionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    conditionDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    conditionText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    categoryContainer: {
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    categoryText: {
        fontSize: 12,
        color: '#0066CC',
        fontWeight: '600',
    },
    section: {
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
        fontWeight: '600',
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 28,
        lineHeight: 20,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 8,
    },
    optionText: {
        fontSize: 14,
        color: '#0066CC',
        marginLeft: 6,
        fontWeight: '600',
    },
    sellerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerDetails: {
        flex: 1,
    },
    sellerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    sellerType: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 12,
        color: '#999',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    contactSection: {
        backgroundColor: '#fff',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    whatsappButton: {
        paddingVertical: 15,
    },
    bottomSpacing: {
        height: 20,
    },
});

export default ListingDetailScreen;