// src/components/LoginModal.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authUtils } from '../services/authApi';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   onSwitchToRegister
                                               }) => {
    const { login, isLoading, error, clearError } = useAuth();

    // États du formulaire
    const [formData, setFormData] = useState({
        telephone: '',
        motDePasse: ''
    });

    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const [showPassword, setShowPassword] = useState(false);

    // Réinitialiser le formulaire
    const resetForm = () => {
        setFormData({ telephone: '', motDePasse: '' });
        setFormErrors({});
        clearError();
    };

    // Fermer le modal
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Gestion des changements de formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Effacer l'erreur du champ modifié
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        clearError();
    };

    // Validation du formulaire
    const validateForm = (): boolean => {
        const errors: {[key: string]: string} = {};

        // Validation téléphone
        if (!formData.telephone.trim()) {
            errors.telephone = 'Le numéro de téléphone est requis';
        } else if (!authUtils.isValidCameroonPhone(formData.telephone)) {
            errors.telephone = 'Format invalide (ex: 237698123456)';
        }

        // Validation mot de passe
        if (!formData.motDePasse.trim()) {
            errors.motDePasse = 'Le mot de passe est requis';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const formattedPhone = authUtils.formatCameroonPhone(formData.telephone);
            await login({
                telephone: formattedPhone,
                motDePasse: formData.motDePasse
            });

            // Succès - fermer le modal
            handleClose();
        } catch (error) {
            // L'erreur est gérée par le Context
            console.error('Erreur de connexion:', error);
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
                        color: '#0369a1'
                    }}>
                        🔑 Connexion
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

                {/* Message d'erreur général */}
                {error && (
                    <div style={{
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ color: '#dc2626', fontSize: '1rem' }}>⚠️</span>
                        <span style={{ color: '#dc2626', fontSize: '0.9rem' }}>{error}</span>
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                    {/* Champ téléphone */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            📱 Numéro de téléphone
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
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => {
                                if (!formErrors.telephone) {
                                    e.target.style.borderColor = '#0369a1';
                                }
                            }}
                            onBlur={(e) => {
                                if (!formErrors.telephone) {
                                    e.target.style.borderColor = '#e5e7eb';
                                }
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

                    {/* Champ mot de passe */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            🔒 Mot de passe
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="motDePasse"
                                value={formData.motDePasse}
                                onChange={handleInputChange}
                                placeholder="Votre mot de passe"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    paddingRight: '3rem',
                                    border: `2px solid ${formErrors.motDePasse ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => {
                                    if (!formErrors.motDePasse) {
                                        e.target.style.borderColor = '#0369a1';
                                    }
                                }}
                                onBlur={(e) => {
                                    if (!formErrors.motDePasse) {
                                        e.target.style.borderColor = '#e5e7eb';
                                    }
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
                                    fontSize: '1rem',
                                    color: '#666'
                                }}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {formErrors.motDePasse && (
                            <p style={{
                                margin: '0.25rem 0 0 0',
                                fontSize: '0.8rem',
                                color: '#ef4444'
                            }}>
                                {formErrors.motDePasse}
                            </p>
                        )}
                    </div>

                    {/* Bouton de connexion */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            backgroundColor: isLoading ? '#94a3b8' : '#0369a1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            marginBottom: '1rem'
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.backgroundColor = '#0284c7';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.backgroundColor = '#0369a1';
                            }
                        }}
                    >
                        {isLoading ? '⏳ Connexion...' : '🔑 Se connecter'}
                    </button>

                    {/* Lien vers inscription */}
                    <div style={{
                        textAlign: 'center',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <p style={{
                            margin: '0 0 0.5rem 0',
                            color: '#666',
                            fontSize: '0.9rem'
                        }}>
                            Pas encore de compte ?
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                handleClose();
                                onSwitchToRegister?.();
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#0369a1',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                textDecoration: 'underline'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#0369a1'}
                        >
                            📝 Créer un compte gratuitement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;