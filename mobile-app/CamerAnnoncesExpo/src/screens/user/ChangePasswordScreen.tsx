// src/screens/user/ChangePasswordScreen.tsx
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
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ChangePasswordScreen = ({ navigation }) => {
    const { logout } = useAuth();

    const [formData, setFormData] = useState({
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmMotDePasse: '',
    });
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.ancienMotDePasse) {
            newErrors.ancienMotDePasse = 'L\'ancien mot de passe est requis';
        }

        if (!formData.nouveauMotDePasse) {
            newErrors.nouveauMotDePasse = 'Le nouveau mot de passe est requis';
        } else if (formData.nouveauMotDePasse.length < 6) {
            newErrors.nouveauMotDePasse = 'Minimum 6 caractères requis';
        }

        if (formData.nouveauMotDePasse !== formData.confirmMotDePasse) {
            newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
        }

        if (formData.ancienMotDePasse === formData.nouveauMotDePasse) {
            newErrors.nouveauMotDePasse = 'Le nouveau mot de passe doit être différent';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await api.post('/auth/change-password', {
                ancienMotDePasse: formData.ancienMotDePasse,
                nouveauMotDePasse: formData.nouveauMotDePasse,
            });

            if (response.data.success) {
                Alert.alert(
                    'Succès',
                    'Votre mot de passe a été modifié. Veuillez vous reconnecter.',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                await logout();
                            }
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error('❌ Change password error:', error);

            let errorMessage = 'Impossible de modifier le mot de passe';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 400) {
                errorMessage = 'Ancien mot de passe incorrect';
            }

            Alert.alert('Erreur', errorMessage);
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
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Icon name="lock" size={60} color="#0066CC" />
                    <Text style={styles.title}>Changer le mot de passe</Text>
                    <Text style={styles.subtitle}>
                        Vous serez déconnecté après le changement
                    </Text>
                </View>

                <View style={styles.form}>
                    {/* Ancien mot de passe */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Ancien mot de passe *</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.ancienMotDePasse && styles.inputError
                        ]}>
                            <Icon name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Votre mot de passe actuel"
                                value={formData.ancienMotDePasse}
                                onChangeText={(text) => handleInputChange('ancienMotDePasse', text)}
                                secureTextEntry={!showOldPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.passwordToggle}
                                onPress={() => setShowOldPassword(!showOldPassword)}
                            >
                                <Icon
                                    name={showOldPassword ? 'visibility' : 'visibility-off'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.ancienMotDePasse && (
                            <Text style={styles.errorText}>{errors.ancienMotDePasse}</Text>
                        )}
                    </View>

                    {/* Nouveau mot de passe */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nouveau mot de passe *</Text>
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
                                secureTextEntry={!showNewPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.passwordToggle}
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Icon
                                    name={showNewPassword ? 'visibility' : 'visibility-off'}
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
                        <Text style={styles.label}>Confirmer le mot de passe *</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.confirmMotDePasse && styles.inputError
                        ]}>
                            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Retapez le nouveau mot de passe"
                                value={formData.confirmMotDePasse}
                                onChangeText={(text) => handleInputChange('confirmMotDePasse', text)}
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
                        {errors.confirmMotDePasse && (
                            <Text style={styles.errorText}>{errors.confirmMotDePasse}</Text>
                        )}
                    </View>

                    {/* Bouton de soumission */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="check" size={20} color="#fff" />
                                <Text style={styles.submitButtonText}>Modifier le mot de passe</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Bouton annuler */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
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
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginVertical: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    form: {
        marginTop: 20,
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
    submitButton: {
        backgroundColor: '#0066CC',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 10,
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
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
});

export default ChangePasswordScreen;