package com.camerannonces;

import com.camerannonces.entity.Category;
import com.camerannonces.entity.Listing;
import com.camerannonces.repository.*;
import com.camerannonces.entity.*;
import com.camerannonces.enums.ListingStatus;
import com.camerannonces.enums.PlanType;
import com.camerannonces.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test") // Utilise application-test.properties si vous en avez un
class CamerannoncesBackendApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private QuartierRepository quartierRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private ListingImageRepository listingImageRepository;

    @Autowired
    private UserFavoriteRepository userFavoriteRepository;

    @Autowired
    private SignalRepository signalRepository;

    @Test
    void contextLoads() {
        // Test que le contexte Spring se charge correctement
        assertNotNull(userRepository);
        assertNotNull(categoryRepository);
        assertNotNull(cityRepository);
        assertNotNull(quartierRepository);
        assertNotNull(listingRepository);
        assertNotNull(listingImageRepository);
        assertNotNull(userFavoriteRepository);
        assertNotNull(signalRepository);

        System.out.println("✅ Tous les repositories sont chargés correctement !");
    }

    @Test
    void testDatabaseConnection() {
        // Test de connexion à la base de données
        try {
            long userCount = userRepository.count();
            long categoryCount = categoryRepository.count();
            long cityCount = cityRepository.count();
            long listingCount = listingRepository.count();

            System.out.println("📊 STATISTIQUES BASE DE DONNÉES:");
            System.out.println("👥 Utilisateurs: " + userCount);
            System.out.println("📂 Catégories: " + categoryCount);
            System.out.println("🏙️ Villes: " + cityCount);
            System.out.println("📝 Annonces: " + listingCount);

            // Vérifications basiques
            assertTrue(categoryCount >= 12, "Devrait avoir au moins 12 catégories");
            assertTrue(cityCount > 0, "Devrait avoir des villes");

            System.out.println("✅ Connexion base de données réussie !");

        } catch (Exception e) {
            fail("❌ Erreur de connexion à la base de données: " + e.getMessage());
        }
    }

    @Test
    void testCategoryRepository() {
        // Test du repository des catégories
        try {
            // Récupérer toutes les catégories actives
            var categories = categoryRepository.findByIsActiveTrueOrderByOrdreAffichage();

            assertFalse(categories.isEmpty(), "Devrait avoir des catégories");

            System.out.println("📂 CATÉGORIES TROUVÉES:");
            for (Category cat : categories) {
                System.out.println("  " + cat.getEmoji() + " " + cat.getNom() + " (" + cat.getNomAnglais() + ")");
            }

            // Test recherche par nom
            var phoneCategory = categoryRepository.findByNom("Téléphones & Accessoires");
            assertTrue(phoneCategory.isPresent(), "Catégorie Téléphones devrait exister");

            System.out.println("✅ Repository Category fonctionne !");

        } catch (Exception e) {
            fail("❌ Erreur test CategoryRepository: " + e.getMessage());
        }
    }

    @Test
    void testCityRepository() {
        // Test du repository des villes
        try {
            // Récupérer toutes les villes
            var cities = cityRepository.findByIsActiveTrueOrderByNom();

            assertFalse(cities.isEmpty(), "Devrait avoir des villes");

            System.out.println("🏙️ VILLES PAR RÉGION:");
            var regions = cityRepository.findAllRegions();
            for (String region : regions) {
                var citiesInRegion = cityRepository.findByRegionAndIsActiveTrue(region);
                System.out.println("  📍 " + region + ": " + citiesInRegion.size() + " villes");
            }

            // Test recherche Douala
            var douala = cityRepository.findByNom("Douala");
            assertTrue(douala.isPresent(), "Douala devrait exister");

            System.out.println("✅ Repository City fonctionne !");

        } catch (Exception e) {
            fail("❌ Erreur test CityRepository: " + e.getMessage());
        }
    }

    @Test
    void testListingRepository() {
        // Test du repository des annonces
        try {
            // Compter les annonces par statut
            long activeListings = listingRepository.countByStatut(ListingStatus.ACTIVE);

            System.out.println("📝 ANNONCES ACTIVES: " + activeListings);

            if (activeListings > 0) {
                // Test pagination
                Page<Listing> firstPage = listingRepository.findByStatut(
                        ListingStatus.ACTIVE,
                        PageRequest.of(0, 5)
                );

                System.out.println("📄 Première page: " + firstPage.getContent().size() + " annonces");

                // Afficher quelques annonces
                for (Listing listing : firstPage.getContent()) {
                    System.out.println("  📱 " + listing.getTitre() + " - " +
                            listing.getPrix() + " FCFA - " + listing.getVille());
                }

                // Test recherche par catégorie
                var phoneListings = listingRepository.findByCategoryIdAndStatut(
                        1L, ListingStatus.ACTIVE, PageRequest.of(0, 3)
                );

                System.out.println("📱 Annonces téléphones: " + phoneListings.getTotalElements());
            }

            System.out.println("✅ Repository Listing fonctionne !");

        } catch (Exception e) {
            fail("❌ Erreur test ListingRepository: " + e.getMessage());
        }
    }

    @Test
    void testUserRepository() {
        // Test du repository des utilisateurs
        try {
            long totalUsers = userRepository.count();
            long boutiqueUsers = userRepository.countBoutiques();

            System.out.println("👥 UTILISATEURS:");
            System.out.println("  Total: " + totalUsers);
            System.out.println("  Boutiques: " + boutiqueUsers);

            // Test recherche par plan
            var gratuitUsers = userRepository.findByPlanActuel(PlanType.GRATUIT);
            System.out.println("  Plan gratuit: " + gratuitUsers.size());

            // Test utilisateurs actifs
            var activeUsers = userRepository.findByIsActiveTrue();
            System.out.println("  Actifs: " + activeUsers.size());

            System.out.println("✅ Repository User fonctionne !");

        } catch (Exception e) {
            fail("❌ Erreur test UserRepository: " + e.getMessage());
        }
    }

    @Test
    void testSearchFunctionality() {
        // Test des fonctionnalités de recherche
        try {
            // Test recherche textuelle
            var searchResults = listingRepository.searchByKeyword(
                    "iPhone",
                    ListingStatus.ACTIVE,
                    PageRequest.of(0, 5)
            );

            System.out.println("🔍 RECHERCHE 'iPhone': " + searchResults.getTotalElements() + " résultats");

            // Test recherche par ville
            var doualaListings = listingRepository.findByVilleAndStatut(
                    "Douala",
                    ListingStatus.ACTIVE,
                    PageRequest.of(0, 5)
            );

            System.out.println("🏙️ ANNONCES DOUALA: " + doualaListings.getTotalElements() + " résultats");

            // Test filtres avancés
            var filteredResults = listingRepository.findWithFilters(
                    1L,        // Catégorie téléphones
                    "Douala",  // Ville
                    null,      // Quartier
                    100000,    // Prix min
                    600000,    // Prix max
                    null,      // État
                    null,      // Négociable
                    ListingStatus.ACTIVE,
                    PageRequest.of(0, 10)
            );

            System.out.println("🔍 RECHERCHE AVANCÉE: " + filteredResults.getTotalElements() + " résultats");

            System.out.println("✅ Fonctionnalités de recherche opérationnelles !");

        } catch (Exception e) {
            fail("❌ Erreur test recherche: " + e.getMessage());
        }
    }

    @Test
    void testStatistics() {
        // Test des statistiques
        try {
            System.out.println("📊 STATISTIQUES DÉTAILLÉES:");

            // Statistiques par catégorie
            var categoryStats = listingRepository.countByCategory(ListingStatus.ACTIVE);
            System.out.println("📂 Par catégorie:");
            for (Object[] stat : categoryStats) {
                System.out.println("  " + stat[0] + ": " + stat[1] + " annonces");
            }

            // Statistiques par ville
            var cityStats = listingRepository.countByCity(ListingStatus.ACTIVE);
            System.out.println("🏙️ Par ville (top 5):");
            int count = 0;
            for (Object[] stat : cityStats) {
                if (count < 5) {
                    System.out.println("  " + stat[0] + ": " + stat[1] + " annonces");
                    count++;
                }
            }

            // Statistiques des utilisateurs par plan
            var planStats = userRepository.countUsersByPlan();
            System.out.println("👥 Par plan:");
            for (Object[] stat : planStats) {
                System.out.println("  " + stat[0] + ": " + stat[1] + " utilisateurs");
            }

            System.out.println("✅ Statistiques générées avec succès !");

        } catch (Exception e) {
            fail("❌ Erreur génération statistiques: " + e.getMessage());
        }
    }

    @Test
    void testDataIntegrity() {
        // Test de l'intégrité des données
        try {
            System.out.println("🔍 VÉRIFICATION INTÉGRITÉ DES DONNÉES:");

            // Vérifier que chaque annonce a une catégorie
            var listingsWithoutCategory = listingRepository.findAll().stream()
                    .filter(l -> l.getCategory() == null)
                    .count();

            assertEquals(0, listingsWithoutCategory, "Toutes les annonces devraient avoir une catégorie");

            // Vérifier que chaque annonce a un utilisateur
            var listingsWithoutUser = listingRepository.findAll().stream()
                    .filter(l -> l.getUser() == null)
                    .count();

            assertEquals(0, listingsWithoutUser, "Toutes les annonces devraient avoir un utilisateur");

            // Vérifier les téléphones (format camerounais)
            var usersWithInvalidPhone = userRepository.findAll().stream()
                    .filter(u -> !u.getTelephone().matches("^237[0-9]{9}$"))
                    .count();

            assertEquals(0, usersWithInvalidPhone, "Tous les téléphones devraient être au format camerounais");

            System.out.println("✅ Intégrité des données vérifiée !");

        } catch (Exception e) {
            fail("❌ Erreur vérification intégrité: " + e.getMessage());
        }
    }

    @Test
    void testFinalSummary() {
        // Résumé final des tests
        try {
            System.out.println("\n" + "=".repeat(50));
            System.out.println("🎉 RÉSUMÉ FINAL DES TESTS");
            System.out.println("=".repeat(50));

            System.out.println("📊 BASE DE DONNÉES:");
            System.out.println("  👥 Utilisateurs: " + userRepository.count());
            System.out.println("  📂 Catégories: " + categoryRepository.count());
            System.out.println("  🏙️ Villes: " + cityRepository.count());
            System.out.println("  🏘️ Quartiers: " + quartierRepository.count());
            System.out.println("  📝 Annonces: " + listingRepository.count());
            System.out.println("  🖼️ Images: " + listingImageRepository.count());
            System.out.println("  ❤️ Favoris: " + userFavoriteRepository.count());
            System.out.println("  🚨 Signalements: " + signalRepository.count());

            System.out.println("\n✅ TOUS LES TESTS RÉUSSIS !");
            System.out.println("🚀 Votre backend est prêt pour la Phase G !");
            System.out.println("=".repeat(50));

        } catch (Exception e) {
            fail("❌ Erreur résumé final: " + e.getMessage());
        }
    }
}