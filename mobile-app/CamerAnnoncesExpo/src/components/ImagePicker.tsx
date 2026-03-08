// src/components/ImagePicker.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePickerExpo from 'expo-image-picker';

interface ImagePickerProps {
    images: string[]; // Array of URIs
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    title?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
                                                     images,
                                                     onImagesChange,
                                                     maxImages = 5,
                                                     title = 'Photos',
                                                 }) => {
    const [loading, setLoading] = useState(false);

    const requestPermissions = async () => {
        const { status } = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission requise',
                'Nous avons besoin d\'accéder à vos photos pour continuer.'
            );
            return false;
        }
        return true;
    };

    const pickImages = async () => {
        if (images.length >= maxImages) {
            Alert.alert(
                'Limite atteinte',
                `Vous pouvez ajouter maximum ${maxImages} photos.`
            );
            return;
        }

        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        setLoading(true);
        try {
            const result = await ImagePickerExpo.launchImageLibraryAsync({
                mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                aspect: [4, 3],
            });

            if (!result.canceled && result.assets) {
                const newImages = result.assets.map(asset => asset.uri);
                const remainingSlots = maxImages - images.length;
                const imagesToAdd = newImages.slice(0, remainingSlots);

                onImagesChange([...images, ...imagesToAdd]);

                if (newImages.length > remainingSlots) {
                    Alert.alert(
                        'Limite atteinte',
                        `Seulement ${remainingSlots} photo(s) ajoutée(s). Limite: ${maxImages}`
                    );
                }
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert('Erreur', 'Impossible de sélectionner les photos');
        } finally {
            setLoading(false);
        }
    };

    const takePhoto = async () => {
        if (images.length >= maxImages) {
            Alert.alert(
                'Limite atteinte',
                `Vous pouvez ajouter maximum ${maxImages} photos.`
            );
            return;
        }

        const { status } = await ImagePickerExpo.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission requise',
                'Nous avons besoin d\'accéder à votre caméra.'
            );
            return;
        }

        setLoading(true);
        try {
            const result = await ImagePickerExpo.launchCameraAsync({
                quality: 0.8,
                aspect: [4, 3],
            });

            if (!result.canceled && result.assets[0]) {
                onImagesChange([...images, result.assets[0].uri]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Erreur', 'Impossible de prendre une photo');
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const showOptions = () => {
        Alert.alert(
            'Ajouter une photo',
            'Choisissez une option',
            [
                {
                    text: 'Prendre une photo',
                    onPress: takePhoto,
                },
                {
                    text: 'Choisir depuis la galerie',
                    onPress: pickImages,
                },
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.count}>
                    {images.length} / {maxImages}
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Add Button */}
                {images.length < maxImages && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={showOptions}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#0066CC" />
                        ) : (
                            <>
                                <Icon name="add-photo-alternate" size={40} color="#0066CC" />
                                <Text style={styles.addButtonText}>
                                    Ajouter
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}

                {/* Image Previews */}
                {images.map((uri, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri }} style={styles.image} />

                        {/* Main Badge */}
                        {index === 0 && (
                            <View style={styles.mainBadge}>
                                <Text style={styles.mainBadgeText}>Principale</Text>
                            </View>
                        )}

                        {/* Remove Button */}
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeImage(index)}
                        >
                            <Icon name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {images.length === 0 && (
                <Text style={styles.hintText}>
                    📸 Ajoutez des photos pour attirer plus d'acheteurs
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    count: {
        fontSize: 14,
        color: '#666',
    },
    scrollContent: {
        paddingRight: 10,
    },
    addButton: {
        width: 120,
        height: 120,
        borderWidth: 2,
        borderColor: '#0066CC',
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#f0f7ff',
    },
    addButtonText: {
        marginTop: 5,
        fontSize: 14,
        color: '#0066CC',
        fontWeight: '600',
    },
    imageContainer: {
        width: 120,
        height: 120,
        marginRight: 10,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    mainBadge: {
        position: 'absolute',
        top: 5,
        left: 5,
        backgroundColor: '#0066CC',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
    },
    mainBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 68, 68, 0.9)',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hintText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 10,
    },
});

export default ImagePicker;