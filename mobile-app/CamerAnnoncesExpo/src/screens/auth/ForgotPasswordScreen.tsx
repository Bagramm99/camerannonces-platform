// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CountryPicker } from 'react-native-country-code-picker';
import { authService } from '../../services/authService';

const ForgotPasswordScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        telephone: '',
        nouveauMotDePasse: '',
        confirmPassword: '',
    });

    const [countryCode, setCountryCode] = useState('+237');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validation téléphone
        if (!formData.telephone) {
            newErrors.telephone = 'Le numéro de téléphone est requis';
        } else if (!/^[0-9]{9,15}$/.test(formData.telephone)) {
            newErrors.telephone = 'Numéro invalide (9-15 chiffres)';
        }

        // Validation nouveau mot de passe
        if (!formData.nouveauMotDePasse) {
            newErrors.nouveauMotDePasse = 'Le nouveau mot de passe est requis';
        } else if (formData.nouveauMotDePasse.length < 6) {
            newErrors.nouveauMotDePasse = 'Minimum 6 caractères requis';
        }

        // Confirmation mot de passe
        if (formData.nouveauMotDePasse !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleResetPassword = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Numéro complet mit Country Code
            const fullTelephone = countryCode.replace('+', '') + formData.telephone;

            const response = await authService.resetPassword(
                fullTelephone,
                formData.nouveauMotDePasse
            );

            Alert.alert(
                'Succès',
                'Votre mot de passe a été réinitialisé avec succès !',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login')
                    }
                ]
            );
        } catch (error: any) {
            console.error('❌ Reset password error:', error);
            Alert.alert(
                'Erreur',
                error.message || 'Impossible de réinitialiser le mot de passe. Vérifiez votre numéro.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-back" size={24} color="#0066CC" />
                    </TouchableOpacity>
                    <Icon name="lock-reset" size={80} color="#0066CC" />
                    <Text style={styles.title}>Mot de passe oublié ?</Text>
                    <Text style={styles.subtitle}>
                        Réinitialisez votre mot de passe
                    </Text>
                </View>

                {/* Formulaire */}
                <View style={styles.form}>
                    {/* Numéro de téléphone */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Numéro de téléphone</Text>
                        <View style={[
                            styles.phoneInputWrapper,
                            errors.telephone && styles.inputError
                        ]}>
                            <TouchableOpacity
                                style={styles.countryPickerButton}
                                onPress={() => setShowCountryPicker(true)}
                            >
                                <Text style={styles.callingCode}>{countryCode}</Text>
                                <Icon name="arrow-drop-down" size={20} color="#666" />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="698123456"
                                value={formData.telephone}
                                onChangeText={(text) => handleInputChange('telephone', text.replace(/[^0-9]/g, ''))}
                                keyboardType="phone-pad"
                                maxLength={15}
                            />
                        </View>
                        {errors.telephone && (
                            <Text style={styles.errorText}>{errors.telephone}</Text>
                        )}
                    </View>

                    {/* Nouveau mot de passe */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nouveau mot de passe</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.nouveauMotDePasse && styles.inputError
                        ]}>
                            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Minimum 6 caractères"
                                value={formData.nouveauMotDePasse}
                                onChangeText={(text) => handleInputChange('nouveauMotDePasse', text)}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.passwordToggle}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Icon
                                    name={showPassword ? 'visibility' : 'visibility-off'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.nouveauMotDePasse && (
                            <Text style={styles.errorText}>{errors.nouveauMotDePasse}</Text>
                        )}
                    </View>

                    {/* Confirmer mot de passe */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirmer le mot de passe</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.confirmPassword && styles.inputError
                        ]}>
                            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Retapez votre mot de passe"
                                value={formData.confirmPassword}
                                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.passwordToggle}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Icon
                                    name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}
                    </View>

                    {/* Bouton de réinitialisation */}
                    <TouchableOpacity
                        style={[styles.resetButton, loading && styles.resetButtonDisabled]}
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="check-circle" size={20} color="#fff" />
                                <Text style={styles.resetButtonText}>Réinitialiser le mot de passe</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Info box */}
                <View style={styles.infoBox}>
                    <Icon name="info" size={20} color="#0066CC" />
                    <Text style={styles.infoText}>
                        Entrez votre numéro de téléphone et choisissez un nouveau mot de passe.
                    </Text>
                </View>

                {/* Country Picker Modal */}
                <CountryPicker
                    show={showCountryPicker}
                    pickerButtonOnPress={(item) => {
                        setCountryCode(item.dial_code);
                        setShowCountryPicker(false);
                    }}
                    lang={'fr'}
                    style={{
                        modal: {
                            height: 500,
                        },
                    }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    form: {
        marginBottom: 30,
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f8f9fa',
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#f8f9fa',
    },
    countryPickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 15,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    callingCode: {
        fontSize: 16,
        color: '#333',
        marginRight: 4,
        fontWeight: '500',
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        fontSize: 16,
        color: '#333',
    },
    inputError: {
        borderColor: '#ff4444',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#333',
    },
    passwordToggle: {
        padding: 5,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: 5,
    },
    resetButton: {
        backgroundColor: '#0066CC',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    resetButtonDisabled: {
        opacity: 0.7,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#e6f0ff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});

export default ForgotPasswordScreen;