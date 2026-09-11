# RideLink Pro

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/) [![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/) [![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

**Plateforme de covoiturage qui connecte conducteurs et passagers autour de trajets partagés.**

RideLink Pro est une application web React permettant de rechercher des trajets, publier une offre, envoyer une demande et communiquer avec les autres utilisateurs. Le parcours est organisé autour d'un matching entre l'offre et la demande, avec authentification et espaces protégés.

## Ce que l'application permet

- **Recherche de trajets** — recherche par ville de départ et d'arrivée.
- **Publication de trajets** — un utilisateur authentifié peut publier un trajet.
- **Mode conducteur disponible** — signaler sa disponibilité pour être trouvé par des passagers.
- **Demandes de trajet** — envoyer et gérer des demandes.
- **Matching offre/demande** — rapprocher conducteurs et passagers compatibles.
- **Profils** — consulter et gérer son profil utilisateur.
- **Messagerie** — communiquer autour des trajets et réservations.
- **Paiement flexible** — l'interface présente un parcours compatible avec paiement en ligne ou en espèces.
- **Authentification** — inscription, connexion et réinitialisation du mot de passe.

La navigation actuelle comprend notamment `/search`, `/trip/:id`, `/publish`, `/dashboard`, `/profile`, `/request` et `/messages`. Les espaces sensibles sont protégés par un composant `ProtectedRoute`.

## Parcours principal

```text
Rechercher / publier un trajet
          ↓
     Trouver un match
          ↓
      Demander / accepter
          ↓
       Communiquer
          ↓
       Organiser le trajet
```

## Stack technique

- **Frontend:** React 18 + TypeScript
- **Build:** Vite 5
- **Routing:** React Router
- **Backend & données:** Supabase
- **State/data fetching:** TanStack Query
- **UI:** Tailwind CSS + Radix UI / shadcn-style components
- **Animations:** Framer Motion
- **Forms & validation:** React Hook Form + Zod
- **Icons:** Lucide React
- **Testing:** Vitest + Testing Library
- **E2E tooling:** Playwright est présent dans les dépendances de développement

## Développement

Prérequis : Node.js et npm.

```bash
npm install
npm run dev
```

Build de production :

```bash
npm run build
```

Lint et tests :

```bash
npm run lint
npm test
```

## Structure

```text
src/
├── components/       # UI, layout, protection des routes et composants métier
├── contexts/         # Contexte d'authentification
├── pages/            # Recherche, trajets, demandes, dashboard, messages...
├── lib/              # Utilitaires et intégrations
└── App.tsx           # Providers et routing
```

## État du projet

RideLink Pro est une application web en développement. Le dépôt contient déjà le parcours de recherche, publication, authentification, demandes, profils, trajets et messagerie ; les capacités réellement disponibles dépendent de la configuration backend et de l'état des intégrations Supabase.

## Auteur

**Ravel Momo** — [@Notho-freedom](https://github.com/Notho-freedom)
