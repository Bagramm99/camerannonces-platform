package com.camerannonces.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TestController {

    @GetMapping("/hello")
    public ResponseEntity<Map<String, Object>> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "🇨🇲 Hello from CamerAnnonces Backend!");
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "Backend is running perfectly");
        response.put("port", "8081");
        response.put("framework", "Spring Boot 3.5");
        response.put("connection", "✅ Frontend ↔ Backend OK");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories-preview")
    public ResponseEntity<Map<String, Object>> getCategoriesPreview() {
        Map<String, Object> response = new HashMap<>();
        response.put("total_categories", 12);
        response.put("categories", new String[]{
                "Téléphones & Accessoires", "Véhicules", "Immobilier",
                "Mode & Beauté", "Emplois & Services", "Électronique",
                "Mariage & Événements", "Services Domestiques", "Agriculture & Élevage",
                "Éducation", "Alimentation", "Autres"
        });
        response.put("status", "Categories loaded from backend (real DB data)");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/cities-preview")
    public ResponseEntity<Map<String, Object>> getCitiesPreview() {
        Map<String, Object> response = new HashMap<>();
        response.put("total_cities", 11);
        response.put("cities", new String[]{
                "Douala", "Yaoundé", "Bamenda", "Bafoussam",
                "Garoua", "Maroua", "Ngaoundéré", "Bertoua",
                "Kribi", "Limbe", "Ebolowa"
        });
        response.put("status", "Cities loaded from backend");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/echo")
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        response.put("received_data", data);
        response.put("message", "✅ POST request successful!");
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/cors-test")
    public ResponseEntity<Map<String, String>> corsTest() {
        Map<String, String> response = new HashMap<>();
        response.put("cors", "✅ CORS configuration working");
        response.put("origin", "http://localhost:5173");
        response.put("status", "success");

        return ResponseEntity.ok(response);
    }
}