package com.camerannonces.config;

import com.camerannonces.jwt.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuration de sécurité Spring avec JWT
 * Localisation: src/main/java/com/camerannonces/config/SecurityConfig.java
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Désactiver CSRF car nous utilisons JWT
                .csrf(csrf -> csrf.disable())

                // Configuration CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Configuration des autorisations
                .authorizeHttpRequests(auth -> auth
                        // === ENDPOINTS PUBLICS (pas d'authentification requise) ===

                        // Authentification
                        .requestMatchers("/api/auth/register").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/refresh").permitAll()
                        .requestMatchers("/api/auth/verify").permitAll()
                        .requestMatchers("/api/auth/check-phone").permitAll()
                        .requestMatchers("/api/auth/reset-password").permitAll()

                        // Catégories (lecture publique)
                        .requestMatchers("/api/categories").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()

                        // Villes et quartiers (lecture publique)
                        .requestMatchers("/api/cities").permitAll()
                        .requestMatchers("/api/cities/**").permitAll()

                        // Annonces (lecture publique uniquement)
                        .requestMatchers("/api/listings").permitAll() // Liste des annonces
                        .requestMatchers("/api/listings/{id}").permitAll() // Détail d'une annonce
                        .requestMatchers("/api/listings/{id}/view").permitAll() // Incrémenter vues
                        .requestMatchers("/api/listings/category/{categoryId}").permitAll() // Par catégorie

                        // Recherche (publique)
                        .requestMatchers("/api/search/**").permitAll()

                        // Endpoints techniques
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()

                        // === ENDPOINTS PROTÉGÉS (authentification JWT requise) ===

                        // Profil utilisateur
                        .requestMatchers("/api/auth/me").authenticated()
                        .requestMatchers("/api/auth/logout").authenticated()
                        .requestMatchers("/api/auth/change-password").authenticated()
                        .requestMatchers("/api/auth/token-info").authenticated()

                        // Gestion des annonces (création, modification, suppression)
                        .requestMatchers("/api/listings/create").authenticated()
                        .requestMatchers("/api/listings/*/edit").authenticated()
                        .requestMatchers("/api/listings/*/delete").authenticated()
                        .requestMatchers("/api/listings/*/boost").authenticated()
                        .requestMatchers("/api/listings/*/renew").authenticated()

                        // Gestion utilisateur
                        .requestMatchers("/api/user/**").authenticated()

                        // Favoris
                        .requestMatchers("/api/favorites/**").authenticated()

                        // Signalements et modération
                        .requestMatchers("/api/moderation/**").authenticated()

                        // Upload d'images
                        .requestMatchers("/api/images/**").authenticated()

                        // Statistiques utilisateur
                        .requestMatchers("/api/stats/**").authenticated()

                        // Tous les autres endpoints nécessitent une authentification
                        .anyRequest().authenticated()
                )

                // Gestion de session stateless (JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Ajouter le filtre JWT avant le filtre d'authentification Spring
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // Configuration des headers (Spring Boot 3.5.3+)
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin()) // Pour H2 console
                        .contentTypeOptions(Customizer.withDefaults()) // Remplace .and() par une config par défaut
                        .httpStrictTransportSecurity(hsts -> hsts
                                .maxAgeInSeconds(31536000)
                                .includeSubDomains(true)
                        )
                );

        return http.build();
    }

    /**
     * Configuration CORS pour permettre les requêtes du frontend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origines autorisées (en développement)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));

        // En production, spécifier les domaines exacts :
        // configuration.setAllowedOrigins(Arrays.asList(
        //     "http://localhost:3000",
        //     "https://camerannonces.cm",
        //     "https://www.camerannonces.cm"
        // ));

        // Méthodes HTTP autorisées
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // Headers autorisés
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Autoriser les credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // Headers exposés au client
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Content-Length",
                "X-Total-Count"
        ));

        // Durée de cache pour les requêtes preflight (1 heure)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Encoder pour les mots de passe
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}