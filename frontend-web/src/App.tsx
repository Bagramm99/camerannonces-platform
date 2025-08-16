import { useState, useEffect } from 'react'
import { testApi, categoryApi, cityApi } from './services/api'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import ForgotPasswordModal from './components/ForgotPasswordModal'
import './App.css'

function App() {
    const [selectedCity, setSelectedCity] = useState('Toutes les villes')
    const [searchQuery, setSearchQuery] = useState('')
    const [apiTest, setApiTest] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    // 🆕 États pour les modals
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)

    // 🆕 États pour les données dynamiques
    const [categories, setCategories] = useState<any[]>([])
    const [cities, setCities] = useState<string[]>(['Toutes les villes'])
    const [regions, setRegions] = useState<string[]>([])
    const [isDataLoaded, setIsDataLoaded] = useState(false)

    // 🆕 Utiliser le context d'authentification
    const {
        user,
        isAuthenticated,
        isLoading: authLoading,
        error: authError,
        login,
        register,
        logout,
        clearError
    } = useAuth()

    // 🆕 Charger les données au démarrage
    useEffect(() => {
        loadInitialData()
    }, [])

    const loadInitialData = async () => {
        try {
            console.log('🔄 Chargement des données initiales...')

            // Charger les catégories avec compteurs
            const categoriesResponse = await categoryApi.getAllWithCount()
            if (categoriesResponse.success && categoriesResponse.categoriesWithCount) {
                const formattedCategories = categoriesResponse.categoriesWithCount.map((cat: any, index: number) => ({
                    id: cat.id,
                    name: cat.nom,
                    icon: getIconForCategory(cat.nom, index),
                    count: cat.nombreAnnonces || 0,
                    color: getCategoryColor(index)
                }))
                setCategories(formattedCategories)
                console.log('✅ Catégories chargées:', formattedCategories.length)
            }

            // Charger les villes
            const citiesResponse = await cityApi.getAll()
            if (citiesResponse.success && citiesResponse.cities) {
                const cityNames = ['Toutes les villes', ...citiesResponse.cities.map((city: any) => city.nom)]
                setCities(cityNames)
                console.log('✅ Villes chargées:', cityNames.length)
            }

            // Charger les régions
            const regionsResponse = await cityApi.getRegions()
            if (regionsResponse.success && regionsResponse.regions) {
                setRegions(regionsResponse.regions)
                console.log('✅ Régions chargées:', regionsResponse.regions.length)
            }

            setIsDataLoaded(true)
            console.log('🎉 Toutes les données initiales chargées avec succès !')

        } catch (error) {
            console.error('❌ Erreur lors du chargement initial:', error)
        }
    }

    // 🎨 Fonction pour assigner des icônes aux catégories
    const getIconForCategory = (nom: string, index: number) => {
        const iconMap: { [key: string]: string } = {
            'téléphones': '📱',
            'vehicules': '🚗',
            'immobilier': '🏠',
            'mode': '👗',
            'emploi': '💼',
            'electronique': '💻',
            'mariage': '🎉',
            'service': '🛠️',
            'agriculture': '🐔',
            'education': '📚',
            'alimentation': '🍖',
            'autres': '📦'
        }

        const nomLower = nom.toLowerCase()
        for (const [key, icon] of Object.entries(iconMap)) {
            if (nomLower.includes(key)) {
                return icon
            }
        }

        // Icônes par défaut basées sur l'index
        const defaultIcons = ['📱', '🚗', '🏠', '👗', '💼', '💻', '🎉', '🛠️', '🐔', '📚', '🍖', '📦']
        return defaultIcons[index % defaultIcons.length]
    }

    // 🎨 Fonction pour assigner des couleurs aux catégories
    const getCategoryColor = (index: number) => {
        const colors = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
            '#06B6D4', '#8B5CF6', '#84CC16', '#6366F1',
            '#059669', '#EC4899', '#F97316', '#64748B'
        ]
        return colors[index % colors.length]
    }

    // Fonction de test de l'API de base
    const testBackendConnection = async () => {
        setLoading(true)
        try {
            const result = await testApi.hello()
            setApiTest(result)
            console.log('✅ Backend connecté:', result)
        } catch (error) {
            console.error('❌ Erreur backend:', error)
            setApiTest({ error: 'Impossible de se connecter au backend' })
        } finally {
            setLoading(false)
        }
    }

    // 🆕 Fonctions de gestion des modals
    const openLoginModal = () => {
        setShowLoginModal(true)
        setShowRegisterModal(false)
    }

    const openRegisterModal = () => {
        setShowRegisterModal(true)
        setShowLoginModal(false)
    }

    const closeModals = () => {
        setShowLoginModal(false)
        setShowRegisterModal(false)
        setShowForgotPasswordModal(false)
    }

    const openForgotPasswordModal = () => {
        setShowForgotPasswordModal(true)
        setShowLoginModal(false)
        setShowRegisterModal(false)
    }

    // 🆕 Nouvelles fonctions utilisant le Context (pour les tests)
    const testContextLogin = async () => {
        setLoading(true)
        try {
            await login({
                telephone: '237655444333',  // ✅ Corrigé
                motDePasse: 'password123'
            })

            setApiTest({
                success: true,
                message: `✅ Connexion Context réussie pour ${user?.nom}`,
                data: {
                    user: user?.nom,
                    authenticated: isAuthenticated,
                    fromContext: true
                }
            })
        } catch (error: any) {
            setApiTest({
                error: `Context Login: ${error.message}`,
                data: { fromContext: true }
            })
        } finally {
            setLoading(false)
        }
    }

    const testContextRegister = async () => {
        setLoading(true)
        try {
            await register({
                nom: 'Test Context User 3',      // Nom différent
                telephone: '237777888999',       // ✅ Nouveau numéro
                motDePasse: 'password123',
                ville: 'Yaoundé',
                quartier: 'Bastos'
            })

            setApiTest({
                success: true,
                message: `✅ Inscription Context réussie pour ${user?.nom}`,
                data: {
                    user: user?.nom,
                    authenticated: isAuthenticated,
                    fromContext: true
                }
            })
        } catch (error: any) {
            setApiTest({
                error: `Context Register: ${error.message}`,
                data: { fromContext: true }
            })
        } finally {
            setLoading(false)
        }
    }

    const testContextLogout = async () => {
        setLoading(true)
        try {
            await logout()

            setApiTest({
                success: true,
                message: '✅ Déconnexion Context réussie',
                data: {
                    authenticated: isAuthenticated,
                    fromContext: true
                }
            })
        } catch (error: any) {
            setApiTest({
                error: `Context Logout: ${error.message}`,
                data: { fromContext: true }
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryClick = (category: any) => {
        console.log(`Catégorie sélectionnée: ${category.name} (${category.count} annonces)`)
        // Ici on naviguera vers la page des annonces de cette catégorie
    }

    const handleSearch = () => {
        console.log(`Recherche: "${searchQuery}" dans ${selectedCity}`)
        // Ici on fera l'appel API de recherche vers le backend
    }

    return (
        <div className="bg-gradient">
            {/* 🆕 Modals */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={closeModals}
                onSwitchToRegister={openRegisterModal}
                onSwitchToForgotPassword={openForgotPasswordModal}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={closeModals}
                onSwitchToLogin={openLoginModal}
            />
            <ForgotPasswordModal
                isOpen={showForgotPasswordModal}
                onClose={closeModals}
                onBackToLogin={openLoginModal}
            />

            {/* Panel de test avec nouveaux boutons Context */}
            <div style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: 999,  // ✅ Réduit pour être sous les modals
                background: 'white',
                padding: '15px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '320px'
            }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>
                    🧪 Tests APIs + Context Auth
                </h4>

                {/* 🆕 Affichage état utilisateur */}
                {authLoading ? (
                    <div style={{
                        padding: '8px',
                        background: '#f3f4f6',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        fontSize: '12px'
                    }}>
                        ⏳ Chargement authentification...
                    </div>
                ) : isAuthenticated ? (
                    <div style={{
                        padding: '8px',
                        background: '#dcfce7',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        fontSize: '12px'
                    }}>
                        ✅ Connecté: <strong>{user?.nom}</strong><br/>
                        📱 {user?.telephone}
                    </div>
                ) : (
                    <div style={{
                        padding: '8px',
                        background: '#fef3c7',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        fontSize: '12px'
                    }}>
                        🔐 Non connecté
                    </div>
                )}

                {/* 🆕 Erreur auth */}
                {authError && (
                    <div style={{
                        padding: '8px',
                        background: '#fef2f2',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        fontSize: '11px',
                        color: '#dc2626'
                    }}>
                        ❌ {authError}
                        <button
                            onClick={clearError}
                            style={{
                                marginLeft: '8px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                        onClick={testBackendConnection}
                        disabled={loading}
                        style={{
                            background: loading ? '#ccc' : '#10B981',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        {loading ? '⏳' : '🔗'} Test Backend
                    </button>

                    {/* 🆕 Boutons Context Auth */}
                    <div style={{
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '8px',
                        marginTop: '8px'
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>
                            🔐 Tests Context Auth
                        </div>

                        <button
                            onClick={testContextRegister}
                            disabled={loading || authLoading}
                            style={{
                                background: loading ? '#ccc' : '#10B981',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '11px',
                                width: '100%',
                                marginBottom: '4px'
                            }}
                        >
                            {loading ? '⏳' : '📝'} Context Register
                        </button>

                        <button
                            onClick={testContextLogin}
                            disabled={loading || authLoading}
                            style={{
                                background: loading ? '#ccc' : '#3B82F6',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '11px',
                                width: '100%',
                                marginBottom: '4px'
                            }}
                        >
                            {loading ? '⏳' : '🔑'} Context Login
                        </button>

                        <button
                            onClick={testContextLogout}
                            disabled={loading || authLoading || !isAuthenticated}
                            style={{
                                background: loading || !isAuthenticated ? '#ccc' : '#EF4444',
                                color: 'white',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: loading || !isAuthenticated ? 'not-allowed' : 'pointer',
                                fontSize: '11px',
                                width: '100%'
                            }}
                        >
                            {loading ? '⏳' : '🚪'} Context Logout
                        </button>
                    </div>
                </div>

                {/* Résultats des tests */}
                {apiTest && (
                    <div style={{ marginTop: '12px', fontSize: '11px' }}>
                        {apiTest.error ? (
                            <div style={{ color: 'red', padding: '8px', background: '#fef2f2', borderRadius: '4px' }}>
                                ❌ {apiTest.error}
                            </div>
                        ) : (
                            <div style={{ color: 'green', padding: '8px', background: '#f0fdf4', borderRadius: '4px' }}>
                                ✅ {apiTest.message || 'Test OK'}
                                {apiTest.data && (
                                    <div style={{ marginTop: '4px', fontSize: '10px' }}>
                                        {typeof apiTest.data === 'object' ? JSON.stringify(apiTest.data, null, 2) : apiTest.data}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Header avec modals au lieu des boutons de test */}
            <header style={{
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '1rem 0'
            }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                    }}>
                        <h1 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color: '#0369a1',
                            margin: 0
                        }}>
                            🇨🇲 CamerAnnonces
                        </h1>

                        {/* 🆕 Boutons d'auth avec modals */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {isAuthenticated ? (
                                <>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                        👋 Bonjour <strong>{user?.nom}</strong>
                                    </div>
                                    <button
                                        onClick={logout}
                                        disabled={authLoading}
                                        className="btn-primary"
                                        style={{ width: 'auto', padding: '8px 16px' }}
                                    >
                                        {authLoading ? '⏳' : '🚪'} Déconnexion
                                    </button>

                                    <ProtectedRoute>
                                        <button style={{
                                            background: '#10B981',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}>
                                            ➕ Poster une annonce
                                        </button>
                                    </ProtectedRoute>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn-primary"
                                        style={{ width: 'auto', padding: '8px 16px' }}
                                        onClick={openLoginModal}  // ✅ Ouvre le modal
                                    >
                                        🔑 Connexion
                                    </button>
                                    <button style={{
                                        background: '#10B981',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                            onClick={openRegisterModal}  // ✅ Ouvre le modal
                                    >
                                        📝 S'inscrire
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Barre de recherche */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <input
                            type="text"
                            placeholder="Que recherchez-vous ?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            style={{
                                padding: '12px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                background: 'white',
                                minWidth: '160px'
                            }}
                        >
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleSearch}
                            style={{
                                background: '#0369a1',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            🔍 Rechercher
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenu principal (inchangé) */}
            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                {/* Statistiques dynamiques */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    background: 'rgba(255,255,255,0.8)',
                    padding: '2rem',
                    borderRadius: '12px'
                }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '600',
                        color: '#0369a1',
                        marginBottom: '0.5rem'
                    }}>
                        Trouvez tout ce dont vous avez besoin
                    </h2>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1rem' }}>
                    </p>

                    {/* 🆕 Indicateur de statut d'authentification */}
                    {isAuthenticated && (
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            marginTop: '1rem',
                            display: 'inline-block'
                        }}>
                            <span style={{ color: '#059669', fontWeight: '600' }}>
                                ✅ Connecté en tant que {user?.nom}
                            </span>
                        </div>
                    )}

                    <div className="cameroon-flag">
                        <span className="flag-color green"></span>
                        <span className="flag-color red"></span>
                        <span className="flag-color yellow"></span>
                    </div>
                </div>

                {/* Grille des catégories */}
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    color: '#333'
                }}>
                    Parcourir par catégorie {isDataLoaded && `(${categories.length} catégories)`}
                </h3>

                {!isDataLoaded ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⏳</div>
                        <p>Chargement des catégories depuis PostgreSQL...</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        {categories.map(category => (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    border: `3px solid ${category.color}20`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '60px',
                                    height: '60px',
                                    background: `${category.color}15`,
                                    borderRadius: '0 0 0 60px'
                                }}></div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        fontSize: '2.5rem',
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: `${category.color}15`,
                                        borderRadius: '12px'
                                    }}>
                                        {category.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{
                                            margin: 0,
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: category.color,
                                            marginBottom: '0.5rem'
                                        }}>
                                            {category.name}
                                        </h4>
                                        <p style={{
                                            margin: 0,
                                            color: '#666',
                                            fontSize: '0.9rem'
                                        }}>
                                            {category.count.toLocaleString()} annonces
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Call to action avec état auth */}
                <div style={{
                    background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
                    color: 'white',
                    padding: '3rem 2rem',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                        Prêt à vendre ou acheter ?
                    </h3>
                    <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
                        Rejoignez des milliers de Camerounais qui font confiance à CamerAnnonces
                    </p>

                    {isAuthenticated ? (
                        <div>
                            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                                👋 Bonjour <strong>{user?.nom}</strong> !
                            </p>
                            <button style={{
                                background: 'white',
                                color: '#0369a1',
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginRight: '1rem'
                            }}>
                                ➕ Publier une annonce
                            </button>
                            <button style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                border: '2px solid white',
                                padding: '14px 30px',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                📋 Mes annonces
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={openRegisterModal}  // ✅ Ouvre le modal d'inscription
                                style={{
                                    background: 'white',
                                    color: '#0369a1',
                                    border: 'none',
                                    padding: '16px 32px',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginRight: '1rem'
                                }}
                            >
                                📝 Commencer maintenant
                            </button>
                            <button
                                onClick={openLoginModal}  // ✅ Ouvre le modal de connexion
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '2px solid white',
                                    padding: '14px 30px',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                🔑 Se connecter
                            </button>
                        </div>
                    )}
                </div>

                {/* 🆕 Demo de ProtectedRoute */}
                <ProtectedRoute>
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '2px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                        marginTop: '2rem'
                    }}>
                        <h4 style={{ color: '#059669', marginBottom: '1rem' }}>
                            🔐 Zone Utilisateur Connecté
                        </h4>
                        <p style={{ color: '#065f46', marginBottom: '1rem' }}>
                            Cette section n'est visible que pour les utilisateurs connectés !
                        </p>
                        <div style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            display: 'inline-block'
                        }}>
                            <strong>Profil :</strong> {user?.nom}<br/>
                            <strong>Téléphone :</strong> {user?.telephone}<br/>
                            <strong>Plan :</strong> {user?.planActuel}
                        </div>
                    </div>
                </ProtectedRoute>
            </main>

            {/* Footer */}
            <footer style={{
                background: '#1f2937',
                color: 'white',
                padding: '2rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <p>© 2025 CamerAnnonces - Made with ❤️ in Cameroon 🇨🇲</p>
                    {isAuthenticated && (
                        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
                            Connecté en tant que {user?.nom} • Plan {user?.planActuel}
                        </p>
                    )}
                </div>
            </footer>
        </div>
    )
}

export default App