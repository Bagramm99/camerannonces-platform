import { useState } from 'react'
import './App.css'

function App() {
    const [selectedCity, setSelectedCity] = useState('Toutes les villes')
    const [searchQuery, setSearchQuery] = useState('')

    // Catégories d'annonces du Cameroun
    const categories = [
        { id: 1, name: 'Téléphones & Tablettes', icon: '📱', count: 2847, color: '#3B82F6' },
        { id: 2, name: 'Véhicules', icon: '🚗', count: 1523, color: '#EF4444' },
        { id: 3, name: 'Immobilier', icon: '🏠', count: 892, color: '#10B981' },
        { id: 4, name: 'Électronique', icon: '💻', count: 1756, color: '#8B5CF6' },
        { id: 5, name: 'Mode & Beauté', icon: '👗', count: 934, color: '#F59E0B' },
        { id: 6, name: 'Emploi', icon: '💼', count: 445, color: '#06B6D4' },
        { id: 7, name: 'Services', icon: '🔧', count: 672, color: '#84CC16' },
        { id: 8, name: 'Animaux', icon: '🐕', count: 234, color: '#F97316' },
        { id: 9, name: 'Loisirs & Sports', icon: '⚽', count: 567, color: '#EC4899' },
        { id: 10, name: 'Équipements', icon: '🛠️', count: 398, color: '#6366F1' },
        { id: 11, name: 'Agriculture', icon: '🌾', count: 289, color: '#059669' },
        { id: 12, name: 'Divers', icon: '📦', count: 456, color: '#64748B' }
    ]

    // Villes principales du Cameroun
    const cities = [
        'Toutes les villes', 'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam',
        'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Kribi', 'Limbe'
    ]

    const handleCategoryClick = (category: any) => {
        console.log(`Catégorie sélectionnée: ${category.name}`)
        // Ici on connectera avec le backend Spring Boot
    }

    const handleSearch = () => {
        console.log(`Recherche: ${searchQuery} dans ${selectedCity}`)
        // Ici on fera l'appel API vers le backend
    }

    return (
        <div className="bg-gradient">
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

            {/* Contenu principal */}
            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                {/* Statistiques */}
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
                        Plus de <strong>10,000 annonces</strong> dans tout le Cameroun
                    </p>
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
                    Parcourir par catégorie
                </h3>

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