# 🚗 Tomobilti - Plateforme de Location de Voitures au Maroc

Une plateforme moderne de location de voitures entre particuliers adaptée au marché marocain.

## ✨ Fonctionnalités

### 🔐 **Sécurité Avancée**
- ✅ Authentification JWT avec tokens sécurisés
- ✅ Hashage des mots de passe avec bcrypt (12 rounds)
- ✅ Protection CSRF et validation des entrées
- ✅ Rate limiting pour prévenir les abus
- ✅ Vérification d'autorisation pour toutes les ressources

### 🏗️ **Architecture Robuste**
- ✅ PostgreSQL avec Drizzle ORM
- ✅ API RESTful avec Express.js et TypeScript
- ✅ Frontend React avec TailwindCSS et Radix UI
- ✅ Validation des données avec Zod
- ✅ Pool de connexions optimisé

### 🎨 **UX/UI Moderne**
- ✅ Design responsive mobile-first
- ✅ Interface en français adaptée au Maroc
- ✅ Système de composants cohérent
- ✅ Gestion des états de chargement et d'erreur
- ✅ Navigation accessible avec ARIA labels

### 🚀 **Performance**
- ✅ Indexes de base de données optimisés
- ✅ Requêtes SQL optimisées avec pagination
- ✅ Composants React optimisés avec React Query
- ✅ Gestion du cache côté client

## 🛠️ Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Cloner le projet
```bash
git clone https://github.com/your-username/tomobilti.git
cd tomobilti
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
```bash
node scripts/setup-env.cjs
```

Cela créera un fichier `.env` avec :
- JWT secret sécurisé généré automatiquement
- Mot de passe de démonstration : `Demo123!`
- Configuration par défaut

### 4. Configurer PostgreSQL

Mettez à jour le `DATABASE_URL` dans `.env` :
```
DATABASE_URL=postgresql://username:password@localhost:5432/tomobilti
```

### 5. Initialiser la base de données
```bash
# Créer les tables
npm run db:push

# Optionnel: Appliquer les indexes optimisés
psql -d tomobilti -f scripts/init-db.sql
```

### 6. Lancer l'application
```bash
# Mode développement
npm run dev

# Ou séparément
npm run dev:server  # Backend sur port 5000
npm run dev:client  # Frontend sur port 5173
```

## 🗄️ Structure de la Base de Données

### Tables Principales
- **users** - Utilisateurs (locataires/propriétaires)
- **cars** - Véhicules avec détails complets
- **bookings** - Réservations avec gestion des conflits
- **reviews** - Système de notation et commentaires

### Indexes Optimisés
- Recherche par ville, type de carburant, transmission
- Filtrage par disponibilité et prix
- Recherche de conflits de réservation
- Performance des requêtes de pagination

## 🔐 API Endpoints

### Authentification
```
POST /api/auth/login     # Connexion
POST /api/auth/register  # Inscription
GET  /api/auth/me        # Profile utilisateur
```

### Véhicules
```
GET    /api/cars         # Rechercher véhicules (avec filtres)
GET    /api/cars/:id     # Détails véhicule
POST   /api/cars         # Créer véhicule (propriétaires uniquement)
PUT    /api/cars/:id     # Modifier véhicule (propriétaire uniquement)
DELETE /api/cars/:id     # Supprimer véhicule (propriétaire uniquement)
```

### Réservations
```
GET    /api/bookings/renter/:id  # Réservations d'un locataire
GET    /api/bookings/owner/:id   # Réservations d'un propriétaire
POST   /api/bookings             # Créer réservation
PUT    /api/bookings/:id         # Modifier réservation
DELETE /api/bookings/:id         # Annuler réservation
```

### Avis
```
GET  /api/reviews/car/:id        # Avis d'un véhicule
POST /api/reviews                # Créer avis
```

## 🛡️ Sécurité Implémentée

### Protection des Données
- Mots de passe hashés avec bcrypt (12 rounds)
- Tokens JWT avec expiration (7 jours)
- Validation côté serveur avec Zod
- Sanitisation des entrées utilisateur

### Protection des API
- Rate limiting (100 requêtes/15min, 5 auth/15min)
- Helmet.js pour les headers de sécurité
- Protection CSRF
- Vérification d'autorisation sur toutes les ressources

### Gestion des Erreurs
- Messages d'erreur localisés en français
- Logs sécurisés sans exposition de données sensibles
- Gestion gracieuse des erreurs réseau et serveur

## 🎨 Design System

### Couleurs
- **Primaire** : Vert Morocco (`hsl(150 60% 35%)`)
- **Accent** : Rouge chaleureux (`hsl(0 70% 45%)`)
- **Monnaie** : MAD (Dirham Marocain)

### Composants
- Système de composants Radix UI
- TailwindCSS avec thème personnalisé
- Animations et transitions fluides
- Support mode sombre

## 📱 Fonctionnalités Frontend

### Pages Principales
- **Accueil** : Héros, véhicules populaires, statistiques
- **Recherche** : Filtres avancés, tri, pagination
- **Détails** : Informations complètes, réservation, avis
- **Tableaux de bord** : Propriétaire et locataire
- **Profil** : Gestion compte et préférences

### Composants Clés
- `CarCard` - Carte véhicule avec tous les détails
- `SearchFilters` - Filtres de recherche avancés
- `BookingModal` - Processus de réservation
- `Header` - Navigation avec authentification
- `LoadingSpinner` - États de chargement

## 🚀 Déploiement

### Variables d'Environnement de Production
```bash
NODE_ENV=production
DATABASE_URL=your_production_postgresql_url
JWT_SECRET=your_secure_jwt_secret
STRIPE_SECRET_KEY=your_stripe_live_key
PORT=5000
```

### Build de Production
```bash
npm run build
npm start
```

## 🧪 Tests et Qualité

### À Implémenter
- Tests unitaires avec Jest
- Tests d'intégration API
- Tests E2E avec Playwright
- Linting ESLint + Prettier

## 📋 Roadmap

### Phase 1 ✅ (Complétée)
- Authentification sécurisée
- CRUD véhicules complet
- Système de réservation
- Interface utilisateur moderne

### Phase 2 🚧 (En cours)
- Paiements Stripe
- Notifications en temps réel
- Géolocalisation avancée
- App mobile React Native

### Phase 3 📋 (Planifiée)
- Intelligence artificielle pour recommandations
- Support multilingue (Arabe)
- Intégration IoT véhicules
- Analytics avancés

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

- 📧 Email: support@tomobilti.ma
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/tomobilti/issues)
- 📚 Documentation: [Wiki](https://github.com/your-username/tomobilti/wiki)

---

**Développé avec ❤️ pour le marché marocain** 🇲🇦