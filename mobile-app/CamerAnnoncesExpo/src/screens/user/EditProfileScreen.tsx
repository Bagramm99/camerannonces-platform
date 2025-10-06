// src/screens/user/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditProfileScreen = ({ navigation }) => {
    const [nom, setNom] = useState('Utilisateur');
    const [telephone, setTelephone] = useState('237698123456');
    const [ville, setVille] = useState('Douala');
    const [quartier, setQuartier] = useState('Akwa');

    const handleSave = () => {
        Alert.alert('Succès', 'Profil mis à jour avec succès', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Nom complet</Text>
                <TextInput
                    style={styles.input}
                    value={nom}
                    onChangeText={setNom}
                    placeholder="Votre nom"
                />

                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                    style={styles.input}
                    value={telephone}
                    onChangeText={setTelephone}
                    placeholder="237XXXXXXXXX"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Ville</Text>
                <TextInput
                    style={styles.input}
                    value={ville}
                    onChangeText={setVille}
                    placeholder="Ville"
                />

                <Text style={styles.label}>Quartier</Text>
                <TextInput
                    style={styles.input}
                    value={quartier}
                    onChangeText={setQuartier}
                    placeholder="Quartier"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Icon name="save" size={24} color="#fff" />
                    <Text style={styles.saveButtonText}>Enregistrer</Text>
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
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#0066CC',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginTop: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default EditProfileScreen;