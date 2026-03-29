package com.camerannonces.config;

import com.camerannonces.jwt.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

/**
 * Configuration Spring Security avec JWT
 * Localisation: src/main/java/com/camerannonces/config/SecurityConfig.java
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Désactiver CSRF (non nécessaire pour API REST avec JWT)
                .csrf(csrf -> csrf.disable())

                // Configuration CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Configuration des autorisations
                .authorizeHttpRequests(authz -> authz
                        // ========================================
                        // ENDPOINTS PUBLICS (KEINE AUTHENTIFIZIERUNG)
                        // ========================================
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        .requestMatchers("/api/cities/**").permitAll()
                        .requestMatchers("/api/search/**").permitAll()

                        // ========================================
                        // LISTINGS - ÖFFENTLICHE ENDPOINTS
                        // ========================================
                        // Einzelnes Listing ansehen (GET)
                        .requestMatchers(HttpMethod.GET, "/api/listings/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/listings/{id}/similar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/listings/category/{categoryId}").permitAll()

                        // Alle Listings auflisten (GET)
                        .requestMatchers(HttpMethod.GET, "/api/listings").permitAll()

                        // ========================================
                        // LISTINGS - GESCHÜTZTE ENDPOINTS
                        // ========================================
                        // User-spezifische Listings (AUTHENTIFIZIERT)
                        .requestMatchers("/api/listings/user/me").authenticated()
                        .requestMatchers("/api/listings/user/{userId}").authenticated()

                        // Listing Management (AUTHENTIFIZIERT)
                        .requestMatchers(HttpMethod.POST, "/api/listings").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/listings/{id}/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/listings/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/listings/{id}").authenticated()

                        // ========================================
                        // IMAGES (AUTHENTIFIZIERT)
                        // ========================================
                        .requestMatchers("/api/images/**").authenticated()

                        // ========================================
                        // USERS (AUTHENTIFIZIERT)
                        // ========================================
                        .requestMatchers("/api/users/**").authenticated()
                        .requestMatchers("/api/user/**").authenticated()

                        // ========================================
                        // FAVORITES (AUTHENTIFIZIERT)
                        // ========================================
                        .requestMatchers("/api/favorites/**").authenticated()

                        // ========================================
                        // ALLE ANDEREN (AUTHENTIFIZIERT)
                        // ========================================
                        .anyRequest().authenticated()
                )
                // Configuration de session (stateless pour JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // ✅ WICHTIG: JWT Filter HINZUFÜGEN!
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // Désactiver la page de login par défaut
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Autoriser le frontend React (localhost:5173)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));

        // Méthodes HTTP autorisées
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Headers autorisés
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Autoriser les credentials (cookies, auth headers)
        configuration.setAllowCredentials(true);

        // Headers exposés au client
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}