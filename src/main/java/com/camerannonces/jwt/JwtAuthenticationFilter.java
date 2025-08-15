package com.camerannonces.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Filtre JWT pour Spring Security
 * Localisation: src/main/java/com/camerannonces/jwt/JwtAuthenticationFilter.java
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private JwtProperties jwtProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Si JWT est désactivé, passer au filtre suivant
        if (!jwtProperties.isEnabled()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = extractJwtFromRequest(request);

            if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                String telephone = jwtTokenProvider.extractUsername(jwt);

                if (telephone != null && jwtTokenProvider.validateToken(jwt, telephone)) {
                    // Créer l'authentification Spring Security
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(telephone, null, new ArrayList<>());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // Ajouter des attributs à la requête pour accès facile
                    Long userId = jwtTokenProvider.extractUserId(jwt);
                    request.setAttribute("userId", userId);
                    request.setAttribute("telephone", telephone);

                    logger.debug("Utilisateur authentifié: " + telephone + " (ID: " + userId + ")");
                }
            }
        } catch (Exception e) {
            logger.error("Erreur lors de l'authentification JWT: " + e.getMessage());
            // Nettoyer le contexte de sécurité en cas d'erreur
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extraire le token JWT de la requête
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Endpoints publics qui ne nécessitent pas d'authentification
        return isPublicEndpoint(path, method);
    }

    /**
     * Déterminer si un endpoint est public
     */
    private boolean isPublicEndpoint(String path, String method) {
        // Endpoints d'authentification
        if (path.startsWith("/api/auth/")) {
            return true;
        }

        // Endpoints publics en lecture seule
        if ("GET".equals(method)) {
            return path.startsWith("/api/categories") ||
                    path.startsWith("/api/cities") ||
                    path.equals("/api/listings") ||
                    path.matches("/api/listings/[0-9]+") ||
                    path.startsWith("/api/search");
        }

        // Autres endpoints publics
        return path.startsWith("/error") ||
                path.startsWith("/h2-console") ||
                path.startsWith("/swagger") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/actuator");
    }
}