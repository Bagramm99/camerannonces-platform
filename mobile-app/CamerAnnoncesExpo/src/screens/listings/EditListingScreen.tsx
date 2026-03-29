// src/screens/listings/EditListingScreen.tsx
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
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { listingService, Listing } from '../../services/listingService';
import { imageService } from '../../services/imageService';
import { categoryService, Category } from '../../services/categoryService';
import ImagePicker from '../../components/ImagePicker';

interface ListingImage {
    id: number;
    url: string;
    nomFichier?: string;
    isPrincipale: boolean;
    ordreAffichage: number;
}

const EditListingScreen = ({ route, navigation }: any) => {
    const { listingId } = route.params;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [deletingImage, setDeletingImage] = useState<number | null>(null);

    const [listing, setListing] = useState<Listing | null>(null);
    const [existingImages, setExistingImages] = useState<ListingImage[]>([]);
    const [newImages, setNewImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

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

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            console.log('🔄 ========================================');
            console.log('🔄 LOADING LISTING DATA');
            console.log('🔄 ========================================');
            console.log('📋 Listing ID:', listingId);

            setLoading(true);

            // Load listing data
            console.log('📥 Fetching listing data...');
            const response = await listingService.getListingById(listingId);
            console.log('📥 Raw listing response:', JSON.stringify(response, null, 2));

            // Extract listing from response (might be nested)
            const listingData = response.listing || response;
            console.log('📥 Extracted listing data:', listingData);

            setListing(listingData);

            // Load categories
            console.log('📥 Fetching categories...');
            const cats = await categoryService.getAllCategories();
            console.log('✅ Categories loaded:', cats.length);
            setCategories(cats);

            // Load existing images
            try {
                console.log('📥 Fetching images...');
                const imagesData = await imageService.getListingImages(listingId);
                console.log('📥 Images response:', imagesData);

                if (imagesData.success && imagesData.images) {
                    console.log('✅ Images loaded:', imagesData.images.length);
                    setExistingImages(imagesData.images);
                }
            } catch (error) {
                console.log('⚠️ No images found for listing');
                setExistingImages([]);
            }

            // Populate form
            const formDataToSet = {
                category_id: listingData.category?.id || 1,
                titre: listingData.titre || '',
                description: listingData.description || '',
                prix: listingData.prix?.toString() || '',
                prix_negociable: listingData.prix_negociable ?? true,
                etat_produit: listingData.etat_produit || 'BON',
                ville: listingData.ville || '',
                telephone_contact: '', // Not loaded for security
            };

            console.log('📋 Form data to set:', formDataToSet);
            setFormData(formDataToSet);

            console.log('✅ Loading complete!');

        } catch (error: any) {
            console.log('🔴 ========================================');
            console.log('🔴 ERROR LOADING LISTING');
            console.log('🔴 ========================================');
            console.error('❌ Error loading listing:', error);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error response:', error.response?.data);

            Alert.alert(
                'Erreur',
                'Impossible de charger l\'annonce',
                [{ text: 'Retour', onPress: () => navigation.goBack() }]
            );
        } finally {
            setLoading(false);
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDeleteExistingImage = async (imageId: number) => {
        Alert.alert(
            'Supprimer l\'image',
            'Êtes-vous sûr de vouloir supprimer cette image ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setDeletingImage(imageId);
                            await imageService.deleteListingImage(imageId);
                            setExistingImages(prev => prev.filter(img => img.id !== imageId));
                            Alert.alert('Succès', 'Image supprimée');
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de supprimer l\'image');
                        } finally {
                            setDeletingImage(null);
                        }
                    }
                }
            ]
        );
    };

    const handleSetMainImage = async (imageId: number) => {
        try {
            await imageService.setMainImage(imageId);

            // Update UI
            setExistingImages(prev =>
                prev.map(img => ({
                    ...img,
                    isPrincipale: img.id === imageId
                }))
            );

            Alert.alert('Succès', 'Image principale mise à jour');
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de définir l\'image principale');
        }
    };

    const uploadNewImages = async () => {
        if (newImages.length === 0) return;

        setUploadingImages(true);
        try {
            const result = await imageService.uploadMultipleListingImages(
                listingId,
                newImages,
                () => {} // Progress callback
            );

            if (result.errorCount > 0) {
                Alert.alert(
                    'Attention',
                    `${result.successCount} image(s) uploadée(s), ${result.errorCount} échec(s)`
                );
            }

            // Reload images
            const imagesData = await imageService.getListingImages(listingId);
            if (imagesData.success && imagesData.images) {
                setExistingImages(imagesData.images);
            }

            setNewImages([]);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible d\'uploader les nouvelles images');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSave = async () => {
        console.log('🔵 ========================================');
        console.log('🔵 SAVE BUTTON CLICKED!');
        console.log('🔵 ========================================');
        console.log('📋 Listing ID:', listingId);
        console.log('📋 Form Data:', formData);

        if (!validateForm()) {
            console.log('❌ Form validation failed!');
            console.log('❌ Errors:', errors);
            return;
        }

        console.log('✅ Form validation passed');

        setSaving(true);
        try {
            console.log('💾 Starting save process...');

            // 1. Upload new images first
            if (newImages.length > 0) {
                console.log(`📸 Uploading ${newImages.length} new image(s)...`);
                await uploadNewImages();
                console.log('✅ New images uploaded');
            } else {
                console.log('ℹ️ No new images to upload');
            }

            // 2. Update listing data
            const payload = {
                categoryId: formData.category_id,
                titre: formData.titre.trim(),
                description: formData.description.trim(),
                prix: formData.prix ? parseInt(formData.prix) : null,
                prixNegociable: formData.prix_negociable,
                etatProduit: formData.etat_produit,
                ville: formData.ville.trim() || null,
                ...(formData.telephone_contact.trim() && {
                    telephoneContact: formData.telephone_contact.trim()
                })
            };

            console.log('📦 Payload to send:', JSON.stringify(payload, null, 2));
            console.log('🔗 Calling: listingService.updateListing');

            const result = await listingService.updateListing(listingId, payload);

            console.log('✅ Update successful!');
            console.log('✅ Result:', result);

            Alert.alert(
                'Succès',
                'Annonce mise à jour !',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            console.log('📱 Navigating back...');
                            navigation.goBack();
                        }
                    }
                ]
            );

        } catch (error: any) {
            console.log('🔴 ========================================');
            console.log('🔴 ERROR OCCURRED!');
            console.log('🔴 ========================================');
            console.error('❌ Save error:', error);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);

            Alert.alert(
                'Erreur',
                error.response?.data?.message || error.message || 'Impossible de sauvegarder les modifications'
            );
        } finally {
            console.log('🏁 Save process finished');
            console.log('🏁 Setting saving to false');
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Supprimer l\'annonce',
            'Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setSaving(true);
                            await listingService.deleteListing(listingId);
                            Alert.alert(
                                'Succès',
                                'Annonce supprimée',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => navigation.navigate('MainTabs', { screen: 'Accueil' })
                                    }
                                ]
                            );
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de supprimer l\'annonce');
                        } finally {
                            setSaving(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
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
                <Text style={styles.title}>Modifier l'annonce</Text>
                <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.deleteButton}
                >
                    <Icon name="delete" size={24} color="#ff4444" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.form}>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Images actuelles ({existingImages.length})
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.imageScroll}
                            >
                                {existingImages.map((image) => (
                                    <View key={image.id} style={styles.imageContainer}>
                                        <Image
                                            source={{ uri: image.url }}
                                            style={styles.image}
                                            resizeMode="cover"
                                        />

                                        {/* Main image badge */}
                                        {image.isPrincipale && (
                                            <View style={styles.mainBadge}>
                                                <Icon name="star" size={16} color="#fff" />
                                                <Text style={styles.mainBadgeText}>Principal</Text>
                                            </View>
                                        )}

                                        {/* Action buttons */}
                                        <View style={styles.imageActions}>
                                            {!image.isPrincipale && (
                                                <TouchableOpacity
                                                    style={styles.setMainButton}
                                                    onPress={() => handleSetMainImage(image.id)}
                                                >
                                                    <Icon name="star-border" size={20} color="#fff" />
                                                </TouchableOpacity>
                                            )}

                                            <TouchableOpacity
                                                style={styles.deleteImageButton}
                                                onPress={() => handleDeleteExistingImage(image.id)}
                                                disabled={deletingImage === image.id}
                                            >
                                                {deletingImage === image.id ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <Icon name="delete" size={20} color="#fff" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Add New Images */}
                    <View style={styles.section}>
                        <ImagePicker
                            images={newImages}
                            onImagesChange={setNewImages}
                            maxImages={5 - existingImages.length}
                            title="Ajouter des images"
                        />
                        {newImages.length > 0 && (
                            <Text style={styles.helpText}>
                                {newImages.length} nouvelle(s) image(s) à uploader
                            </Text>
                        )}
                    </View>

                    {/* Category */}
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

                    {/* Title */}
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

                    {/* Price */}
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

                    {/* Condition */}
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

                    {/* City */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Ville</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Douala, Yaoundé, Bafoussam..."
                            value={formData.ville}
                            onChangeText={(text) => handleInputChange('ville', text)}
                        />
                    </View>

                    {/* Phone (optional update) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Numéro de contact (laisser vide pour ne pas modifier)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+237698123456"
                            value={formData.telephone_contact}
                            onChangeText={(text) => handleInputChange('telephone_contact', text)}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (saving || uploadingImages) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSave}
                        disabled={saving || uploadingImages}
                    >
                        {(saving || uploadingImages) ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="save" size={20} color="#fff" />
                                <Text style={styles.submitButtonText}>Sauvegarder</Text>
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
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 5,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 15,
    },
    deleteButton: {
        padding: 5,
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
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    imageScroll: {
        marginHorizontal: -5,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 10,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
    mainBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FFB800',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    mainBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 4,
    },
    imageActions: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        flexDirection: 'row',
    },
    setMainButton: {
        backgroundColor: 'rgba(0, 102, 204, 0.9)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    deleteImageButton: {
        backgroundColor: 'rgba(255, 68, 68, 0.9)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        fontStyle: 'italic',
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

export default EditListingScreen;