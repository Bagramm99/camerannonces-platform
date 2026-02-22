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
import { useAuth } from '../../contexts/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        nom: '',
        telephone: '',
        motDePasse: '',
        confirmPassword: '',
        ville: '',
        quartier: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validation nom
        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom est requis';
        } else if (formData.nom.trim().length < 2) {
            newErrors.nom = 'Le nom doit avoir au moins 2 caractères';
        }

        // Validation téléphone
        if (!formData.telephone) {
            newErrors.telephone = 'Le numéro de téléphone est requis';
        } else if (!/^237[0-9]{9}$/.test(formData.telephone)) {
            newErrors.telephone = 'Format: 237XXXXXXXXX (9 chiffres après 237)';
        }

        // Validation mot de passe
        if (!formData.motDePasse) {
            newErrors.motDePasse = 'Le mot de passe est requis';
        } else if (formData.motDePasse.length < 6) {
            newErrors.motDePasse = 'Le mot de passe doit avoir au moins 6 caractères';
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

        // Effacer l'erreur quand l'utilisateur commence à taper
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
            await register(
                formData.nom.trim(),
                formData.telephone,
                formData.motDePasse,
                formData.ville.trim() || undefined,
                formData.quartier.trim() || undefined
            );
            // AuthContext gère la navigation automatiquement
        } catch (error: any) {
            console.error('❌ Register error:', error);
            Alert.alert(
                'Erreur d\'inscription',
                error.message || 'Vérifiez vos informations et réessayez'
            );
        } finally {
            setLoading(false);
        }
    };

    const formatPhoneNumber = (text: string) => {
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

                    {/* Numéro de téléphone */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Numéro de téléphone *</Text>
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