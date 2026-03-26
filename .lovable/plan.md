
# 🚗 RideShare App — Covoiturage 2.0

Application de covoiturage qui corrige les limites de Poparide avec un système de matching bidirectionnel.

## Pages & Navigation

- **Page d'accueil** : Hero avec recherche rapide (départ → arrivée → date/heure) + CTA inscription
- **Inscription/Connexion** : Auth avec email + profil (chauffeur ou passager, ou les deux)
- **Tableau de bord** : Vue personnalisée selon le rôle

## Fonctionnalités Chauffeur

### Mode 1 — Trajet planifié
- Publier un trajet : ville départ → ville arrivée, date, heure, places disponibles, prix par place
- Gérer ses trajets publiés (modifier, annuler)

### Mode 2 — Mode Disponible 🔥 (le game changer)
- Bouton "Je suis dispo" avec :
  - Zone de disponibilité (ville + rayon en km)
  - Créneau horaire (ex: 14h-20h)
  - Nombre de places
- Apparaît dans les résultats quand un passager cherche dans la zone
- Reçoit des notifications quand un passager fait une demande dans sa zone

## Fonctionnalités Passager

### Recherche classique
- Départ → Arrivée → Date/Heure
- Résultats en liste + vue carte (Google Maps)
- Voir les chauffeurs en trajet planifié ET les chauffeurs en mode dispo dans la zone

### Demande ouverte 🔥
- "Je cherche un trajet" : publier une demande visible par les chauffeurs dispo
- Les chauffeurs à proximité reçoivent une notification

## Réservation & Paiement
- Réservation avec confirmation du chauffeur
- Choix du mode de paiement : en ligne (Stripe) ou en cash
- Historique des trajets et paiements

## Communication
- Chat intégré entre chauffeur et passager après match
- Option de partager son numéro de téléphone

## Carte interactive
- Vue carte avec les chauffeurs disponibles en temps réel
- Vue liste par défaut, toggle vers la carte

## Notifications
- Nouveau match / nouvelle demande dans la zone
- Confirmation de réservation
- Messages du chat

## Backend (Supabase)
- Auth + profils utilisateurs
- Tables : trajets, disponibilités, demandes, réservations, messages, paiements
- Matching engine via requêtes géographiques
- Notifications en temps réel (Supabase Realtime)

## Design
- Interface mobile-first, moderne et épurée
- Couleurs : bleu/vert (confiance + mobilité)
- Bilingue FR/EN prévu pour plus tard
