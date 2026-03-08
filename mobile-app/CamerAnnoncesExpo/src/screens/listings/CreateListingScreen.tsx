// src/screens/listings/CreateListingScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { api } from '../../services/api';
import { imageService } from '../../services/imageService';
import { categoryService, Category } from '../../services/categoryService';
import ImagePicker from '../../components/ImagePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateListingScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        category_id: 1,
        titre: '',
        description: '',
        prix: '',
        prix_negociable: true,
        etat_produit: 'BON',
        ville: '',
        telephone_contact: '',
    });

    // ✅ : State für Bilder
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const cats = await categoryService.getAllCategories();
            setCategories(cats);
            if (cats.length > 0) {
                setFormData(prev => ({ ...prev, category_id: cats[0].id }));
            }
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            Alert.alert('Erreur', 'Impossible de charger les catégories');
        } finally {
            setLoadingCategories(false);
        }
    };

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
        } else if (!/^(\+?237)?6[0-9]{8}$/.test(formData.telephone_contact.trim())) {
            newErrors.telephone_contact = 'Format invalide (ex: 237698123456)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ NOUVEAU: Upload images après création listing
    const uploadImagesForListing = async (listingId: number) => {
        if (selectedImages.length === 0) {
            return { success: true, message: 'Aucune image à uploader' };
        }

        setUploadingImages(true);
        try {
            const result = await imageService.uploadMultipleListingImages(
                listingId,
                selectedImages,
                (current, total) => {
                    setUploadProgress({ current, total });
                }
            );

            if (result.errorCount > 0) {
                console.warn(`⚠️ ${result.errorCount} images non uploadées`);
            }

            return {
                success: true,
                message: `${result.successCount} image(s) uploadée(s)`,
            };
        } catch (error: any) {
            console.error('❌ Image upload error:', error);
            return {
                success: false,
                message: error.message || 'Erreur upload images',
            };
        } finally {
            setUploadingImages(false);
            setUploadProgress({ current: 0, total: 0 });
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // 1️⃣ Créer le listing
            const payload = {
                categoryId: formData.category_id,
                titre: formData.titre.trim(),
                description: formData.description.trim(),
                prix: formData.prix ? parseInt(formData.prix) : null,
                prixNegociable: formData.prix_negociable,
                etatProduit: formData.etat_produit,
                ville: formData.ville.trim() || null,
                telephoneContact: formData.telephone_contact.trim(),
            };

            console.log('📤 Création listing:', payload);

            const response = await api.post('/listings', payload);
            const listingId = response.data.listing?.id;

            if (!listingId) {
                throw new Error('ID du listing non reçu');
            }

            console.log('✅ Listing créé, ID:', listingId);

            // 2️⃣ Upload images si présentes
            if (selectedImages.length > 0) {
                console.log(`📸 Upload de ${selectedImages.length} image(s)...`);
                const uploadResult = await uploadImagesForListing(listingId);

                if (!uploadResult.success) {
                    // Listing créé mais images échouées
                    Alert.alert(
                        'Annonce publiée',
                        `Votre annonce est en ligne mais ${uploadResult.message}`,
                        [
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate('MainTabs', { screen: 'Accueil' })
                            }
                        ]
                    );
                    return;
                }
            }

            // 3️⃣ Succès complet
            Alert.alert(
                'Succès',
                selectedImages.length > 0
                    ? `Annonce publiée avec ${selectedImages.length} photo(s) !`
                    : 'Annonce publiée avec succès !',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('MainTabs', { screen: 'Accueil' })
                    }
                ]
            );

        } catch (error: any) {
            console.error('❌ Erreur:', error);
            console.error('❌ Response:', error.response?.data);

            let errorMessage = 'Impossible de publier l\'annonce.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Vous devez être connecté pour publier.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Données invalides. Vérifiez tous les champs.';
            }

            Alert.alert('Erreur', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategories) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={24} color="#0066CC" />
                </TouchableOpacity>
                <Text style={styles.title}>Publier une annonce</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.form}>

                    {/* ✅: Image Picker */}
                    <ImagePicker
                        images={selectedImages}
                        onImagesChange={setSelectedImages}
                        maxImages={5}
                        title="Photos de l'annonce"
                    />

                    {/* Catégorie */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Catégorie *</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryScroll}
                        >
                            <View style={styles.categoryButtons}>
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryButton,
                                            formData.category_id === cat.id && styles.categoryButtonActive
                                        ]}
                                        onPress={() => handleInputChange('category_id', cat.id)}
                                    >
                                        <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                                        <Text style={[
                                            styles.categoryText,
                                            formData.category_id === cat.id && styles.categoryTextActive
                                        ]}>
                                            {cat.nom}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

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
                        <Text style={styles.charCount}>
                            {formData.description.length} / 1000
                        </Text>
                        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                    </View>

                    {/* Prix */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Prix (FCFA)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 450000"
                            value={formData.prix}
                            onChangeText={(text) => handleInputChange('prix', text.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                        />

                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={styles.checkboxRow}
                                onPress={() => handleInputChange('prix_negociable', !formData.prix_negociable)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.checkbox,
                                    formData.prix_negociable && styles.checkboxChecked
                                ]}>
                                    {formData.prix_negociable && (
                                        <Icon name="check" size={18} color="#fff" />
                                    )}
                                </View>
                                <Text style={styles.checkboxText}>Prix négociable</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* État */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>État du produit *</Text>
                        <View style={styles.conditionButtons}>
                            {[
                                { value: 'NEUF', label: 'Neuf' },
                                { value: 'TRES_BON', label: 'Très Bon' },
                                { value: 'BON', label: 'Bon' },
                                { value: 'MOYEN', label: 'Moyen' },
                            ].map((condition) => (
                                <TouchableOpacity
                                    key={condition.value}
                                    style={[
                                        styles.conditionButton,
                                        formData.etat_produit === condition.value && styles.conditionButtonActive
                                    ]}
                                    onPress={() => handleInputChange('etat_produit', condition.value)}
                                >
                                    <Text style={[
                                        styles.conditionText,
                                        formData.etat_produit === condition.value && styles.conditionTextActive
                                    ]}>
                                        {condition.label}
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
                            placeholder="Ex: Douala, Yaoundé, Bafoussam..."
                            value={formData.ville}
                            onChangeText={(text) => handleInputChange('ville', text)}
                        />
                    </View>

                    {/* Téléphone */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Numéro de contact *</Text>
                        <TextInput
                            style={[styles.input, errors.telephone_contact && styles.inputError]}
                            placeholder="+237698123456"
                            value={formData.telephone_contact}
                            onChangeText={(text) => handleInputChange('telephone_contact', text)}
                            keyboardType="phone-pad"
                        />
                        {errors.telephone_contact && (
                            <Text style={styles.errorText}>{errors.telephone_contact}</Text>
                        )}
                    </View>

                    {/* ✅: Upload Progress */}
                    {uploadingImages && (
                        <View style={styles.uploadProgress}>
                            <ActivityIndicator size="small" color="#0066CC" />
                            <Text style={styles.uploadProgressText}>
                                Upload images: {uploadProgress.current} / {uploadProgress.total}
                            </Text>
                        </View>
                    )}

                    {/* Bouton publier */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (loading || uploadingImages) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={loading || uploadingImages}
                    >
                        {(loading || uploadingImages) ? (
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
        </KeyboardAvoidingView>
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
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
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
    categoryScroll: {
        marginHorizontal: -5,
    },
    categoryButtons: {
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    categoryButton: {
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 10,
        backgroundColor: '#fff',
        minWidth: 80,
    },
    categoryButtonActive: {
        backgroundColor: '#0066CC',
        borderColor: '#0066CC',
    },
    categoryEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    categoryTextActive: {
        color: '#fff',
        fontWeight: '600',
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
    charCount: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 4,
    },
    inputError: {
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: 5,
    },
    checkboxContainer: {
        marginTop: 10,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: '#0066CC',
        borderColor: '#0066CC',
    },
    checkboxText: {
        fontSize: 16,
        color: '#333',
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
    },
    conditionTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    // ✅  Styles
    uploadProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#f0f7ff',
        borderRadius: 10,
        marginBottom: 20,
    },
    uploadProgressText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#0066CC',
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