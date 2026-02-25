import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    ScrollView,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const navigation = useNavigation();

    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    // ✅ Action pour aller à l'écran de changement de mot de passe
    const goToChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    // ✅ Alerte de confirmation pour suppression de compte
    const confirmDelete = () => {
        Alert.alert(
            'Supprimer le compte',
            'Cette action est irréversible. Voulez-vous continuer ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Fonctionnalité à venir',
                            'La suppression de compte sera bientôt disponible'
                            // TODO appeler l' API de suppression de compter
                        );
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* 🔔 Section Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Activer les notifications</Text>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#767577', true: '#0066CC' }}
                        thumbColor={notifications ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* 🎨 Section Apparence */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Apparence</Text>
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Mode sombre</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: '#767577', true: '#0066CC' }}
                        thumbColor={darkMode ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* 👤 Section Compte */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Compte</Text>

                {/* 👉 Bouton : Changer le mot de passe */}
                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={goToChangePassword}
                    activeOpacity={0.7}
                >
                    <Text style={styles.settingText}>Changer le mot de passe</Text>
                    <Icon name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>

                {/* ❌ Bouton : Supprimer le compte */}
                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={confirmDelete}
                    activeOpacity={0.7}
                >
                    <Text style={styles.settingTextDanger}>Supprimer le compte</Text>
                    <Icon name="chevron-right" size={24} color="#d32f2f" />
                </TouchableOpacity>
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
        marginTop: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#999',
        textTransform: 'uppercase',
        paddingVertical: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    settingTextDanger: {
        fontSize: 16,
        color: '#d32f2f',
    },
});

export default SettingsScreen;