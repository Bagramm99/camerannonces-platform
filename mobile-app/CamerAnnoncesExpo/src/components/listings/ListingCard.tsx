// src/components/listings/ListingCard.tsx
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatPrice, formatDate, formatLocation } from '../../utils/formatters';

interface ListingImage {
    url: string;
    is_principale: boolean;
}

interface ListingCardProps {
    listing: {
        id: number;
        titre: string;
        description: string;
        prix?: number;
        prixNegociable?: boolean;
        prix_negociable?: boolean;
        etatProduit?: string;
        etat_produit?: string;
        ville?: string;
        quartier?: string;
        dateCreation?: string;
        date_creation?: string;
        isPremium?: boolean;
        is_premium?: boolean;
        isUrgent?: boolean;
        is_urgent?: boolean;
        vues: number;
        mainImageUrl?: string; // ✅ NEUE Property vom Backend
        images?: ListingImage[];
        category?: {
            emoji: string;
            nom: string;
        };
    };
    onPress: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress }) => {

    // ✅ NEUE Logik: mainImageUrl oder images nutzen
    const getMainImageUrl = (): string | undefined => {
        // 1. Zuerst mainImageUrl vom Backend nutzen (für Listen)
        if (listing.mainImageUrl) {
            return listing.mainImageUrl;
        }
        // 2. Fallback: images array nutzen (für Detail-Views)
        if (listing.images && listing.images.length > 0) {
            const mainImage = listing.images.find(img => img.is_principale);
            return mainImage ? mainImage.url : listing.images[0].url;
        }
        return undefined;
    };

    const mainImageUrl = getMainImageUrl();

    // ✅ Kompatibilität für beide Namenskonventionen
    const prixNegociable = listing.prixNegociable ?? listing.prix_negociable ?? false;
    const etatProduit = listing.etatProduit ?? listing.etat_produit ?? 'BON';
    const dateCreation = listing.dateCreation ?? listing.date_creation ?? '';
    const isPremium = listing.isPremium ?? listing.is_premium ?? false;
    const isUrgent = listing.isUrgent ?? listing.is_urgent ?? false;

    const getConditionColor = (condition: string): string => {
        switch (condition) {
            case 'NEUF': return '#00C851';
            case 'TRES_BON': return '#2E7D32';
            case 'BON': return '#FF9800';
            case 'MOYEN': return '#FF5722';
            case 'A_REPARER': return '#F44336';
            default: return '#666';
        }
    };

    const getConditionText = (condition: string): string => {
        switch (condition) {
            case 'NEUF': return 'Neuf';
            case 'TRES_BON': return 'Très bon';
            case 'BON': return 'Bon';
            case 'MOYEN': return 'Moyen';
            case 'A_REPARER': return 'À réparer';
            default: return condition;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.card, isPremium && styles.premiumCard]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.badgesContainer}>
                {isPremium && (
                    <View style={styles.premiumBadge}>
                        <Icon name="star" size={12} color="#FFD700" />
                        <Text style={styles.premiumText}>PREMIUM</Text>
                    </View>
                )}
                {isUrgent && (
                    <View style={styles.urgentBadge}>
                        <Icon name="flash-on" size={12} color="#fff" />
                        <Text style={styles.urgentText}>URGENT</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    {mainImageUrl ? (
                        <Image
                            source={{ uri: mainImageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.noImage}>
                            <Icon name="image" size={40} color="#ccc" />
                        </View>
                    )}
                    {listing.category && (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>
                                {listing.category.emoji} {listing.category.nom}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>
                        {listing.titre}
                    </Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {listing.description}
                    </Text>

                    <View style={styles.priceContainer}>
                        {listing.prix ? (
                            <>
                                <Text style={styles.price}>
                                    {formatPrice(listing.prix)} FCFA
                                </Text>
                                {prixNegociable && (
                                    <Text style={styles.negotiable}>Négociable</Text>
                                )}
                            </>
                        ) : (
                            <Text style={styles.priceOnRequest}>Prix sur demande</Text>
                        )}
                    </View>

                    <View style={styles.detailsRow}>
                        <View style={styles.conditionContainer}>
                            <View style={[
                                styles.conditionDot,
                                { backgroundColor: getConditionColor(etatProduit) }
                            ]} />
                            <Text style={styles.conditionText}>
                                {getConditionText(etatProduit)}
                            </Text>
                        </View>
                        {(listing.ville || listing.quartier) && (
                            <View style={styles.locationContainer}>
                                <Icon name="location-on" size={14} color="#666" />
                                <Text style={styles.locationText}>
                                    {formatLocation(listing.ville, listing.quartier)}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.statsContainer}>
                            <Icon name="visibility" size={14} color="#666" />
                            <Text style={styles.statsText}>{listing.vues}</Text>
                        </View>
                        <Text style={styles.dateText}>
                            {formatDate(dateCreation)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    premiumCard: {
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    badgesContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        flexDirection: 'row',
    },
    premiumBadge: {
        backgroundColor: 'rgba(255, 215, 0, 0.9)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 5,
    },
    premiumText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 2,
    },
    urgentBadge: {
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    urgentText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 2,
    },
    content: { flexDirection: 'row' },
    imageContainer: { width: 120, height: 120, position: 'relative' },
    image: { width: '100%', height: '100%' },
    noImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    categoryText: { fontSize: 10, color: '#fff', fontWeight: '600' },
    info: { flex: 1, padding: 15 },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
        lineHeight: 20,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        lineHeight: 18,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    price: { fontSize: 18, fontWeight: 'bold', color: '#0066CC' },
    negotiable: {
        fontSize: 12,
        color: '#00C851',
        marginLeft: 8,
        fontWeight: '600',
    },
    priceOnRequest: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        fontStyle: 'italic',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    conditionContainer: { flexDirection: 'row', alignItems: 'center' },
    conditionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 5,
    },
    conditionText: { fontSize: 12, color: '#666' },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },
    locationText: { fontSize: 12, color: '#666', marginLeft: 2 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statsContainer: { flexDirection: 'row', alignItems: 'center' },
    statsText: { fontSize: 12, color: '#666', marginLeft: 2 },
    dateText: { fontSize: 12, color: '#999' },
});

export default ListingCard;