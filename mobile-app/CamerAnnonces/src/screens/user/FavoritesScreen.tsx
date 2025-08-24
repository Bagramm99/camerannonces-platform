// src/screens/user/FavoritesScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FavoritesScreen = ({ navigation }) => {
    const [favorites] = useState([]);
    const [loading] = useState(false);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="favorite-border" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Aucun favori</Text>
            <Text style={styles.emptyText}>
                Vos annonces favorites apparaîtront ici
            </Text>
            <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('Accueil')}
            >
                <Text style={styles.browseButtonText}>
                    Parcourir les annonces
                </Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id.toString()}
                renderItem={() => null}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={favorites.length === 0 ? styles.emptyList : undefined}
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
    browseButton: {
        backgroundColor: '#0066CC',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FavoritesScreen;
