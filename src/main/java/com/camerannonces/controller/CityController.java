package com.camerannonces.controller;

import com.camerannonces.entity.City;
import com.camerannonces.entity.Quartier;
import com.camerannonces.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "*")
public class CityController {

    @Autowired
    private CityService cityService;

    /**
     * Obtenir toutes les villes actives
     * GET /api/cities
     */
    @GetMapping
    public ResponseEntity<?> getAllCities() {
        try {
            List<City> cities = cityService.getAllActiveCities();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cities", cities.stream()
                    .map(this::createCityResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir toutes les régions
     * GET /api/cities/regions
     */
    @GetMapping("/regions")
    public ResponseEntity<?> getAllRegions() {
        try {
            List<String> regions = cityService.getAllRegions();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("regions", regions);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les villes par région
     * GET /api/cities/region/{region}
     */
    @GetMapping("/region/{region}")
    public ResponseEntity<?> getCitiesByRegion(@PathVariable String region) {
        try {
            List<City> cities = cityService.getCitiesByRegion(region);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cities", cities.stream()
                    .map(this::createCityResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir une ville par ID
     * GET /api/cities/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCityById(@PathVariable Long id) {
        try {
            Optional<City> cityOpt = cityService.getCityById(id);

            if (!cityOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            City city = cityOpt.get();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("city", createCityResponse(city));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Rechercher des villes
     * GET /api/cities/search?keyword=doua
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchCities(@RequestParam String keyword) {
        try {
            List<City> cities = cityService.searchCities(keyword);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cities", cities.stream()
                    .map(this::createCityResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les villes avec des annonces actives
     * GET /api/cities/with-listings
     */
    @GetMapping("/with-listings")
    public ResponseEntity<?> getCitiesWithListings() {
        try {
            List<City> cities = cityService.getCitiesWithActiveListings();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cities", cities.stream()
                    .map(this::createCityResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les villes les plus populaires
     * GET /api/cities/popular
     */
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularCities() {
        try {
            List<Object[]> popularCities = cityService.getMostPopularCities();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("cities", popularCities.stream()
                    .map(this::createCityWithCountResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les statistiques par région
     * GET /api/cities/stats-by-region
     */
    @GetMapping("/stats-by-region")
    public ResponseEntity<?> getStatsbyRegion() {
        try {
            List<Object[]> stats = cityService.getCitiesStatsByRegion();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats.stream()
                    .map(data -> {
                        Map<String, Object> stat = new HashMap<>();
                        stat.put("region", data[0]);
                        stat.put("nombreVilles", data[1]);
                        return stat;
                    }).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // GESTION DES QUARTIERS
    // ============================================

    /**
     * Obtenir tous les quartiers d'une ville
     * GET /api/cities/{cityId}/quartiers
     */
    @GetMapping("/{cityId}/quartiers")
    public ResponseEntity<?> getQuartiersByCity(@PathVariable Long cityId) {
        try {
            List<Quartier> quartiers = cityService.getQuartiersByCity(cityId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("quartiers", quartiers.stream()
                    .map(this::createQuartierResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les quartiers par nom de ville
     * GET /api/cities/quartiers?ville=Douala
     */
    @GetMapping("/quartiers")
    public ResponseEntity<?> getQuartiersByCityName(@RequestParam String ville) {
        try {
            List<Quartier> quartiers = cityService.getQuartiersByCityName(ville);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("quartiers", quartiers.stream()
                    .map(this::createQuartierResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Rechercher des quartiers
     * GET /api/cities/quartiers/search?keyword=akwa
     */
    @GetMapping("/quartiers/search")
    public ResponseEntity<?> searchQuartiers(@RequestParam String keyword) {
        try {
            List<Quartier> quartiers = cityService.searchQuartiers(keyword);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("quartiers", quartiers.stream()
                    .map(this::createQuartierResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les quartiers avec des annonces actives
     * GET /api/cities/quartiers/with-listings
     */
    @GetMapping("/quartiers/with-listings")
    public ResponseEntity<?> getQuartiersWithListings() {
        try {
            List<Quartier> quartiers = cityService.getQuartiersWithActiveListings();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("quartiers", quartiers.stream()
                    .map(this::createQuartierResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Obtenir les quartiers les plus populaires
     * GET /api/cities/quartiers/popular
     */
    @GetMapping("/quartiers/popular")
    public ResponseEntity<?> getPopularQuartiers() {
        try {
            List<Object[]> popularQuartiers = cityService.getMostPopularQuartiers();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("quartiers", popularQuartiers.stream()
                    .map(this::createQuartierWithCountResponse).toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // ENDPOINTS ADMIN (pour plus tard)
    // ============================================

    /**
     * Créer une nouvelle ville (ADMIN)
     * POST /api/cities
     */
    @PostMapping
    public ResponseEntity<?> createCity(@RequestBody Map<String, String> request) {
        try {
            String nom = request.get("nom");
            String region = request.get("region");

            if (nom == null || region == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Nom et région sont obligatoires"));
            }

            City city = cityService.createCity(nom, region);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Ville créée avec succès");
            response.put("city", createCityResponse(city));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Créer un nouveau quartier (ADMIN)
     * POST /api/cities/{cityId}/quartiers
     */
    @PostMapping("/{cityId}/quartiers")
    public ResponseEntity<?> createQuartier(@PathVariable Long cityId,
                                            @RequestBody Map<String, String> request) {
        try {
            String nom = request.get("nom");

            if (nom == null || nom.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Le nom du quartier est obligatoire"));
            }

            Quartier quartier = cityService.createQuartier(nom, cityId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Quartier créé avec succès");
            response.put("quartier", createQuartierResponse(quartier));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // ============================================
    // MÉTHODES UTILITAIRES
    // ============================================

    private Map<String, Object> createCityResponse(City city) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", city.getId());
        response.put("nom", city.getNom());
        response.put("region", city.getRegion());
        response.put("isActive", city.getIsActive());
        response.put("dateCreation", city.getDateCreation());
        return response;
    }

    private Map<String, Object> createCityWithCountResponse(Object[] data) {
        City city = (City) data[0];
        Long count = (Long) data[1];

        Map<String, Object> response = createCityResponse(city);
        response.put("nombreAnnonces", count);
        return response;
    }

    private Map<String, Object> createQuartierResponse(Quartier quartier) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", quartier.getId());
        response.put("nom", quartier.getNom());
        response.put("isActive", quartier.getIsActive());
        response.put("dateCreation", quartier.getDateCreation());

        // Ajouter les infos de la ville
        Map<String, Object> cityInfo = new HashMap<>();
        cityInfo.put("id", quartier.getCity().getId());
        cityInfo.put("nom", quartier.getCity().getNom());
        cityInfo.put("region", quartier.getCity().getRegion());
        response.put("city", cityInfo);

        return response;
    }

    private Map<String, Object> createQuartierWithCountResponse(Object[] data) {
        Quartier quartier = (Quartier) data[0];
        Long count = (Long) data[1];

        Map<String, Object> response = createQuartierResponse(quartier);
        response.put("nombreAnnonces", count);
        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}