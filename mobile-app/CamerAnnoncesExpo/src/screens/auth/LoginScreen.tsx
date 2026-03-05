// src/screens/auth/LoginScreen.tsx
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
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        telephone: '',
        motDePasse: '',
    });

    const [countryCode, setCountryCode] = useState('+237');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validation téléphone (sans country code)
        if (!formData.telephone) {
            newErrors.telephone = 'Le numéro de téléphone est requis';
        } else if (!/^[0-9]{9,15}$/.test(formData.telephone)) {
            newErrors.telephone = 'Numéro invalide (9-15 chiffres)';
        }

        // Validation mot de passe
        if (!formData.motDePasse) {
            newErrors.motDePasse = 'Le mot de passe est requis';
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

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Numéro complet mit Country Code
            const fullTelephone = countryCode.replace('+', '') + formData.telephone;

            await login(fullTelephone, formData.motDePasse);
            // AuthContext gère la navigation automatiquement
        } catch (error: any) {
            console.error('❌ Login error:', error);
            Alert.alert(
                'Erreur de connexion',
                error.message || 'Vérifiez vos identifiants et réessayez'
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
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>🇨🇲</Text>
                    <Text style={styles.title}>CamerAnnonces</Text>
                    <Text style={styles.subtitle}>
                        Connectez-vous pour accéder à votre compte
                    </Text>
                </View>

                {/* Formulaire */}
                <View style={styles.form}>
                    {/* Numéro de téléphone avec Country Picker */}
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

                    {/* Mot de passe */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.motDePasse && styles.inputError
                        ]}>
                            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Votre mot de passe"
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

                    {/* Bouton de connexion */}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="login" size={20} color="#fff" />
                                <Text style={styles.loginButtonText}>Se connecter</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Mot de passe oublié */}
                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotPasswordText}>
                            Mot de passe oublié ?
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Inscription */}
                <View style={styles.registerSection}>
                    <Text style={styles.registerText}>
                        Vous n'avez pas encore de compte ?
                    </Text>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerButtonText}>
                            Créer un compte gratuitement
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Avantages */}
                <View style={styles.benefitsSection}>
                    <Text style={styles.benefitsTitle}>
                        💡 Pourquoi créer un compte ?
                    </Text>
                    <View style={styles.benefitItem}>
                        <Icon name="add-circle" size={16} color="#00C851" />
                        <Text style={styles.benefitText}>Publier vos annonces gratuitement</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Icon name="favorite" size={16} color="#00C851" />
                        <Text style={styles.benefitText}>Sauvegarder vos annonces favorites</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Icon name="notifications" size={16} color="#00C851" />
                        <Text style={styles.benefitText}>Recevoir des alertes personnalisées</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Icon name="verified" size={16} color="#00C851" />
                        <Text style={styles.benefitText}>Profil vérifié et crédible</Text>
                    </View>
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
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        fontSize: 60,
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
    loginButton: {
        backgroundColor: '#0066CC',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 15,
    },
    forgotPasswordText: {
        color: '#0066CC',
        fontSize: 16,
    },
    registerSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    registerText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    registerButton: {
        borderWidth: 2,
        borderColor: '#0066CC',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    registerButtonText: {
        color: '#0066CC',
        fontSize: 16,
        fontWeight: '600',
    },
    benefitsSection: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    benefitsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    benefitText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
    },
});

export default LoginScreen;