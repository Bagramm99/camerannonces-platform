// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, authUtils, tokenStorage } from '../services/authApi';

// ============================================
// IMPORTS DES TYPES (séparés pour éviter les conflits)
// ============================================
import type {
    User,
    LoginRequest,
    RegisterRequest
} from '../services/authApi';

// ============================================
// TYPES DU CONTEXT
// ============================================

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
}

type AuthContextType = AuthState & AuthActions;

// ============================================
// CRÉATION DU CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER DU CONTEXT
// ============================================

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // État local
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true, // true au démarrage pour vérifier le token
        error: null,
    });

    // ============================================
    // FONCTIONS D'AIDE
    // ============================================

    const setLoading = (isLoading: boolean) => {
        setState(prev => ({ ...prev, isLoading }));
    };

    const setError = (error: string | null) => {
        setState(prev => ({ ...prev, error }));
    };

    const setUser = (user: User | null) => {
        setState(prev => ({
            ...prev,
            user,
            isAuthenticated: !!user,
            error: null
        }));
    };

    // ============================================
    // ACTIONS D'AUTHENTIFICATION
    // ============================================

    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Context: Tentative de connexion...');

            const response = await authApi.login(credentials);
            setUser(response.user);

            console.log('✅ Context: Connexion réussie');
        } catch (error: any) {
            console.error('❌ Context: Erreur de connexion:', error);
            setError(error.message);
            throw error; // Re-throw pour que le composant puisse gérer l'erreur
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterRequest): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Context: Tentative d\'inscription...');

            const response = await authApi.register(userData);
            setUser(response.user);

            console.log('✅ Context: Inscription réussie');
        } catch (error: any) {
            console.error('❌ Context: Erreur d\'inscription:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            setLoading(true);

            console.log('🔄 Context: Déconnexion...');

            await authApi.logout();
            setUser(null);

            console.log('✅ Context: Déconnexion réussie');
        } catch (error: any) {
            console.error('❌ Context: Erreur de déconnexion:', error);
            // Même en cas d'erreur, on déconnecte localement
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async (): Promise<void> => {
        try {
            if (!authUtils.isAuthenticated()) {
                setUser(null);
                return;
            }

            console.log('🔄 Context: Rafraîchissement du profil...');

            const user = await authApi.getProfile();
            setUser(user);

            console.log('✅ Context: Profil rafraîchi');
        } catch (error: any) {
            console.error('❌ Context: Erreur rafraîchissement profil:', error);
            // Si erreur, probablement token invalide
            setUser(null);
            tokenStorage.clearTokens();
        }
    };

    const clearError = () => {
        setError(null);
    };

    // ============================================
    // INITIALISATION AU DÉMARRAGE
    // ============================================

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                console.log('🔄 Context: Initialisation de l\'authentification...');

                // Vérifier s'il y a un utilisateur en localStorage
                const storedUser = tokenStorage.getUser();
                const hasToken = authUtils.isAuthenticated();

                if (storedUser && hasToken) {
                    console.log('👤 Context: Utilisateur trouvé en localStorage:', storedUser.nom);

                    // Vérifier que le token est toujours valide
                    try {
                        await refreshUser();
                    } catch (error) {
                        console.warn('⚠️ Context: Token invalide, nettoyage...');
                        tokenStorage.clearTokens();
                        setUser(null);
                    }
                } else {
                    console.log('🚫 Context: Aucun utilisateur connecté');
                    setUser(null);
                }
            } catch (error) {
                console.error('❌ Context: Erreur d\'initialisation:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // ============================================
    // ÉCOUTER LES ÉVÉNEMENTS DE DÉCONNEXION AUTOMATIQUE
    // ============================================

    useEffect(() => {
        const handleAutoLogout = (event: CustomEvent) => {
            console.log('🔐 Context: Déconnexion automatique détectée:', event.detail.reason);
            setUser(null);
            setError('Session expirée, veuillez vous reconnecter');
        };

        // Écouter les événements de déconnexion automatique (depuis api.ts)
        window.addEventListener('auth:logout' as any, handleAutoLogout);

        return () => {
            window.removeEventListener('auth:logout' as any, handleAutoLogout);
        };
    }, []);

    // ============================================
    // VALEUR DU CONTEXT
    // ============================================

    const contextValue: AuthContextType = {
        // État
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,

        // Actions
        login,
        register,
        logout,
        refreshUser,
        clearError,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// ============================================
// HOOK POUR UTILISER LE CONTEXT
// ============================================

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }

    return context;
};

// ============================================
// HOC POUR PROTÉGER LES COMPOSANTS
// ============================================

interface WithAuthProps {
    fallback?: React.ComponentType;
}

export const withAuth = <P extends object>(
    Component: React.ComponentType<P>,
    options?: WithAuthProps
) => {
    return (props: P) => {
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px'
                }}>
                    <div>⏳ Chargement...</div>
                </div>
            );
        }

        if (!isAuthenticated) {
            if (options?.fallback) {
                const FallbackComponent = options.fallback;
                return <FallbackComponent />;
            }

            return (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    margin: '1rem'
                }}>
                    <h3>🔐 Accès restreint</h3>
                    <p>Vous devez être connecté pour accéder à cette page.</p>
                    <button
                        style={{
                            background: '#0369a1',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                        onClick={() => window.location.reload()}
                    >
                        Se connecter
                    </button>
                </div>
            );
        }

        return <Component {...props} />;
    };
};

export default AuthContext;