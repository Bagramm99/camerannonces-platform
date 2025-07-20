package com.camerannonces.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.camerannonces.repository")
@EnableTransactionManagement
public class DatabaseConfig {

    // Configuration automatique par Spring Boot
    // Les propriétés sont dans l'application.properties
}