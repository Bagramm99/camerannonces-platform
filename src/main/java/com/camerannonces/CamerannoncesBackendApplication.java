package com.camerannonces;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.camerannonces.entity")
public class CamerannoncesBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(CamerannoncesBackendApplication.class, args);
    }
}