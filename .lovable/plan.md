

# Plan: Backend complet + Mobile-first + Autocompletion + Notifications + Stripe

## Vue d'ensemble

Implementation complete en une seule phase : backend Supabase (Lovable Cloud), autocompletion Mapbox, notifications push, Stripe, et refonte mobile-first de toutes les vues.

---

## Phase 1 — Backend Supabase (Lovable Cloud)

### 1.1 Activer Lovable Cloud
- Activer la base de données et l'authentification via Lovable Cloud

### 1.2 Schema de base de données
Tables a creer via migrations :

- **profiles** : `id (FK auth.users)`, `first_name`, `last_name`, `phone`, `avatar_url`, `role` (driver/passenger/both), `country`, `city`, `created_at`
- **user_roles** : `id`, `user_id (FK auth.users)`, `role` (enum: admin/moderator/user)
- **trips** (trajets planifies) : `id`, `driver_id`, `from_city`, `from_address`, `from_lat`, `from_lng`, `to_city`, `to_address`, `to_lat`, `to_lng`, `date`, `departure_time`, `seats_available`, `price_per_seat`, `vehicle`, `status`, `payment_method` (online/cash/both)
- **availabilities** (mode dispo) : `id`, `driver_id`, `city`, `lat`, `lng`, `radius_km`, `date`, `time_from`, `time_to`, `seats`, `vehicle`, `is_active`, `created_at`
- **ride_requests** (demandes passager) : `id`, `passenger_id`, `from_city`, `from_lat`, `from_lng`, `to_city`, `to_lat`, `to_lng`, `date`, `time`, `status`, `created_at`
- **bookings** : `id`, `trip_id`, `availability_id` (nullable), `passenger_id`, `driver_id`, `seats_booked`, `payment_method`, `payment_status`, `amount`, `status`, `created_at`
- **messages** : `id`, `booking_id`, `sender_id`, `content`, `read`, `created_at`
- **notifications** : `id`, `user_id`, `title`, `body`, `type`, `data` (jsonb), `read`, `created_at`

RLS sur toutes les tables. Trigger pour auto-creer le profil au signup.

### 1.3 Auth
- Connecter Login/Register pages a Supabase Auth
- Creer `AuthProvider` context avec `onAuthStateChange`
- Routes protegees (Dashboard, Publish) via `ProtectedRoute` component
- Adapter Navbar (afficher avatar/deconnexion quand connecte)
- Page de reset mot de passe (`/reset-password`)

---

## Phase 2 — Autocompletion Mapbox

### 2.1 Edge Function `geocode-autocomplete`
- Proxy vers Mapbox Geocoding API (`/mapbox.places/{query}`)
- Parametre `country` pour restreindre par pays
- Cle API Mapbox stockee en secret

### 2.2 Composant `LocationAutocomplete`
- Input avec debounce (300ms)
- Dropdown de suggestions (ville, adresse)
- Retourne `{ city, address, lat, lng }`
- Utilise la geolocation du navigateur pour detecter le pays et restreindre les resultats

### 2.3 Integration
- Remplacer tous les `Input` de localisation par `LocationAutocomplete` sur : Index (hero search), SearchPage, PublishPage

---

## Phase 3 — Pages manquantes et vues completes

### 3.1 Page Profil (`/profile`)
- Afficher/editer infos profil, vehicule, photo
- Historique des trajets

### 3.2 Page Demande Ouverte (`/request`)
- Formulaire pour publier une demande de trajet
- Declenche notifications aux chauffeurs dispo dans la zone

### 3.3 Page Chat / Messages (`/messages/:bookingId`)
- Chat temps reel via Supabase Realtime
- Liste des conversations dans le Dashboard

### 3.4 Page Details Trajet (`/trip/:id`)
- Infos completes du trajet
- Bouton reserver + choix paiement

### 3.5 Dashboard connecte
- Remplacer les donnees mock par les vraies donnees Supabase
- Stats reelles, vrais trajets, vraies demandes, vrais messages

---

## Phase 4 — Notifications Push

### 4.1 Service Worker + PWA setup
- Installer `vite-plugin-pwa`
- Configurer manifest, icones, meta tags mobile
- Service worker pour notifications push (Web Push API)

### 4.2 Edge Function `send-notification`
- Enregistrer les push subscriptions en base
- Envoyer des notifications via Web Push quand :
  - Nouveau match / demande dans la zone du chauffeur
  - Confirmation de reservation
  - Nouveau message
- Son de notification inclus

### 4.3 Table `push_subscriptions`
- `id`, `user_id`, `endpoint`, `p256dh`, `auth`, `created_at`

---

## Phase 5 — Stripe

- Activer l'integration Stripe via l'outil Lovable
- Paiement one-off pour les reservations (pas d'abonnement)
- Choix du mode de paiement a la reservation : en ligne (Stripe Checkout) ou cash
- Edge function pour creer la session de paiement
- Webhook pour mettre a jour le `payment_status` de la reservation

---

## Phase 6 — Mobile-First UI

### Principes
- Toutes les vues pensees d'abord pour ecrans < 400px, puis adaptees vers tablette/desktop
- Bottom navigation bar sur mobile (au lieu du hamburger menu)
- Touch targets minimum 44x44px
- Cards en full-width sur mobile
- Formulaires en single-column sur mobile
- Font sizes adaptes (plus grand sur mobile pour lisibilite)

### Composants a adapter
- **Navbar** : bottom tab bar mobile avec icones (Accueil, Rechercher, Publier, Messages, Profil)
- **SearchPage** : resultats en cards empilees, filtres en sheet/drawer
- **PublishPage** : formulaire single-column
- **Dashboard** : stats en 2 colonnes, contenu scrollable
- **Index** : hero compact, search bar prominent
- **Footer** : masque sur mobile (navigation via bottom bar)

---

## Details techniques

```text
Architecture:
┌─────────────────────────────────┐
│  React (Mobile-first UI)        │
│  ├─ AuthProvider (context)      │
│  ├─ LocationAutocomplete        │
│  ├─ BottomNavBar (mobile)       │
│  └─ Supabase Client             │
├─────────────────────────────────┤
│  Supabase (Lovable Cloud)       │
│  ├─ Auth                        │
│  ├─ Database + RLS              │
│  ├─ Realtime (chat, notifs)     │
│  └─ Edge Functions              │
│     ├─ geocode-autocomplete     │
│     ├─ send-notification        │
│     └─ create-checkout (Stripe) │
└─────────────────────────────────┘
```

### Fichiers cles a creer/modifier
- `src/contexts/AuthContext.tsx` — Auth state global
- `src/components/ProtectedRoute.tsx` — Route guard
- `src/components/LocationAutocomplete.tsx` — Input avec autocompletion Mapbox
- `src/components/BottomNav.tsx` — Navigation mobile
- `src/pages/ProfilePage.tsx` — Page profil
- `src/pages/RequestPage.tsx` — Demande ouverte
- `src/pages/MessagesPage.tsx` — Chat
- `src/pages/TripDetailPage.tsx` — Detail trajet
- `src/pages/ResetPasswordPage.tsx` — Reset mot de passe
- `supabase/functions/geocode-autocomplete/index.ts`
- `supabase/functions/send-notification/index.ts`
- Migrations pour toutes les tables
- Modification de toutes les pages existantes pour mobile-first + donnees reelles

### Pre-requis utilisateur
- Fournir cle API Mapbox (sera demandee via l'outil secrets)
- Fournir cle API Stripe (sera demandee via l'outil Stripe)
- Generer des cles VAPID pour les notifications push

