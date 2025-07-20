package com.camerannonces.service;

import com.camerannonces.entity.City;
import com.camerannonces.entity.Quartier;
import com.camerannonces.repository.CityRepository;
import com.camerannonces.repository.QuartierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class CityService {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private QuartierRepository quartierRepository;

    /**
     * Obtenir toutes les villes actives
     */
    public List<City> getAllActiveCities() {
        return cityRepository.findByIsActiveTrueOrderByNom();
    }

    /**
     * Obtenir toutes les régions
     */
    public List<String> getAllRegions() {
        return cityRepository.findAllRegions();
    }

    /**
     * Obtenir les villes par région
     */
    public List<City> getCitiesByRegion(String region) {
        return cityRepository.findByRegionAndIsActiveTrue(region);
    }

    /**
     * Obtenir une ville par ID
     */
    public Optional<City> getCityById(Long id) {
        return cityRepository.findById(id);
    }

    /**
     * Obtenir une ville par nom
     */
    public Optional<City> getCityByNom(String nom) {
        return cityRepository.findByNom(nom);
    }

    /**
     * Rechercher des villes
     */
    public List<City> searchCities(String keyword) {
        return cityRepository.searchByKeyword(keyword);
    }

    /**
     * Obtenir les villes avec des annonces actives
     */
    public List<City> getCitiesWithActiveListings() {
        return cityRepository.findCitiesWithActiveListings();
    }

    /**
     * Obtenir les villes les plus populaires (avec le plus d'annonces)
     */
    public List<Object[]> getMostPopularCities() {
        return cityRepository.findMostPopularCities();
    }

    /**
     * Obtenir les statistiques par région
     */
    public List<Object[]> getCitiesStatsByRegion() {
        return cityRepository.countCitiesByRegion();
    }

    // ============================================
    // GESTION DES QUARTIERS
    // ============================================

    /**
     * Obtenir tous les quartiers d'une ville
     */
    public List<Quartier> getQuartiersByCity(Long cityId) {
        return quartierRepository.findByCityIdAndIsActiveTrue(cityId);
    }

    /**
     * Obtenir tous les quartiers d'une ville par nom
     */
    public List<Quartier> getQuartiersByCityName(String cityName) {
        return quartierRepository.findByCityNameAndActive(cityName);
    }

    /**
     * Obtenir tous les quartiers par région
     */
    public List<Quartier> getQuartiersByRegion(String region) {
        return quartierRepository.findByRegion(region);
    }

    /**
     * Rechercher des quartiers
     */
    public List<Quartier> searchQuartiers(String keyword) {
        return quartierRepository.searchByKeyword(keyword);
    }

    /**
     * Obtenir les quartiers avec des annonces actives
     */
    public List<Quartier> getQuartiersWithActiveListings() {
        return quartierRepository.findQuartiersWithActiveListings();
    }

    /**
     * Obtenir les quartiers les plus populaires
     */
    public List<Object[]> getMostPopularQuartiers() {
        return quartierRepository.findMostPopularQuartiers();
    }

    /**
     * Créer une nouvelle ville (pour admin)
     */
    @Transactional
    public City createCity(String nom, String region) {
        if (cityRepository.findByNom(nom).isPresent()) {
            throw new RuntimeException("Une ville avec ce nom existe déjà");
        }

        City city = new City();
        city.setNom(nom);
        city.setRegion(region);
        city.setIsActive(true);

        return cityRepository.save(city);
    }

    /**
     * Créer un nouveau quartier (pour admin)
     */
    @Transactional
    public Quartier createQuartier(String nom, Long cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new RuntimeException("Ville non trouvée"));

        // Vérifier si le quartier existe déjà dans cette ville
        if (quartierRepository.findByNomAndCityId(nom, cityId).isPresent()) {
            throw new RuntimeException("Un quartier avec ce nom existe déjà dans cette ville");
        }

        Quartier quartier = new Quartier();
        quartier.setNom(nom);
        quartier.setCity(city);
        quartier.setIsActive(true);

        return quartierRepository.save(quartier);
    }
}