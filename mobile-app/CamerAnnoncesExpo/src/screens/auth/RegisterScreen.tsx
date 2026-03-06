// src/screens/auth/RegisterScreen.tsx
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
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { authService } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        nom: '',
        telephone: '',
        email: '',
        motDePasse: '',
        confirmPassword: '',
        ville: '',
        quartier: '',
    });

    const [countryCode, setCountryCode] = useState<CountryCode>('CM');
    const [callingCode, setCallingCode] = useState('+237');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const onSelectCountry = (country: Country) => {
        setCountryCode(country.cca2);
        setCallingCode(`+${country.callingCode[0]}`);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validation nom
        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom est requis';
        } else if (formData.nom.trim().length < 2) {
            newErrors.nom = 'Le nom doit avoir au moins 2 caractères';
        }

        // Validation téléphone (sans country code)
        if (!formData.telephone) {
            newErrors.telephone = 'Le numéro de téléphone est requis';
        } else if (!/^[0-9]{9,15}$/.test(formData.telephone)) {
            newErrors.telephone = 'Numéro invalide (9-15 chiffres)';
        }

        // Validation email (optionnel mais format si rempli)
        if (formData.email && formData.email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Format email invalide';
            }
        }

        // Validation mot de passe
        if (!formData.motDePasse) {
            newErrors.motDePasse = 'Le mot de passe est requis';
        } else if (formData.motDePasse.length < 6) {
            newErrors.motDePasse = 'Minimum 6 caractères requis';
        }

        // Confirmation mot de passe
        if (formData.motDePasse !== formData.confirmPassword) {
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

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Numéro complet mit Country Code
            const fullTelephone = callingCode.replace('+', '') + formData.telephone;

            const response = await authService.registerWithEmail(
                formData.nom.trim(),
                fullTelephone,
                formData.email.trim() || null,
                formData.motDePasse,
                callingCode,
                formData.ville.trim() || undefined,
                formData.quartier.trim() || undefined
            );

            if (response.needsVerification && formData.email.trim()) {
                // Email vorhanden → zur Verifizierung
                Alert.alert(
                    'Vérification requise',
                    'Un code de vérification a été envoyé à votre email.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('VerifyCode', {
                                telephone: fullTelephone,
                                email: formData.email.trim(),
                            })
                        }
                    ]
                );
            } else {
                // Kein Email → direkt einloggen
                Alert.alert('Succès', 'Compte créé avec succès !');
                navigation.navigate('Login');
            }
        } catch (error: any) {
            console.error('❌ Register error:', error);
            Alert.alert(
                'Erreur d\'inscription',
                error.message || 'Vérifiez vos informations'
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
                    <Text style={styles.title}>Créer un compte</Text>
                    <Text style={styles.subtitle}>
                        Rejoignez la communauté CamerAnnonces
                    </Text>
                </View>

                {/* Formulaire */}
                <View style={styles.form}>
                    {/* Nom complet */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nom complet *</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.nom && styles.inputError
                        ]}>
                            <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Jean Dupont"
                                value={formData.nom}
                                onChangeText={(text) => handleInputChange('nom', text)}
                                autoCapitalize="words"
                            />
                        </View>
                        {errors.nom && (
                            <Text style={styles.errorText}>{errors.nom}</Text>
                        )}
                    </View>

                    {/* Numéro de téléphone avec Country Picker */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Numéro de téléphone *</Text>
                        <View style={[
                            styles.phoneInputWrapper,
                            errors.telephone && styles.inputError
                        ]}>
                            <TouchableOpacity
                                style={styles.countryPickerButton}
                                onPress={() => setShowCountryPicker(true)}
                            >
                                <CountryPicker
                                    countryCode={countryCode}
                                    withFlag
                                    withCallingCode
                                    withFilter
                                    withEmoji
                                    onSelect={onSelectCountry}
                                    visible={showCountryPicker}
                                    onClose={() => setShowCountryPicker(false)}
                                />
                                <Text style={styles.callingCode}>{callingCode}</Text>
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
                        <Text style={styles.hintText}>
                            📱 Numéro utilisé pour les annonces
                        </Text>
                    </View>

                    {/* Email (optionnel) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email (optionnel)</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.email && styles.inputError
                        ]}>
                            <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="exemple@email.com"
                                value={formData.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                        <Text style={styles.hintText}>
                            ✉️ Pour récupérer votre compte si besoin
                        </Text>
                    </View>

                    {/* Ville */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Ville</Text>
                        <View style={styles.inputWrapper}>
                            <Icon name="location-city" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Douala, Yaoundé, Bafoussam..."
                                value={formData.ville}
                                onChangeText={(text) => handleInputChange('ville', text)}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Quartier */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Quartier</Text>
                        <View style={styles.inputWrapper}>
                            <Icon name="location-on" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Akwa, Bastos, Makepe..."
                                value={formData.quartier}
                                onChangeText={(text) => handleInputChange('quartier', text)}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Mot de passe */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mot de passe *</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.motDePasse && styles.inputError
                        ]}>
                            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Minimum 6 caractères"
                                value={formData.motDePasse}
                                onChangeText={(text) => handleInputChange('motDePasse', text)}
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
                        {errors.motDePasse && (
                            <Text style={styles.errorText}>{errors.motDePasse}</Text>
                        )}
                    </View>

                    {/* Confirmation mot de passe */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirmer le mot de passe *</Text>
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

                    {/* Bouton d'inscription */}
                    <TouchableOpacity
                        style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="person-add" size={20} color="#fff" />
                                <Text style={styles.registerButtonText}>Créer mon compte</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Connexion */}
                <View style={styles.loginSection}>
                    <Text style={styles.loginText}>
                        Vous avez déjà un compte ?
                    </Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginButtonText}>
                            Se connecter
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Conditions d'utilisation */}
                <View style={styles.termsSection}>
                    <Text style={styles.termsText}>
                        En créant un compte, vous acceptez nos{' '}
                        <Text style={styles.termsLink}>Conditions d'utilisation</Text>
                        {' '}et notre{' '}
                        <Text style={styles.termsLink}>Politique de confidentialité</Text>
                    </Text>
                </View>
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
        marginBottom: 30,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
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
        marginLeft: 8,
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
    hintText: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
        fontStyle: 'italic',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: 5,
    },
    registerButton: {
        backgroundColor: '#0066CC',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    loginSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    loginButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    loginButtonText: {
        color: '#0066CC',
        fontSize: 16,
        fontWeight: '600',
    },
    termsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    termsText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
        color: '#0066CC',
        fontWeight: '600',
    },
});

export default RegisterScreen;