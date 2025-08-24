// App.tsx - Version corrigée avec couleurs visibles
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🇨🇲 CamerAnnonces</Text>
            <Text style={styles.subtitle}>App mobile fonctionne parfaitement !</Text>
            <Text style={styles.success}>✅ Connexion réussie</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0066CC', // Bleu CamerAnnonces
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF', // Blanc
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#FFFFFF', // Blanc
        marginBottom: 20,
        textAlign: 'center',
    },
    success: {
        fontSize: 16,
        color: '#00FF00', // Vert vif
        fontWeight: 'bold',
    },
});