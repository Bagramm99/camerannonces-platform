import { useState, useEffect } from 'react'
import { testApi, categoryApi, cityApi } from './services/api'
import './App.css'

function App() {
    const [selectedCity, setSelectedCity] = useState('Toutes les villes')
    const [searchQuery, setSearchQuery] = useState('')
    const [apiTest, setApiTest] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    // 🆕 États pour les données dynamiques
    const [categories, setCategories] = useState<any[]>([])
    const [cities, setCities] = useState<string[]>(['Toutes les villes'])
    const [regions, setRegions] = useState<string[]>([])
    const [isDataLoaded, setIsDataLoaded] = useState(false)

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

    // Test des vraies catégories
    const testRealCategories = async () => {
        setLoading(true)
        try {
            console.log('=== TEST CATÉGORIES RÉELLES ===')

            const categoriesWithCount = await categoryApi.getAllWithCount()
            console.log('📊 Catégories avec compteurs:', categoriesWithCount)

            setApiTest({
                success: true,
                message: `✅ ${categoriesWithCount.categoriesWithCount?.length || 0} catégories chargées depuis PostgreSQL`,
                data: categoriesWithCount
            })
        } catch (error) {
            console.error('❌ Erreur catégories:', error)
            setApiTest({ error: 'Erreur lors du chargement des catégories' })
        } finally {
            setLoading(false)
        }
    }

    // Test des vraies villes
    const testRealCities = async () => {
        setLoading(true)
        try {
            console.log('=== TEST VILLES RÉELLES ===')

            const cities = await cityApi.getAll()
            console.log('🏙️ Toutes les villes:', cities)

            const regions = await cityApi.getRegions()
            console.log('🗺️ Régions du Cameroun:', regions)

            setApiTest({
                success: true,
                message: `✅ ${cities.cities?.length || 0} villes et ${regions.regions?.length || 0} régions chargées`,
                data: { cities: cities.cities?.length, regions: regions.regions?.length }
            })
        } catch (error) {
            console.error('❌ Erreur villes:', error)
            setApiTest({ error: 'Erreur lors du chargement des villes' })
        } finally {
            setLoading(false)
        }
    }

    // Test complet de tous les APIs
    const testAllRealApis = async () => {
        setLoading(true)
        try {
            console.log('=== TEST COMPLET DE TOUS LES APIs ===')

            const backendTest = await testApi.hello()
            const categoriesData = await categoryApi.getAllWithCount()
            const citiesData = await cityApi.getAll()
            const regionsData = await cityApi.getRegions()

            setApiTest({
                success: true,
                message: '🎉 TOUS LES APIs FONCTIONNENT PARFAITEMENT !',
                data: {
                    backend: '✅ Connecté',
                    categories: `✅ ${categoriesData.categoriesWithCount?.length || 0} catégories`,
                    cities: `✅ ${citiesData.cities?.length || 0} villes`,
                    regions: `✅ ${regionsData.regions?.length || 0} régions`
                }
            })
        } catch (error) {
            console.error('❌ Erreur test complet:', error)
            setApiTest({ error: 'Erreur lors du test complet' })
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

    // 🆕 Fonction pour recharger les données
    const refreshData = async () => {
        setLoading(true)
        await loadInitialData()
        setLoading(false)
        setApiTest({ success: true, message: '🔄 Données rechargées avec succès !' })
    }

    return (
        <div className="bg-gradient">
            {/* Panel de test des APIs */}
            <div style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                background: 'white',
                padding: '15px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '300px'
            }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>
                    🧪 Tests APIs CamerAnnonces
                </h4>

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

                    <button
                        onClick={testRealCategories}
                        disabled={loading}
                        style={{
                            background: loading ? '#ccc' : '#3B82F6',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        {loading ? '⏳' : '📱'} Test Catégories DB
                    </button>

                    <button
                        onClick={testRealCities}
                        disabled={loading}
                        style={{
                            background: loading ? '#ccc' : '#F59E0B',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        {loading ? '⏳' : '🏙️'} Test Villes DB
                    </button>

                    <button
                        onClick={testAllRealApis}
                        disabled={loading}
                        style={{
                            background: loading ? '#ccc' : '#8B5CF6',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}
                    >
                        {loading ? '⏳' : '🚀'} Test TOUT
                    </button>

                    <button
                        onClick={refreshData}
                        disabled={loading}
                        style={{
                            background: loading ? '#ccc' : '#059669',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        {loading ? '⏳' : '🔄'} Recharger Data
                    </button>
                </div>

                {apiTest && (
                    <div style={{ marginTop: '12px', fontSize: '11px' }}>
                        {apiTest.error ? (
                            <div style={{ color: 'red', padding: '8px', background: '#fef2f2', borderRadius: '4px' }}>
                                ❌ {apiTest.error}
                            </div>
                        ) : (
                            <div style={{ color: 'green', padding: '8px', background: '#f0fdf4', borderRadius: '4px' }}>
                                ✅ {apiTest.message || 'Backend OK'}
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

            {/* Header */}
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
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px' }}>
                                Connexion
                            </button>
                            <button style={{
                                background: '#10B981',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontWeight: '600'
                            }}>
                                Poster une annonce
                            </button>
                        </div>
                    </div>

                    {/* Barre de recherche avec vraies villes */}
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

            {/* Contenu principal */}
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
                        {isDataLoaded ? (
                            <>Plus de <strong>{categories.reduce((total, cat) => total + cat.count, 0).toLocaleString()}</strong> annonces dans <strong>{regions.length}</strong> régions du Cameroun</>
                        ) : (
                            <>Plus de <strong>10,000 annonces</strong> dans tout le Cameroun</>
                        )}
                    </p>
                    <div className="cameroon-flag">
                        <span className="flag-color green"></span>
                        <span className="flag-color red"></span>
                        <span className="flag-color yellow"></span>
                    </div>
                </div>

                {/* Grille des catégories dynamiques */}
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

                {/* Call to action */}
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
                    <button style={{
                        background: 'white',
                        color: '#0369a1',
                        border: 'none',
                        padding: '16px 32px',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        Commencer maintenant
                    </button>
                </div>
            </main>

            {/* Footer simple */}
            <footer style={{
                background: '#1f2937',
                color: 'white',
                padding: '2rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <p>© 2025 CamerAnnonces - Made with ❤️ in Cameroon 🇨🇲</p>
                </div>
            </footer>
        </div>
    )
}

export default App