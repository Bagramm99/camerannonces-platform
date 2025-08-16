// src/components/ForgotPasswordModal.tsx
import React, { useState } from 'react';
import { authUtils } from '../services/authApi';
import { authApi } from '../services/authApi';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToLogin?: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     onBackToLogin
                                                                 }) => {
    const [step, setStep] = useState<'phone' | 'reset' | 'success'>('phone');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        telephone: '',
        nouveauMotDePasse: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const [showPassword, setShowPassword] = useState(false);

    // Réinitialiser le modal
    const resetModal = () => {
        setStep('phone');
        setFormData({ telephone: '', nouveauMotDePasse: '', confirmPassword: '' });
        setFormErrors({});
        setShowPassword(false);
    };

    // Fermer le modal
    const handleClose = () => {
        resetModal();
        onClose();
    };

    // Gestion des changements
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Effacer l'erreur du champ
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Étape 1 : Vérifier le téléphone
    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors: {[key: string]: string} = {};

        if (!formData.telephone.trim()) {
            errors.telephone = 'Le numéro de téléphone est requis';
        } else if (!authUtils.isValidCameroonPhone(formData.telephone)) {
            errors.telephone = 'Format invalide (ex: 237698123456)';
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setLoading(true);
        try {
            // Simuler vérification (en vrai, vérifier si le téléphone existe)
            const formatted = authUtils.formatCameroonPhone(formData.telephone);

            // Pour l'instant, on simule que le téléphone existe
            // En production, vous feriez un appel API pour vérifier
            await new Promise(resolve => setTimeout(resolve, 1000));

            setStep('reset');
        } catch (error) {
            setFormErrors({ telephone: 'Numéro non trouvé dans notre base' });
        } finally {
            setLoading(false);
        }
    };

    // Étape 2 : Réinitialiser le mot de passe
    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors: {[key: string]: string} = {};

        const passwordValidation = authUtils.isValidPassword(formData.nouveauMotDePasse);
        if (!passwordValidation.valid) {
            errors.nouveauMotDePasse = passwordValidation.message || 'Mot de passe invalide';
        }

        if (formData.nouveauMotDePasse !== formData.confirmPassword) {
            errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setLoading(true);
        try {
            // Appel API de réinitialisation
            // await authApi.resetPassword(formData.telephone, formData.nouveauMotDePasse);

            // Pour l'instant, on simule la réinitialisation
            await new Promise(resolve => setTimeout(resolve, 1500));

            setStep('success');
        } catch (error) {
            setFormErrors({ nouveauMotDePasse: 'Erreur lors de la réinitialisation' });
        } finally {
            setLoading(false);
        }
    };

    // Ne pas afficher si fermé
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#dc2626'
                    }}>
                        🔓 Mot de passe oublié
                    </h2>

                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '0.5rem',
                            borderRadius: '6px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        ✕
                    </button>
                </div>

                {/* Étape 1 : Saisie téléphone */}
                {step === 'phone' && (
                    <form onSubmit={handlePhoneSubmit}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            backgroundColor: '#fef3c7',
                            borderRadius: '8px',
                            border: '1px solid #fbbf24'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                            <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>
                                Entrez votre numéro de téléphone pour réinitialiser votre mot de passe
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                📱 Votre numéro de téléphone
                            </label>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleInputChange}
                                placeholder="237698123456"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: `2px solid ${formErrors.telephone ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                            {formErrors.telephone && (
                                <p style={{
                                    margin: '0.25rem 0 0 0',
                                    fontSize: '0.8rem',
                                    color: '#ef4444'
                                }}>
                                    {formErrors.telephone}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: loading ? '#94a3b8' : '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginBottom: '1rem'
                            }}
                        >
                            {loading ? '⏳ Vérification...' : '🔍 Vérifier le numéro'}
                        </button>
                    </form>
                )}

                {/* Étape 2 : Nouveau mot de passe */}
                {step === 'reset' && (
                    <form onSubmit={handleResetSubmit}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            backgroundColor: '#dbeafe',
                            borderRadius: '8px',
                            border: '1px solid #3b82f6'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                            <p style={{ margin: 0, color: '#1e40af', fontSize: '0.9rem' }}>
                                Numéro vérifié ! Choisissez un nouveau mot de passe sécurisé
                            </p>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                🔒 Nouveau mot de passe
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="nouveauMotDePasse"
                                    value={formData.nouveauMotDePasse}
                                    onChange={handleInputChange}
                                    placeholder="Minimum 6 caractères"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        paddingRight: '3rem',
                                        border: `2px solid ${formErrors.nouveauMotDePasse ? '#ef4444' : '#e5e7eb'}`,
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {formErrors.nouveauMotDePasse && (
                                <p style={{
                                    margin: '0.25rem 0 0 0',
                                    fontSize: '0.8rem',
                                    color: '#ef4444'
                                }}>
                                    {formErrors.nouveauMotDePasse}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                🔒 Confirmer le mot de passe
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Répéter le mot de passe"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: `2px solid ${formErrors.confirmPassword ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                            {formErrors.confirmPassword && (
                                <p style={{
                                    margin: '0.25rem 0 0 0',
                                    fontSize: '0.8rem',
                                    color: '#ef4444'
                                }}>
                                    {formErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: loading ? '#94a3b8' : '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginBottom: '1rem'
                            }}
                        >
                            {loading ? '⏳ Réinitialisation...' : '✅ Réinitialiser le mot de passe'}
                        </button>
                    </form>
                )}

                {/* Étape 3 : Succès */}
                {step === 'success' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '1rem'
                        }}>
                            🎉
                        </div>

                        <h3 style={{
                            color: '#059669',
                            marginBottom: '1rem'
                        }}>
                            Mot de passe réinitialisé !
                        </h3>

                        <p style={{
                            color: '#666',
                            marginBottom: '2rem',
                            lineHeight: '1.6'
                        }}>
                            Votre mot de passe a été mis à jour avec succès.
                            Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                        </p>

                        <button
                            onClick={() => {
                                handleClose();
                                onBackToLogin?.();
                            }}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                backgroundColor: '#059669',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            🔑 Aller à la connexion
                        </button>
                    </div>
                )}

                {/* Retour à la connexion */}
                {step !== 'success' && (
                    <div style={{
                        textAlign: 'center',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <button
                            type="button"
                            onClick={() => {
                                handleClose();
                                onBackToLogin?.();
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#0369a1',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                textDecoration: 'underline'
                            }}
                        >
                            ← Retour à la connexion
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;