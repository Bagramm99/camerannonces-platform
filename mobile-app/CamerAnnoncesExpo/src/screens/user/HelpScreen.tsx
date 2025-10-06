// src/screens/user/HelpScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HelpScreen = () => {
    const openWhatsApp = () => {
        Linking.openURL('https://wa.me/237XXXXXXXXX');
    };

    const openEmail = () => {
        Linking.openURL('mailto:support@camerannonces.cm');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Comment puis-je vous aider ?</Text>

                <TouchableOpacity style={styles.helpItem} onPress={openWhatsApp}>
                    <Icon name="chat" size={24} color="#25D366" />
                    <View style={styles.helpContent}>
                        <Text style={styles.helpTitle}>WhatsApp</Text>
                        <Text style={styles.helpText}>Contactez-nous via WhatsApp</Text>
                    </View>
                    <Icon name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.helpItem} onPress={openEmail}>
                    <Icon name="email" size={24} color="#0066CC" />
                    <View style={styles.helpContent}>
                        <Text style={styles.helpTitle}>Email</Text>
                        <Text style={styles.helpText}>support@camerannonces.cm</Text>
                    </View>
                    <Icon name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Questions fréquentes</Text>

                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Comment publier une annonce ?</Text>
                    <Text style={styles.faqAnswer}>
                        Cliquez sur le bouton "Publier" en bas de l'écran, remplissez le formulaire avec les détails de votre annonce et validez.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Comment contacter un vendeur ?</Text>
                    <Text style={styles.faqAnswer}>
                        Sur chaque annonce, vous trouverez un bouton WhatsApp pour contacter directement le vendeur.
                    </Text>
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
    section: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    helpItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    helpContent: {
        flex: 1,
        marginLeft: 15,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    helpText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginTop: 10,
    },
    faqItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

export default HelpScreen;