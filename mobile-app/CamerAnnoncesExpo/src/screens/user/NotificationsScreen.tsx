// src/screens/user/NotificationsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationsScreen = () => {
    const notifications = [
        {
            id: 1,
            type: 'info',
            title: 'Bienvenue sur CamerAnnonces',
            message: 'Merci de rejoindre notre plateforme',
            date: 'Il y a 2 heures',
        },
    ];

    const renderNotification = ({ item }) => (
        <View style={styles.notificationCard}>
            <Icon name="notifications" size={24} color="#0066CC" />
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationDate}>{item.date}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Icon name="notifications-none" size={80} color="#ccc" />
                        <Text style={styles.emptyText}>Aucune notification</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    notificationContent: {
        flex: 1,
        marginLeft: 15,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    notificationDate: {
        fontSize: 12,
        color: '#999',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginTop: 20,
    },
});

export default NotificationsScreen;