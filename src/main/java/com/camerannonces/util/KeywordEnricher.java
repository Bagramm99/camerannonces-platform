package com.camerannonces.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Utilitaire pour enrichir les mots-clés de recherche avec des synonymes
 * Permet de trouver des résultats même si le mot exact n'est pas dans l'annonce
 */
public class KeywordEnricher {

    private static final Map<String, String> KEYWORD_SYNONYMS = new HashMap<>();

    static {
        // 🚗 Véhicules
        KEYWORD_SYNONYMS.put("voiture", "Toyota Corolla Peugeot Mercedes voiture auto automobile vehicule");
        KEYWORD_SYNONYMS.put("auto", "Toyota Corolla voiture automobile vehicule");
        KEYWORD_SYNONYMS.put("vehicule", "Toyota Corolla Yamaha voiture moto camion auto automobile");
        KEYWORD_SYNONYMS.put("véhicule", "Toyota Corolla Yamaha voiture moto camion auto automobile");
        KEYWORD_SYNONYMS.put("moto", "Yamaha motocyclette scooter deux-roues moto");

        // 📱 Téléphones & Accessoires
        KEYWORD_SYNONYMS.put("telephone", "iPhone Samsung Galaxy téléphone tel mobile smartphone");
        KEYWORD_SYNONYMS.put("téléphone", "iPhone Samsung Galaxy téléphone tel mobile smartphone");
        KEYWORD_SYNONYMS.put("tel", "iPhone Samsung Galaxy téléphone mobile smartphone");
        KEYWORD_SYNONYMS.put("smartphone", "iPhone Samsung Galaxy Huawei Xiaomi téléphone mobile");
        KEYWORD_SYNONYMS.put("mobile", "iPhone Samsung Galaxy téléphone smartphone");
        KEYWORD_SYNONYMS.put("ecouteur", "AirPods casque oreillette écouteur bluetooth");
        KEYWORD_SYNONYMS.put("écouteur", "AirPods casque oreillette écouteur bluetooth");
        KEYWORD_SYNONYMS.put("chargeur", "chargeur adaptateur cable USB");

        // 🏠 Immobilier
        KEYWORD_SYNONYMS.put("immobilier", "appartement maison studio terrain chambre villa location vente Appartement Studio");
        KEYWORD_SYNONYMS.put("logement", "appartement studio chambre maison villa Appartement Studio");
        KEYWORD_SYNONYMS.put("appart", "appartement studio chambre logement Appartement Studio");
        KEYWORD_SYNONYMS.put("appartement", "appartement studio chambre logement Appartement Studio");
        KEYWORD_SYNONYMS.put("chambre", "appartement studio chambre logement Appartement chambre");
        KEYWORD_SYNONYMS.put("studio", "studio appartement chambre logement Studio Appartement");
        KEYWORD_SYNONYMS.put("maison", "maison villa duplex logement habitation");

        // 👗 Mode & Beauté
        KEYWORD_SYNONYMS.put("mode", "robe vêtement habit pantalon chaussure perruque cosmétique Robe");
        KEYWORD_SYNONYMS.put("beaute", "maquillage crème parfum cosmétique perruque Perruque");
        KEYWORD_SYNONYMS.put("beauté", "maquillage crème parfum cosmétique perruque Perruque");
        KEYWORD_SYNONYMS.put("vetement", "robe chemise pantalon t-shirt habit veste Robe");
        KEYWORD_SYNONYMS.put("vêtement", "robe chemise pantalon t-shirt habit veste Robe");
        KEYWORD_SYNONYMS.put("chaussure", "sandale basket talon soulier bottine");
        KEYWORD_SYNONYMS.put("perruque", "perruque cheveux wig tissage mèche Perruque");
        KEYWORD_SYNONYMS.put("cosmetique", "maquillage crème parfum lotion soin");
        KEYWORD_SYNONYMS.put("cosmétique", "maquillage crème parfum lotion soin");
        KEYWORD_SYNONYMS.put("robe", "robe vêtement habit mode Robe mariée soirée");

        // 💼 Emplois & Services
        KEYWORD_SYNONYMS.put("emploi", "job travail offre recrutement poste Recherche Garde");
        KEYWORD_SYNONYMS.put("travail", "emploi job offre recrutement Recherche");
        KEYWORD_SYNONYMS.put("job", "emploi travail offre poste");
        KEYWORD_SYNONYMS.put("service", "freelance prestation aide assistance Recherche Garde");

        // 💻 Électronique
        KEYWORD_SYNONYMS.put("electronique", "TV télévision ordinateur PC console PlayStation Xbox Smart MacBook");
        KEYWORD_SYNONYMS.put("électronique", "TV télévision ordinateur PC console PlayStation Xbox Smart MacBook");
        KEYWORD_SYNONYMS.put("ordinateur", "PC portable laptop MacBook desktop ordinateur");
        KEYWORD_SYNONYMS.put("pc", "ordinateur portable laptop desktop PC");
        KEYWORD_SYNONYMS.put("console", "PlayStation Xbox Nintendo Switch PS4 PS5");
        KEYWORD_SYNONYMS.put("tv", "télévision téléviseur écran Smart TV");

        // 🎉 Mariage & Événements
        KEYWORD_SYNONYMS.put("mariage", "robe mariée DJ décoration salle événement fête cérémonie Robe");
        KEYWORD_SYNONYMS.put("evenement", "concert fête anniversaire mariage salle");
        KEYWORD_SYNONYMS.put("événement", "concert fête anniversaire mariage salle");

        // 🛠️ Services Domestiques
        KEYWORD_SYNONYMS.put("plombier", "plomberie réparation fuite canalisation robinet");
        KEYWORD_SYNONYMS.put("electricien", "électricité installation courant câblage");
        KEYWORD_SYNONYMS.put("électricien", "électricité installation courant câblage");
        KEYWORD_SYNONYMS.put("jardin", "jardinage espace vert fleur pelouse gazon");

        // 🍗 Alimentation
        KEYWORD_SYNONYMS.put("alimentation", "poisson fumé plantain manioc maïs nourriture Poisson");
        KEYWORD_SYNONYMS.put("poisson", "poisson fumé braisé tilapia Poisson");
        KEYWORD_SYNONYMS.put("plantain", "banane plantain manioc");
        KEYWORD_SYNONYMS.put("condiment", "épice oignon tomate ail poivre");

        // 🐔 Agriculture & Élevage
        KEYWORD_SYNONYMS.put("agriculture", "champ ferme engrais plant graine Poules");
        KEYWORD_SYNONYMS.put("elevage", "poule coq œuf porc bœuf mouton chèvre Poules");
        KEYWORD_SYNONYMS.put("élevage", "poule coq œuf porc bœuf mouton chèvre Poules");
        KEYWORD_SYNONYMS.put("animal", "poule coq mouton chèvre Poules");

        // 📚 Éducation
        KEYWORD_SYNONYMS.put("education", "cours formation école livre professeur Cours Mathématiques");
        KEYWORD_SYNONYMS.put("éducation", "cours formation école livre professeur Cours Mathématiques");
        KEYWORD_SYNONYMS.put("cours", "formation soutien scolaire leçon Cours Mathématiques");
        KEYWORD_SYNONYMS.put("formation", "cours éducation école Cours");
    }

    /**
     * Enrichit un mot-clé avec ses synonymes pour améliorer la recherche
     */
    public static String enrich(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return keyword;
        }

        String lowerKeyword = keyword.toLowerCase().trim();

        // Chercher une correspondance exacte
        if (KEYWORD_SYNONYMS.containsKey(lowerKeyword)) {
            System.out.println("🔍 Enrichissement: '" + keyword + "' → '" + KEYWORD_SYNONYMS.get(lowerKeyword) + "'");
            return KEYWORD_SYNONYMS.get(lowerKeyword);
        }

        // Pas de synonyme trouvé, retourner le mot-clé original
        System.out.println("🔍 Pas d'enrichissement pour: '" + keyword + "'");
        return keyword;
    }
}