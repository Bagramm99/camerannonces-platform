// src/components/common/WhatsAppButton.tsx
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Linking,
    Alert, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface WhatsAppButtonProps {
    phoneNumber: string;
    message?: string;
    listingTitle?: string;
    style?: any;
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
                                                           phoneNumber,
                                                           message,
                                                           listingTitle,
                                                           style,
                                                           size = 'medium',
                                                           showText = true,
                                                       }) => {

    const formatPhoneNumber = (phone: string) => {
        // Supprimer tous les espaces et caractères spéciaux
        let cleaned = phone.replace(/\D/g, '');

        // Si le numéro commence par 237, le garder tel quel
        if (cleaned.startsWith('237')) {
            return cleaned;
        }

        // Si le numéro commence par 0, remplacer par 237
        if (cleaned.startsWith('0')) {
            return '237' + cleaned.substring(1);
        }

        // Sinon, ajouter 237 au début
        return '237' + cleaned;
    };

    const generateMessage = () => {
        if (message) return message;

        if (listingTitle) {
            return `Bonjour, je suis intéressé(e) par votre annonce "${listingTitle}" sur CamerAnnonces. Pouvez-vous me donner plus d'informations ?`;
        }

        return `Bonjour, je vous contact via CamerAnnonces. Pouvez-vous me donner plus d'informations ?`;
    };

    const openWhatsApp = async () => {
        try {
            const formattedPhone = formatPhoneNumber(phoneNumber);
            const encodedMessage = encodeURIComponent(generateMessage());
            const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;

            // Vérifier si WhatsApp est installé
            const canOpen = await Linking.canOpenURL(whatsappUrl);

            if (canOpen) {
                await Linking.openURL(whatsappUrl);
            } else {
                // Si WhatsApp n'est pas installé, proposer l'installation ou utiliser le web
                Alert.alert(
                    'WhatsApp non trouvé',
                    'WhatsApp n\'est pas installé sur votre appareil.',
                    [
                        {
                            text: 'Ouvrir dans le navigateur',
                            onPress: () => {
                                const webUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
                                Linking.openURL(webUrl);
                            }
                        },
                        {
                            text: 'Installer WhatsApp',
                            onPress: () => {
                                const storeUrl = Platform.OS === 'ios'
                                    ? 'https://apps.apple.com/app/whatsapp-messenger/id310633997'
                                    : 'https://play.google.com/store/apps/details?id=com.whatsapp';
                                Linking.openURL(storeUrl);
                            }
                        },
                        { text: 'Annuler', style: 'cancel' }
                    ]
                );
            }
        } catch (error) {
            console.error('Erreur WhatsApp:', error);
            Alert.alert('Erreur', 'Impossible d\'ouvrir WhatsApp');
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    padding: 8,
                    iconSize: 16,
                    fontSize: 12,
                };
            case 'large':
                return {
                    padding: 16,
                    iconSize: 24,
                    fontSize: 18,
                };
            default: // medium
                return {
                    padding: 12,
                    iconSize: 20,
                    fontSize: 16,
                };
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { padding: sizeStyles.padding },
                style
            ]}
            onPress={openWhatsApp}
            activeOpacity={0.8}
        >
            <Icon
                name="message"
                size={sizeStyles.iconSize}
                color="#fff"
            />
            {showText && (
                <Text style={[styles.buttonText, { fontSize: sizeStyles.fontSize }]}>
                    Contacter sur WhatsApp
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#25D366', // Couleur officielle WhatsApp
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default WhatsAppButton;