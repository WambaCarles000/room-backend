# Configuration Supabase - Guide

## Où trouver les identifiants Supabase ?

### 1. Dans le Dashboard Supabase (en ligne)

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet (ou crée-en un si tu n'en as pas)
3. Va dans **Project Settings** (icône d'engrenage en bas à gauche)
4. Clique sur **API** dans le menu de gauche

### 2. Identifiants à récupérer

#### Pour le Frontend (`.env.local` dans `room-frontend`)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (longue clé qui commence par eyJ)
```

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Pour le Backend (`.env` dans `room-backend`)

```
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=xxxxx (dans Database > Connection string > URI)
DB_NAME=postgres

SUPABASE_JWT_SECRET=xxxxx (dans Project Settings > API > JWT Secret)
```

- **Database Host** → `DB_HOST` (dans Database > Connection string)
- **Database Password** → `DB_PASSWORD` (dans Database > Connection string)
- **JWT Secret** → `SUPABASE_JWT_SECRET` (dans Project Settings > API > JWT Secret)

### 3. Vérifier que les tables sont créées

1. Dans le Dashboard Supabase, va dans **Table Editor** (menu de gauche)
2. Tu devrais voir les tables : `user`, `listing`, `listing_image`, `favorite`, `contact_request`
3. Si elles n'existent pas, c'est que TypeORM n'a pas encore synchronisé

### 4. Tester la connexion à la base de données

Tu peux utiliser un client PostgreSQL comme :
- **pgAdmin**
- **DBeaver**
- **TablePlus**
- Ou directement dans Supabase : **SQL Editor**

**Connection string** (trouvable dans Database > Connection string) :
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

## Problèmes courants

### "No metadata for Listing was found"
✅ **Corrigé** : Les entités sont maintenant listées explicitement dans `data-source.ts`

### "Invalid or expired token"
- Vérifie que `SUPABASE_JWT_SECRET` dans `.env` backend correspond bien au JWT Secret du dashboard
- Vérifie que le token envoyé depuis le frontend n'est pas expiré
- Vérifie que tu es bien connecté côté Supabase (session valide)

### Tables non créées dans Supabase
- Vérifie que `NODE_ENV=development` dans `.env` backend
- Vérifie que `synchronize: true` dans `data-source.ts` (déjà fait)
- Redémarre le backend Nest pour que TypeORM synchronise les tables
