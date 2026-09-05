# Qard

**Scanne, Une nouvelle façon de se présenter.**

Qard est un SaaS Next.js multi-tenant pour créer une carte de contact numérique, la partager via une URL permanente et télécharger un QR code qui reste valable quand le profil évolue.

## Stack

- Next.js 16, App Router, React 19 et TypeScript strict
- Supabase Auth, PostgreSQL, Row Level Security et Storage
- Tailwind CSS, composants shadcn/ui, Motion et Lucide
- Zod, React Hook Form et dnd-kit
- QRCode pour les exports PNG/SVG

## Installation

```bash
npm install
copy .env.example .env.local
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

## Configuration Supabase

1. Créer un projet Supabase.
2. Copier l'URL du projet et la clé **Publishable** dans `.env.local`.
3. Copier la clé **Service Role** dans `SUPABASE_SERVICE_ROLE_KEY`. Elle reste exclusivement côté serveur et sert aux analytics publics et à la suppression de compte.
4. Appliquer `supabase/migrations/20260905172919_initial_qard_schema.sql` depuis le SQL Editor ou le CLI Supabase lié au projet.
5. Dans Authentication → URL Configuration, définir le Site URL et ajouter `http://localhost:3000/auth/callback` et l'URL de callback Vercel.
6. En production, conserver la confirmation email et configurer un SMTP personnalisé.

La migration crée les tables `profiles`, `social_links`, `appearance`, `analytics_events`, `subscriptions`, les politiques RLS, le profil automatique après signup et les buckets `avatars` et `banners`.

## Authentification et stockage

Email/mot de passe, persistance SSR, réinitialisation et protection du dashboard sont actifs. Google OAuth est préparé pour une activation ultérieure. Les images acceptées sont JPG, PNG et WebP. Avatar : 5 Mo maximum. Bannière : 8 Mo maximum.

## Stripe

Le plan et les permissions sont centralisés dans `lib/qard/plans.ts`. Le checkout reste volontairement désactivé tant que Stripe n'est pas configuré. Le frontend ne peut jamais attribuer le plan Pro.

## Vercel

1. Importer ce dépôt dans Vercel et utiliser Node.js 22.
2. Copier les variables de `.env.example` dans les variables du projet.
3. Définir `NEXT_PUBLIC_APP_URL` avec l'URL de production sans slash final.
4. Ajouter l'URL de callback Vercel dans Supabase Auth.
5. Déployer.

Un seul projet Vercel et une seule base Supabase servent toutes les Qards via `/u/[slug]`.

## Vérifications

```bash
npm run test
npm run lint
npm run build
```

Routes publiques : `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/pricing`, `/privacy`, `/terms`, `/u/[slug]`.

Routes privées : `/onboarding`, `/dashboard`, `/dashboard/editor`, `/dashboard/links`, `/dashboard/appearance`, `/dashboard/qr`, `/dashboard/analytics`, `/dashboard/settings`.
