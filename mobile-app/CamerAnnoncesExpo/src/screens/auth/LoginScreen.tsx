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
import { authService } from '../../services/authService';

const LoginScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        telephone: '',
        mot_de_passe: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validation téléphone camerounais
        if (!formData.telephone) {
            newErrors.telephone = 'Le numéro de téléphone est requis';
        } else if (!/^237[0-9]{9}$/.test(formData.telephone)) {
            newErrors.telephone = 'Format: 237XXXXXXXXX (9 chiffres après 237)';
        }

        // Validation mot de passe
        if (!formData.mot_de_passe) {
            newErrors.mot_de_passe = 'Le mot de passe est requis';
        } else if (formData.mot_de_passe < 6) {
            newErrors.mot_de_passe = 'Le mot de passe doit avoir au moins 6 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Effacer l'erreur quand l'utilisateur commence à taper
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
            const response = await authService.login({
                telephone: formData.telephone,
                mot_de_passe: formData.mot_de_passe,
            });

            if (response.success) {
                // Stocker le token et les infos utilisateur
                await authService.saveAuthData(response.data);

                if (response.data) {
                    Alert.alert(
                        'Connexion réussie',
                        `Bienvenue ${response.data.user.nom} !`,
                        [{text: 'OK', onPress: () => navigation.replace('MainTabs')}]
                    );
                }
            } else {
                Alert.alert('Erreur', response.message || 'Identifiants incorrects');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert(
                'Erreur de connexion',
                'Vérifiez votre connexion internet et réessayez'
            );
        } finally {
            setLoading(false);
        }
    };

    const formatPhoneNumber = (text) => {
        // Auto-complétion du 237
        if (text.length > 0 && !text.startsWith('237')) {
            return '237' + text.replace(/[^0-9]/g, '');
        }
        return text.replace(/[^0-9]/g, '');
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
                    {/* Numéro de téléphone */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Numéro de téléphone</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.telephone && styles.inputError
                        ]}>
                            <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="237698123456"
                                value={formData.telephone}
                                onChangeText={(text) => handleInputChange('telephone', formatPhoneNumber(text))}
                                keyboardType="phone-pad"
                                maxLength={12}
                                autoCapitalize="none"
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
                            errors.mot_de_passe && styles.inputError
                        ]}>
                            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Votre mot de passe"
                                value={formData.mot_de_passe}
                                onChangeText={(text) => handleInputChange('mot_de_passe', text)}
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
                        {errors.mot_de_passe && (
                            <Text style={styles.errorText}>{errors.mot_de_passe}</Text>
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
                    <TouchableOpacity style={styles.forgotPassword}>
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