# 🇨🇲 CamerAnnonces Platform

> Plateforme d'annonces multi-catégories pour le Cameroun

## 🚀 Technologies

- **Backend** : Java 21 + Spring Boot 3.5
- **Frontend** : React.js + Tailwind CSS
- **Mobile** : React Native
- **Database** : PostgreSQL 15
- **Security** : Spring Security + JWT

## 📱 Fonctionnalités

- ✅ 12 catégories d'annonces (Téléphones, Véhicules, Immobilier...)
- ✅ Géolocalisation (10 régions, 25+ villes camerounaises)
- ✅ 4 plans utilisateur (Gratuit, Basic, Pro, Boutique)
- ✅ Upload photos multiples
- ✅ Contact WhatsApp direct
- ✅ Recherche avancée + filtres
- ✅ Système de modération
- ✅ Interface responsive

## 🏗️ Architecture

# 🇨🇲 CamerAnnonces — Plateforme d'Annonces du Cameroun

> Backend Java Spring Boot · Frontend React (Vite + Tailwind) · Mobile Expo (React Native)

---

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation & Démarrage](#installation--démarrage)
- [Base de données](#base-de-données)
- [API Endpoints](#api-endpoints)
- [Fonctionnalités](#fonctionnalités)
- [Variables d'environnement](#variables-denvironnement)
- [Déploiement](#déploiement)
- [Problèmes courants](#problèmes-courants)
- [Contribuer](#contribuer)

---

## 🎯 Vue d'ensemble

**CamerAnnonces** est une plateforme d'annonces classées dédiée au marché camerounais.
Elle permet à tout utilisateur de publier, rechercher et contacter des vendeurs
directement via WhatsApp, sans complication.

### 12 Catégories disponibles

| Emoji | Catégorie              | Description                          |
|-------|------------------------|--------------------------------------|
| 📱    | Téléphones & Accessoires | Smartphones, tablettes, accessoires |
| 🚗    | Véhicules              | Voitures, motos, pièces détachées    |
| 🏠    | Immobilier             | Locations, ventes, terrains          |
| 👕    | Mode & Beauté          | Vêtements, chaussures, cosmétiques   |
| 💼    | Emplois & Services     | Offres d'emploi, freelance           |
| 🖥️    | Électronique           | TV, ordinateurs, électroménager      |
| 🎉    | Mariage & Événements   | Robes, DJ, décoration                |
| 🛠️    | Services Domestiques   | Plomberie, électricité, ménage       |
| 🐔    | Agriculture & Élevage  | Animaux, outils agricoles            |
| 📚    | Éducation              | Cours particuliers, formations       |
| 🍖    | Alimentation           | Produits locaux, poisson fumé        |
| 🧩    | Autres                 | Tout le reste                        |

---

## 🛠️ Technologies utilisées

### Backend
- **Java 21** (Amazon Corretto)
- **Spring Boot 3.5.3**
- **Spring Security 6.5** + JWT (`jjwt 0.12.3`)
- **Spring Data JPA** + Hibernate 6.6
- **PostgreSQL 15**
- **HikariCP** (pool de connexions)
- **Lombok** + **Maven**

### Frontend Web
- **React 18** + **TypeScript**
- **Vite** (bundler) + **Tailwind CSS**
- **React Router DOM** + **Axios**

### Application Mobile
- **Expo** (React Native) + **TypeScript**
- **Expo Router** (navigation)

---

## 🏗️ Architecture du projet
```
Cameranonces-project/
├── backend/
│   └── camerannonces-backend/         ← Spring Boot API (Port 8082)
│       └── src/main/java/com/camerannonces/
│           ├── config/                ← CORS, Security, JWT
│           ├── controller/            ← REST Controllers
│           ├── dto/                   ← Data Transfer Objects
│           ├── entity/                ← Entités JPA
│           ├── enums/                 ← Énumérations
│           ├── jwt/                   ← JWT Filter & Utils
│           ├── repository/            ← Spring Data Repositories
│           ├── service/               ← Logique métier
│           └── util/                  ← Utilitaires
├── frontend-web/                      ← React + Vite (Port 5173)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── hooks/
└── mobile-app/
    └── CamerAnnoncesExpo/             ← Application Expo
        └── src/
            ├── screens/
            ├── components/
            └── navigation/
```

---

## ✅ Prérequis

| Outil       | Version minimale       | Vérification        |
|-------------|------------------------|---------------------|
| Java (JDK)  | 17+ (21 recommandé)    | `java -version`     |
| Maven       | 3.8+                   | `mvn -version`      |
| Node.js     | 18+                    | `node -v`           |
| npm         | 9+                     | `npm -v`            |
| PostgreSQL  | 15+                    | `psql --version`    |
| Git         | 2.x                    | `git --version`     |

---

## 🚀 Installation & Démarrage

### 1. Backend Spring Boot

#### Configurer la base de données

Ouvrir **pgAdmin** ou **psql** :
```sql
CREATE DATABASE camerannonces_db;
CREATE USER camerannonces_user WITH PASSWORD 'ton_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE camerannonces_db TO camerannonces_user;
```

Exécuter le script SQL :
```bash
psql -U camerannonces_user -d camerannonces_db -f database/schema.sql
```

#### Configurer `application-dev.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/camerannonces_db
spring.datasource.username=camerannonces_user
spring.datasource.password=ton_mot_de_passe
server.port=8082
spring.jpa.hibernate.ddl-auto=validate
jwt.secret=ta_cle_secrete_jwt_minimum_256_bits
jwt.expiration=86400000
```

#### Démarrer

Via **IntelliJ** : cliquer ▶️ Run sur `CamerannoncesBackendApplication.java`

Via **terminal** :
```bash
cd backend/camerannonces-backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

✅ Backend disponible sur : **http://localhost:8082**

---

### 2. Frontend Web
```bash
cd frontend-web
npm install
npm run dev
```

✅ Frontend disponible sur : **http://localhost:5173**

Build production :
```bash
npm run build
# Fichiers générés dans dist/
```

---

### 3. Application Mobile (Expo)
```bash
cd mobile-app/CamerAnnoncesExpo
npm install
npx expo start
```

| Touche   | Action                                     |
|----------|--------------------------------------------|
| `w`      | Ouvrir dans le navigateur                  |
| `a`      | Ouvrir sur émulateur Android               |
| `i`      | Ouvrir sur simulateur iOS                  |
| QR code  | Ouvrir sur téléphone via **Expo Go**       |

> 💡 Installe **Expo Go** sur ton téléphone pour tester directement.

---

## 🗄️ Base de données

### 8 Tables principales

| Table            | Description                   |
|------------------|-------------------------------|
| `users`          | Comptes utilisateurs          |
| `categories`     | 12 catégories d'annonces      |
| `cities`         | 25 villes camerounaises       |
| `quartiers`      | Quartiers par ville           |
| `listings`       | Annonces publiées             |
| `listing_images` | Photos des annonces           |
| `user_favorites` | Favoris des utilisateurs      |
| `signals`        | Signalements d'annonces       |

### Données pré-insérées

- ✅ 12 catégories avec emojis
- ✅ 25 villes camerounaises (10 régions)
- ✅ Quartiers de Douala, Yaoundé et Bafoussam
- ✅ 3 utilisateurs de test
- ✅ 15 annonces de test variées

---

## 🌐 API Endpoints

### Authentification
```
POST   /api/auth/register     Inscription
POST   /api/auth/login        Connexion (retourne JWT)
```

### Annonces
```
GET    /api/listings           Liste paginée
POST   /api/listings           Créer annonce       [JWT]
GET    /api/listings/{id}      Détail annonce
PUT    /api/listings/{id}      Modifier annonce    [JWT]
DELETE /api/listings/{id}      Supprimer annonce   [JWT]
```

### Catégories & Villes
```
GET    /api/categories
GET    /api/cities
GET    /api/cities/{id}/quartiers
```

### Recherche
```
GET    /api/search?q=...&category=...&ville=...&minPrix=...&maxPrix=...
```

### Favoris
```
GET    /api/favorites          Mes favoris          [JWT]
POST   /api/favorites/{id}     Ajouter              [JWT]
DELETE /api/favorites/{id}     Retirer              [JWT]
```

### Signalement
```
POST   /api/signal
```

> `[JWT]` = ajouter `Authorization: Bearer <token>` dans le header HTTP

---

## ✨ Fonctionnalités

| Fonctionnalité                    | Web | Mobile |
|-----------------------------------|-----|--------|
| Parcourir les annonces            | ✅  | ✅     |
| Recherche avancée                 | ✅  | ✅     |
| Filtres catégorie / ville / prix  | ✅  | ✅     |
| Inscription & Connexion           | ✅  | ✅     |
| Publier une annonce               | ✅  | ✅     |
| Upload de photos                  | ✅  | ✅     |
| Contact vendeur via WhatsApp      | ✅  | ✅     |
| Gestion des favoris               | ✅  | ✅     |
| Signaler une annonce              | ✅  | ✅     |
| Compte Boutique Pro               | 🔜  | 🔜     |

---

## 🔐 Variables d'environnement

### Backend (`application-dev.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/camerannonces_db
spring.datasource.username=camerannonces_user
spring.datasource.password=MOT_DE_PASSE
server.port=8082
jwt.secret=CLE_SECRETE_JWT_256_BITS
jwt.expiration=86400000
```

### Frontend Web (`.env`)
```env
VITE_API_URL=http://localhost:8082/api
```

### Mobile (`.env`)
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:8082/api
```

> ⚠️ Pour le mobile, utilise ton **IP locale** (pas `localhost`).
> Trouve-la avec `ipconfig` (Windows) ou `ifconfig` (Mac/Linux).

---

## 🌍 Déploiement

### Backend (VPS Ubuntu)
```bash
mvn clean package -DskipTests
scp target/camerannonces-backend.jar user@ip:/opt/camerannonces/
java -jar -Dspring.profiles.active=prod camerannonces-backend.jar
```

### Frontend (Netlify / Vercel)
```bash
npm run build
# Déployer le dossier dist/
```

### Mobile (Play Store)
```bash
eas build --platform android
```

---

## 🐛 Problèmes courants

**Backend ne démarre pas**
- Vérifier que PostgreSQL est lancé : `pg_ctl status`
- Vérifier le mot de passe dans `application-dev.properties`
- Vérifier que le port 8082 est libre : `netstat -ano | findstr 8082`

**Erreur CORS (frontend)**
- Vérifier que `VITE_API_URL` pointe sur `http://localhost:8082`
- Vérifier la configuration dans `CorsConfig.java`

**Mobile ne se connecte pas**
- Utiliser l'**IP locale**, pas `localhost`
- Autoriser le port 8082 dans le pare-feu Windows

**Warning Spring Security (leading slash)**
```java
// Corriger dans SecurityConfig.java
// Avant  :  "api/listings/**"
// Après  : "/api/listings/**"
```

---

## 👨‍💻 Contribuer

1. Fork le projet
2. Créer une branche : `git checkout -b feature/ma-fonctionnalite`
3. Committer : `git commit -m "feat: ajout de ma fonctionnalité"`
4. Pousser : `git push origin feature/ma-fonctionnalite`
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence **MIT**.

---

<div align="center">

Fait avec ❤️ pour le Cameroun 🇨🇲

**Backend · Port 8082 | Frontend · Port 5173 | Mobile · Expo Go**

</div>

API Key Afrika's talking

atsk_638e6e53b75a48bb3bde5b6b9bddaea70e0a5ed005a0d57418b32cf4f0f596af59b9e44a
