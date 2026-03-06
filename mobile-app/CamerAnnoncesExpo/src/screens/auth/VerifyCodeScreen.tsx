// src/screens/auth/VerifyCodeScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { authService } from '../../services/authService';

// @ts-ignore
const VerifyCodeScreen = ({ route, navigation }) => {
    const { telephone, email, countryCode, verificationType } = route.params;

    // ✅ Bestimme Verifizierungstyp (SMS oder Email)
    const isSmsVerification = verificationType === 'sms';

    const [code, setCode] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [sendingSms, setSendingSms] = useState(false);
    const [timer, setTimer] = useState(240); // 4 Minuten für beide
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<Array<TextInput | null>>([]);

    // ✅ Bei SMS: Automatisch Code senden beim Start
    useEffect(() => {
        if (isSmsVerification) {
            sendInitialSms();
        }
    }, []);

    const sendInitialSms = async () => {
        setSendingSms(true);
        try {
            await authService.sendSmsVerification(telephone);
            console.log('✅ SMS initial envoyé');
        } catch (error: any) {
            console.error('❌ SMS initial error:', error);
            Alert.alert(
                'Erreur SMS',
                error.message || 'Impossible d\'envoyer le SMS',
                [
                    {
                        text: 'Réessayer',
                        onPress: sendInitialSms
                    },
                    {
                        text: 'Annuler',
                        onPress: () => navigation.goBack(),
                        style: 'cancel'
                    }
                ]
            );
        } finally {
            setSendingSms(false);
        }
    };

    // Timer für Resend
    useEffect(() => {
        if (timer > 0 && !sendingSms) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setCanResend(true);
        }
    }, [timer, sendingSms]);

    const handleCodeChange = (text: string, index: number) => {
        // Nur Zahlen erlauben
        const numericText = text.replace(/[^0-9]/g, '');

        if (numericText.length > 1) {
            // Paste-Funktion: Gesamten Code einfügen
            const digits = numericText.slice(0, 4).split('');
            const newCode = [...code];
            digits.forEach((digit, i) => {
                if (i < 4) {
                    newCode[i] = digit;
                }
            });
            setCode(newCode);

            // Fokus auf letztes Feld oder nächstes leeres
            const nextEmpty = newCode.findIndex(c => c === '');
            if (nextEmpty !== -1) {
                inputRefs.current[nextEmpty]?.focus();
            } else {
                inputRefs.current[3]?.blur();
            }
        } else {
            // Einzelne Ziffer
            const newCode = [...code];
            newCode[index] = numericText;
            setCode(newCode);

            // Auto-focus nächstes Feld
            if (numericText && index < 3) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join('');

        if (fullCode.length !== 4) {
            Alert.alert('Erreur', 'Veuillez entrer le code complet à 4 chiffres');
            return;
        }

        setLoading(true);
        try {
            // ✅ Unterscheide zwischen SMS und Email Verifizierung
            if (isSmsVerification) {
                await authService.verifySms(telephone, fullCode);
                Alert.alert(
                    'Vérification réussie !',
                    'Votre numéro de téléphone a été vérifié avec succès.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            } else {
                await authService.verifyCode(telephone, fullCode);
                Alert.alert(
                    'Vérification réussie !',
                    'Votre email a été vérifié avec succès.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error('❌ Verify error:', error);
            Alert.alert('Erreur', error.message || 'Code invalide');
            // Code zurücksetzen
            setCode(['', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        setResending(true);
        try {
            // ✅ Unterscheide zwischen SMS und Email Resend
            if (isSmsVerification) {
                await authService.sendSmsVerification(telephone);
                Alert.alert('SMS renvoyé', 'Un nouveau code SMS a été envoyé');
            } else {
                await authService.resendCode(telephone);
                Alert.alert('Email renvoyé', 'Un nouveau code a été envoyé à votre email');
            }
            setTimer(240); // 4 Minuten
            setCanResend(false);
        } catch (error: any) {
            console.error('❌ Resend error:', error);
            Alert.alert('Erreur', error.message || 'Impossible de renvoyer le code');
        } finally {
            setResending(false);
        }
    };

    // ✅ Format Timer (mm:ss)
    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // ✅ SMS wird gerade gesendet
    if (sendingSms) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={styles.loadingText}>Envoi du SMS...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                {/* Header */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#0066CC" />
                </TouchableOpacity>

                <View style={styles.header}>
                    {/* ✅ Icon basierend auf Typ */}
                    <Icon
                        name={isSmsVerification ? "sms" : "mail-outline"}
                        size={80}
                        color="#0066CC"
                    />
                    {/* ✅ Title basierend auf Typ */}
                    <Text style={styles.title}>
                        {isSmsVerification ? 'Vérification SMS' : 'Vérification Email'}
                    </Text>
                    {/* ✅ Subtitle basierend auf Typ */}
                    <Text style={styles.subtitle}>
                        {isSmsVerification
                            ? 'Nous avons envoyé un code à 4 chiffres au'
                            : 'Nous avons envoyé un code à 4 chiffres à'}
                    </Text>
                    <Text style={styles.contactInfo}>
                        {isSmsVerification
                            ? `${countryCode} ${telephone.slice(-9)}`
                            : email}
                    </Text>
                    <Text style={styles.expiryText}>
                        ⏱️ Code valable pendant 4 minutes
                    </Text>
                </View>

                {/* Code Input */}
                <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => inputRefs.current[index] = ref}
                            style={[
                                styles.codeInput,
                                digit !== '' && styles.codeInputFilled
                            ]}
                            value={digit}
                            onChangeText={(text) => handleCodeChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                    style={[
                        styles.verifyButton,
                        (loading || code.join('').length !== 4) && styles.verifyButtonDisabled
                    ]}
                    onPress={handleVerify}
                    disabled={loading || code.join('').length !== 4}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Icon name="check-circle" size={20} color="#fff" />
                            <Text style={styles.verifyButtonText}>Vérifier le code</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Resend Section */}
                <View style={styles.resendSection}>
                    <Text style={styles.resendText}>
                        {isSmsVerification
                            ? 'Vous n\'avez pas reçu le SMS ?'
                            : 'Vous n\'avez pas reçu l\'email ?'}
                    </Text>
                    {canResend ? (
                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={handleResend}
                            disabled={resending}
                        >
                            {resending ? (
                                <ActivityIndicator size="small" color="#0066CC" />
                            ) : (
                                <Text style={styles.resendButtonText}>Renvoyer le code</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.timerText}>
                            Renvoyer dans {formatTimer(timer)}
                        </Text>
                    )}
                </View>

                {/* Skip Option */}
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.skipButtonText}>
                        Vérifier plus tard
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 5,
    },
    contactInfo: {
        fontSize: 16,
        color: '#0066CC',
        fontWeight: '600',
        marginBottom: 10,
    },
    expiryText: {
        fontSize: 14,
        color: '#FF9800',
        fontStyle: 'italic',
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 30,
    },
    codeInput: {
        width: 60,
        height: 70,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 12,
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        backgroundColor: '#f8f9fa',
    },
    codeInputFilled: {
        borderColor: '#0066CC',
        backgroundColor: '#e6f0ff',
    },
    verifyButton: {
        backgroundColor: '#0066CC',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 30,
    },
    verifyButtonDisabled: {
        opacity: 0.5,
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    resendSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    resendText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    resendButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    resendButtonText: {
        color: '#0066CC',
        fontSize: 16,
        fontWeight: '600',
    },
    timerText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    skipButtonText: {
        color: '#999',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default VerifyCodeScreen;