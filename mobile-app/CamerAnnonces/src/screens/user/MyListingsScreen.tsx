// src/screens/user/MyListingsScreen.tsx
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

const MyListingsScreen = ({ navigation }) => {
    const [listings] = useState([]);
    const [loading] = useState(false);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="list-alt" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Aucune annonce</Text>
            <Text style={styles.emptyText}>
                Vous n'avez pas encore publié d'annonces
            </Text>
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('Publier')}
            >
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
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={listings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={() => null}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={listings.length === 0 ? styles.emptyList : undefined}
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

export default MyListingsScreen;
