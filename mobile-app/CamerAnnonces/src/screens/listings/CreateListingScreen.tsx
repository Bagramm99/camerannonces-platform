// src/screens/listings/CreateListingScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CreateListingScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        prix: '',
        prix_negociable: true,
        etat_produit: 'BON',
        ville: '',
        telephone_contact: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.titre.trim()) {
            newErrors.titre = 'Le titre est requis';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La description est requise';
        }

        if (!formData.telephone_contact.trim()) {
            newErrors.telephone_contact = 'Le numéro de contact est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Mock submission
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Succès',
                'Votre annonce a été publiée avec succès !',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de publier l\'annonce');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={24} color="#0066CC" />
                </TouchableOpacity>
                <Text style={styles.title}>Publier une annonce</Text>
            </View>

            <View style={styles.form}>
                {/* Titre */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Titre de l'annonce *</Text>
                    <TextInput
                        style={[styles.input, errors.titre && styles.inputError]}
                        placeholder="Ex: iPhone 13 Pro Max en parfait état"
                        value={formData.titre}
                        onChangeText={(text) => handleInputChange('titre', text)}
                        maxLength={200}
                    />
                    {errors.titre && <Text style={styles.errorText}>{errors.titre}</Text>}
                </View>

                {/* Description */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.textArea, errors.description && styles.inputError]}
                        placeholder="Décrivez votre produit en détail..."
                        value={formData.description}
                        onChangeText={(text) => handleInputChange('description', text)}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        maxLength={1000}
                    />
                    {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </View>

                {/* Prix */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Prix (FCFA)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 450000"
                        value={formData.prix}
                        onChangeText={(text) => handleInputChange('prix', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* État */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>État du produit</Text>
                    <View style={styles.conditionButtons}>
                        {['NEUF', 'TRES_BON', 'BON', 'MOYEN'].map((condition) => (
                            <TouchableOpacity
                                key={condition}
                                style={[
                                    styles.conditionButton,
                                    formData.etat_produit === condition && styles.conditionButtonActive
                                ]}
                                onPress={() => handleInputChange('etat_produit', condition)}
                            >
                                <Text style={[
                                    styles.conditionText,
                                    formData.etat_produit === condition && styles.conditionTextActive
                                ]}>
                                    {condition === 'TRES_BON' ? 'Très bon' : condition.toLowerCase()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Ville */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Ville</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Douala, Yaoundé..."
                        value={formData.ville}
                        onChangeText={(text) => handleInputChange('ville', text)}
                    />
                </View>

                {/* Téléphone */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Numéro de contact *</Text>
                    <TextInput
                        style={[styles.input, errors.telephone_contact && styles.inputError]}
                        placeholder="237698123456"
                        value={formData.telephone_contact}
                        onChangeText={(text) => handleInputChange('telephone_contact', text)}
                        keyboardType="phone-pad"
                    />
                    {errors.telephone_contact && <Text style={styles.errorText}>{errors.telephone_contact}</Text>}
                </View>

                {/* Bouton publier */}
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Icon name="publish" size={20} color="#fff" />
                            <Text style={styles.submitButtonText}>Publier l'annonce</Text>
                        </>
                    )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    form: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        minHeight: 120,
    },
    inputError: {
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: 5,
    },
    conditionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    conditionButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    conditionButtonActive: {
        backgroundColor: '#0066CC',
        borderColor: '#0066CC',
    },
    conditionText: {
        fontSize: 14,
        color: '#666',
        textTransform: 'capitalize',
    },
    conditionTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#0066CC',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default CreateListingScreen;