// src/components/RegisterModal.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authUtils, authApi } from '../services/authApi';
import { cityApi } from '../services/api';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onSwitchToLogin
                                                     }) => {
    const { register, isLoading, error, clearError } = useAuth();

    // États du formulaire
    const [formData, setFormData] = useState({
        nom: '',
        telephone: '',
        motDePasse: '',
        confirmPassword: '',
        ville: '',
        quartier: ''
    });

    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
    const [checkingPhone, setCheckingPhone] = useState(false);

    // Données pour les sélecteurs
    const [cities, setCities] = useState<any[]>([]);
    const [quartiers, setQuartiers] = useState<any[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingQuartiers, setLoadingQuartiers] = useState(false);

    // Charger les villes au montage
    useEffect(() => {
        if (isOpen) {
            loadCities();
        }
    }, [isOpen]);

    // Charger les quartiers quand la ville change
    useEffect(() => {
        if (formData.ville) {
            loadQuartiers(formData.ville);
        } else {
            setQuartiers([]);
        }
    }, [formData.ville]);

    // Vérifier la disponibilité du téléphone
    useEffect(() => {
        const checkPhoneAvailability = async () => {
            if (formData.telephone && authUtils.isValidCameroonPhone(formData.telephone)) {
                setCheckingPhone(true);
                try {
                    const formatted = authUtils.formatCameroonPhone(formData.telephone);
                    const available = await authApi.checkPhoneAvailability(formatted);
                    setPhoneAvailable(available);
                } catch (error) {
                    console.error('Erreur vérification téléphone:', error);
                    setPhoneAvailable(null);
                } finally {
                    setCheckingPhone(false);
                }
            } else {
                setPhoneAvailable(null);
            }
        };

        const timeoutId = setTimeout(checkPhoneAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [formData.telephone]);

    // Charger les villes
    const loadCities = async () => {
        setLoadingCities(true);
        try {
            const response = await cityApi.getAll();
            if (response.success) {
                setCities(response.cities);
            }
        } catch (error) {
            console.error('Erreur chargement villes:', error);
        } finally {
            setLoadingCities(false);
        }
    };

    // Charger les quartiers
    const loadQuartiers = async (ville: string) => {
        setLoadingQuartiers(true);
        try {
            const response = await cityApi.getQuartiersByName(ville);
            if (response.success) {
                setQuartiers(response.quartiers);
            }
        } catch (error) {
            console.error('Erreur chargement quartiers:', error);
            setQuartiers([]);
        } finally {
            setLoadingQuartiers(false);
        }
    };

    // Réinitialiser le formulaire
    const resetForm = () => {
        setFormData({
            nom: '',
            telephone: '',
            motDePasse: '',
            confirmPassword: '',
            ville: '',
            quartier: ''
        });
        setFormErrors({});
        setPhoneAvailable(null);
        clearError();
    };

    // Fermer le modal
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Gestion des changements de formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Réinitialiser quartier si ville change
        if (name === 'ville') {
            setFormData(prev => ({ ...prev, quartier: '' }));
        }

        // Effacer l'erreur du champ modifié
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        clearError();
    };

    // Validation du formulaire
    const validateForm = (): boolean => {
        const errors: {[key: string]: string} = {};

        // Validation nom
        if (!formData.nom.trim()) {
            errors.nom = 'Le nom est requis';
        } else if (formData.nom.trim().length < 2) {
            errors.nom = 'Le nom doit contenir au moins 2 caractères';
        }

        // Validation téléphone
        if (!formData.telephone.trim()) {
            errors.telephone = 'Le numéro de téléphone est requis';
        } else if (!authUtils.isValidCameroonPhone(formData.telephone)) {
            errors.telephone = 'Format invalide (ex: 237698123456)';
        } else if (phoneAvailable === false) {
            errors.telephone = 'Ce numéro est déjà utilisé';
        }

        // Validation mot de passe
        const passwordValidation = authUtils.isValidPassword(formData.motDePasse);
        if (!passwordValidation.valid) {
            errors.motDePasse = passwordValidation.message || 'Mot de passe invalide';
        }

        // Confirmation mot de passe
        if (formData.motDePasse !== formData.confirmPassword) {
            errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || phoneAvailable === false) return;

        try {
            const formattedPhone = authUtils.formatCameroonPhone(formData.telephone);
            await register({
                nom: formData.nom.trim(),
                telephone: formattedPhone,
                motDePasse: formData.motDePasse,
                ville: formData.ville || undefined,
                quartier: formData.quartier || undefined
            });

            // Succès - fermer le modal
            handleClose();
        } catch (error) {
            // L'erreur est gérée par le Context
            console.error('Erreur d\'inscription:', error);
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
                maxWidth: '450px',
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
                        color: '#10B981'
                    }}>
                        📝 Inscription Gratuite
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
                    {/* Champ nom */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            👤 Nom complet *
                        </label>
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleInputChange}
                            placeholder="Votre nom complet"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `2px solid ${formErrors.nom ? '#ef4444' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                        {formErrors.nom && (
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#ef4444' }}>
                                {formErrors.nom}
                            </p>
                        )}
                    </div>

                    {/* Champ téléphone avec vérification */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            📱 Numéro de téléphone *
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleInputChange}
                                placeholder="237698123456"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    paddingRight: '3rem',
                                    border: `2px solid ${
                                        formErrors.telephone ? '#ef4444' :
                                            phoneAvailable === true ? '#10B981' :
                                                phoneAvailable === false ? '#ef4444' : '#e5e7eb'
                                    }`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                right: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '1rem'
                            }}>
                                {checkingPhone ? '⏳' :
                                    phoneAvailable === true ? '✅' :
                                        phoneAvailable === false ? '❌' : ''}
                            </div>
                        </div>
                        {formErrors.telephone && (
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#ef4444' }}>
                                {formErrors.telephone}
                            </p>
                        )}
                        {phoneAvailable === true && (
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#10B981' }}>
                                ✅ Numéro disponible
                            </p>
                        )}
                    </div>

                    {/* Champs mot de passe */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                🔒 Mot de passe *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="motDePasse"
                                    value={formData.motDePasse}
                                    onChange={handleInputChange}
                                    placeholder="Min. 6 caractères"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        paddingRight: '2.5rem',
                                        border: `2px solid ${formErrors.motDePasse ? '#ef4444' : '#e5e7eb'}`,
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
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {formErrors.motDePasse && (
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: '#ef4444' }}>
                                    {formErrors.motDePasse}
                                </p>
                            )}
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                🔒 Confirmer *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Répéter"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        paddingRight: '2.5rem',
                                        border: `2px solid ${formErrors.confirmPassword ? '#ef4444' : '#e5e7eb'}`,
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {formErrors.confirmPassword && (
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: '#ef4444' }}>
                                    {formErrors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Champs localisation */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                🏙️ Ville
                            </label>
                            <select
                                name="ville"
                                value={formData.ville}
                                onChange={handleInputChange}
                                disabled={loadingCities}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: loadingCities ? '#f3f4f6' : 'white',
                                    cursor: loadingCities ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <option value="">
                                    {loadingCities ? 'Chargement...' : 'Choisir une ville'}
                                </option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.nom}>
                                        {city.nom} ({city.region})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                📍 Quartier
                            </label>
                            <select
                                name="quartier"
                                value={formData.quartier}
                                onChange={handleInputChange}
                                disabled={!formData.ville || loadingQuartiers}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: (!formData.ville || loadingQuartiers) ? '#f3f4f6' : 'white',
                                    cursor: (!formData.ville || loadingQuartiers) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <option value="">
                                    {!formData.ville ? 'Choisir d\'abord une ville' :
                                        loadingQuartiers ? 'Chargement...' :
                                            'Choisir un quartier'}
                                </option>
                                {quartiers.map(quartier => (
                                    <option key={quartier.id} value={quartier.nom}>
                                        {quartier.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Information gratuite */}
                    <div style={{
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1rem' }}>🎁</span>
                            <span style={{ fontWeight: '600', color: '#065f46' }}>Inscription 100% gratuite</span>
                        </div>
                        <ul style={{
                            margin: 0,
                            paddingLeft: '1rem',
                            fontSize: '0.8rem',
                            color: '#047857'
                        }}>
                            <li>✅ Publier des annonces gratuitement</li>
                            <li>✅ Gérer vos favoris</li>
                            <li>✅ Suivre vos annonces</li>
                            <li>✅ Contact direct par WhatsApp</li>
                        </ul>
                    </div>

                    {/* Bouton d'inscription */}
                    <button
                        type="submit"
                        disabled={isLoading || phoneAvailable === false}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            backgroundColor: (isLoading || phoneAvailable === false) ? '#94a3b8' : '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: (isLoading || phoneAvailable === false) ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            marginBottom: '1rem'
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading && phoneAvailable !== false) {
                                e.currentTarget.style.backgroundColor = '#059669';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isLoading && phoneAvailable !== false) {
                                e.currentTarget.style.backgroundColor = '#10B981';
                            }
                        }}
                    >
                        {isLoading ? '⏳ Inscription...' : '📝 Créer mon compte gratuit'}
                    </button>

                    {/* Lien vers connexion */}
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
                            Déjà un compte ?
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                handleClose();
                                onSwitchToLogin?.();
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
                            🔑 Se connecter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;