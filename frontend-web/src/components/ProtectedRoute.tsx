// src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
    requireAuth?: boolean;
    showModal?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                           children,
                                                           fallback,
                                                           requireAuth = true,
                                                           showModal = false
                                                       }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Affichage pendant le chargement
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                margin: '1rem'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <div style={{ color: '#666' }}>Vérification de votre session...</div>
            </div>
        );
    }

    // Si authentification requise mais utilisateur non connecté
    if (requireAuth && !isAuthenticated) {
        // Si un fallback personnalisé est fourni
        if (fallback) {
            return <>{fallback}</>;
        }

        // Affichage par défaut
        return (
            <div style={{
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                borderRadius: '16px',
                padding: '3rem 2rem',
                textAlign: 'center',
                margin: '2rem auto',
                maxWidth: '500px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>

                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                }}>
                    Connexion requise
                </h2>

                <p style={{
                    color: '#6B7280',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    Vous devez être connecté pour accéder à cette fonctionnalité.
                    Créez un compte gratuitement ou connectez-vous pour continuer.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        style={{
                            background: '#0369a1',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem'
                        }}
                        onClick={() => {
                            // TODO: Ouvrir modal de connexion
                            console.log('🔄 Ouverture modal de connexion...');
                        }}
                    >
                        Se connecter
                    </button>

                    <button
                        style={{
                            background: '#10B981',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem'
                        }}
                        onClick={() => {
                            // TODO: Ouvrir modal d'inscription
                            console.log('🔄 Ouverture modal d\'inscription...');
                        }}
                    >
                        S'inscrire
                    </button>
                </div>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                    <h4 style={{
                        margin: '0 0 0.5rem 0',
                        color: '#0369a1',
                        fontSize: '1rem'
                    }}>
                        🎁 Avantages de l'inscription
                    </h4>
                    <ul style={{
                        margin: 0,
                        padding: 0,
                        listStyle: 'none',
                        fontSize: '0.9rem',
                        color: '#4B5563'
                    }}>
                        <li>✅ Publier vos annonces gratuitement</li>
                        <li>✅ Gérer vos favoris</li>
                        <li>✅ Suivre vos annonces</li>
                        <li>✅ Recevoir des notifications</li>
                    </ul>
                </div>
            </div>
        );
    }

    // Si utilisateur connecté ou si auth pas requise, afficher le contenu
    return <>{children}</>;
};

export default ProtectedRoute;