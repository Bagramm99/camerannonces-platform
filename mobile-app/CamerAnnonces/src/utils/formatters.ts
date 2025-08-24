// src/utils/formatters.ts

/**
 * Formate un prix avec des séparateurs de milliers
 */
export const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

/**
 * Formate une date relative (il y a X jours, etc.)
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
        return diffMinutes <= 1 ? 'À l\'instant' : `Il y a ${diffMinutes}min`;
    } else if (diffHours < 24) {
        return diffHours === 1 ? 'Il y a 1h' : `Il y a ${diffHours}h`;
    } else if (diffDays === 1) {
        return 'Hier';
    } else if (diffDays < 7) {
        return `Il y a ${diffDays} jours`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? 'Il y a 1 semaine' : `Il y a ${weeks} semaines`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? 'Il y a 1 mois' : `Il y a ${months} mois`;
    } else {
        const years = Math.floor(diffDays / 365);
        return years === 1 ? 'Il y a 1 an' : `Il y a ${years} ans`;
    }
};

/**
 * Formate la localisation (ville, quartier)
 */
export const formatLocation = (ville?: string, quartier?: string): string => {
    if (ville && quartier) {
        return `${quartier}, ${ville}`;
    } else if (ville) {
        return ville;
    } else if (quartier) {
        return quartier;
    }
    return 'Non spécifié';
};

/**
 * Formate un numéro de téléphone camerounais
 */
export const formatPhoneNumber = (phone: string): string => {
    // Supprimer tous les caractères non numériques
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('237') && cleaned.length === 12) {
        // Format: 237 6 XX XX XX XX
        return `237 ${cleaned.slice(3, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
    }

    return phone; // Retourner tel quel si format non reconnu
};

/**
 * Tronque un texte avec des points de suspension
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + '...';
};

/**
 * Capitalise la première lettre de chaque mot
 */
export const capitalizeWords = (text: string): string => {
    return text.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

/**
 * Valide un numéro de téléphone camerounais
 */
export const validateCameroonPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return /^237[0-9]{9}$/.test(cleaned);
};

/**
 * Valide une adresse email
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Génère une couleur aléatoire pour les avatars
 */
export const getRandomColor = (): string => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
        '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
        '#3742FA', '#2F3542', '#FF3838', '#FF6348', '#A4B0BE'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Convertit les bytes en format lisible
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// src/utils/constants.ts

// Configuration de l'app
export const APP_CONFIG = {
    NAME: 'CamerAnnonces',
    VERSION: '1.0.0',
    SUPPORT_EMAIL: 'support@camerannonces.com',
    SUPPORT_PHONE: '237695000000',
};

// URLs et liens
export const LINKS = {
    PRIVACY_POLICY: 'https://camerannonces.com/privacy',
    TERMS_OF_SERVICE: 'https://camerannonces.com/terms',
    HELP_CENTER: 'https://camerannonces.com/help',
    FACEBOOK: 'https://facebook.com/camerannonces',
    INSTAGRAM: 'https://instagram.com/camerannonces',
};

// Limites de l'app
export const LIMITS = {
    MAX_IMAGES_PER_LISTING: 5,
    MAX_IMAGE_SIZE_MB: 5,
    MAX_TITLE_LENGTH: 200,
    MAX_DESCRIPTION_LENGTH: 1000,
    MIN_PASSWORD_LENGTH: 6,
};

// États des produits
export const PRODUCT_CONDITIONS = [
    { value: 'NEUF', label: 'Neuf', color: '#00C851' },
    { value: 'TRES_BON', label: 'Très bon état', color: '#2E7D32' },
    { value: 'BON', label: 'Bon état', color: '#FF9800' },
    { value: 'MOYEN', label: 'État moyen', color: '#FF5722' },
    { value: 'A_REPARER', label: 'À réparer', color: '#F44336' },
];

// Types de plans
export const PLAN_TYPES = [
    {
        value: 'GRATUIT',
        label: 'Gratuit',
        price: 0,
        listings_per_month: 3,
        features: ['3 annonces/mois', 'Photos basiques', 'Support communautaire']
    },
    {
        value: 'BASIC',
        label: 'Basic',
        price: 5000,
        listings_per_month: 10,
        features: ['10 annonces/mois', '5 photos/annonce', 'Support email']
    },
    {
        value: 'PRO',
        label: 'Pro',
        price: 15000,
        listings_per_month: 50,
        features: ['50 annonces/mois', 'Photos HD', 'Statistiques', 'Support prioritaire']
    },
    {
        value: 'BOUTIQUE',
        label: 'Boutique',
        price: 35000,
        listings_per_month: -1, // Illimité
        features: ['Annonces illimitées', 'Page boutique', 'API', 'Support dédié']
    }
];

// Régions du Cameroun
export const CAMEROON_REGIONS = [
    'Adamaoua',
    'Centre',
    'Est',
    'Extrême-Nord',
    'Littoral',
    'Nord',
    'Nord-Ouest',
    'Ouest',
    'Sud',
    'Sud-Ouest'
];

// Catégories avec emojis (synchronisé avec la DB)
export const DEFAULT_CATEGORIES = [
    { id: 1, nom: 'Téléphones & Accessoires', emoji: '📱' },
    { id: 2, nom: 'Véhicules', emoji: '🚗' },
    { id: 3, nom: 'Immobilier', emoji: '🏠' },
    { id: 4, nom: 'Mode & Beauté', emoji: '👕' },
    { id: 5, nom: 'Emplois & Services', emoji: '💼' },
    { id: 6, nom: 'Électronique', emoji: '🖥️' },
    { id: 7, nom: 'Mariage & Événements', emoji: '🎉' },
    { id: 8, nom: 'Services Domestiques', emoji: '🛠️' },
    { id: 9, nom: 'Agriculture & Élevage', emoji: '🐔' },
    { id: 10, nom: 'Éducation', emoji: '📚' },
    { id: 11, nom: 'Alimentation', emoji: '🍖' },
    { id: 12, nom: 'Autres', emoji: '🧩' },
];

// Options de tri
export const SORT_OPTIONS = [
    { value: 'date', label: 'Plus récent' },
    { value: 'prix_asc', label: 'Prix croissant' },
    { value: 'prix_desc', label: 'Prix décroissant' },
    { value: 'popularite', label: 'Plus populaire' },
    { value: 'vues', label: 'Plus vus' },
];

// Messages d'erreur courants
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre internet.',
    INVALID_PHONE: 'Numéro de téléphone invalide (format: 237XXXXXXXXX)',
    INVALID_EMAIL: 'Adresse email invalide',
    WEAK_PASSWORD: 'Mot de passe trop faible (min. 6 caractères)',
    REQUIRED_FIELD: 'Ce champ est obligatoire',
    IMAGE_TOO_LARGE: 'Image trop volumineuse (max. 5MB)',
    TOO_MANY_IMAGES: 'Maximum 5 images par annonce',
};