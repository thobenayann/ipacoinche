# Configuration Better Auth (sans interface cloud)

Better Auth est utilisé **en mode self-hosted** : tout tourne dans ton app Next.js, aucune création de projet sur better-auth.com ni `BETTER_AUTH_API_KEY`.

---

## 1. Variables d’environnement

À définir en **local** (`.env.local`) et sur **Vercel** (par environnement : Development, Preview, Production).

| Variable | Description | Exemple local | Exemple Vercel |
|----------|-------------|---------------|----------------|
| `POSTGRES_PRISMA_URL` | Connexion PostgreSQL (poolée, adaptée Prisma) | URL **Development** fournie par Vercel/Neon | Fournie automatiquement par l’intégration Neon |
| `BETTER_AUTH_SECRET` | Secret pour signer les sessions (≥ 32 caractères) | Générer : `npx @better-auth/cli secret` | À ajouter manuellement |
| `BETTER_AUTH_URL` | URL de base de l’app | `http://localhost:3000` | `https://ipacoinche.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Idem, pour le client | `http://localhost:3000` | `https://ipacoinche.vercel.app` |

- **En local** : mets `POSTGRES_PRISMA_URL` avec l’URL de l’environnement **Development** (depuis le dashboard Vercel/Neon).
- **Sur Vercel** : `POSTGRES_PRISMA_URL` est déjà définie par l’intégration base de données ; tu n’as pas à la modifier.

---

## 2. Fichiers déjà en place (rien à créer sur le cloud)

| Fichier | Rôle |
|---------|------|
| `lib/auth.ts` | Config Better Auth : Prisma, email/mot de passe, session, plugin nextCookies |
| `lib/auth-client.ts` | Client navigateur (`signIn`, `signUp`, `signOut`, `useSession`) |
| `lib/db.ts` | Instance Prisma (connexion à `POSTGRES_PRISMA_URL`) |
| `app/api/auth/[...all]/route.ts` | Route qui expose Better Auth (GET/POST vers `/api/auth/*`) |
| `middleware.ts` | Vérifie le cookie de session et redirige vers `/auth/login` si on accède à `/app` sans être connecté |
| `prisma/schema.prisma` | Modèles User, Session, Account, Verification (Better Auth) |

Aucune inscription ni configuration sur le site Better Auth : tout est dans le repo.

---

## 3. Migrations base de données

Une fois `POSTGRES_PRISMA_URL` configurée (en local dans `.env.local`, sur Vercel via l’intégration Neon) :

**En local** : Prisma ne charge que `.env`, pas `.env.local`. Utilise le script qui charge `.env.local` avant la migration :

```bash
pnpm run migrate:deploy
```

**Sur Vercel** : les variables sont injectées par l’intégration. Si ta commande de build exécute `prisma migrate deploy`, les migrations s’appliquent automatiquement.

---

## 4. Vérifier que tout est bon

- **Local** : `pnpm run dev` → ouvrir `http://localhost:3000/auth/signup`, créer un compte, puis aller sur `/app`.
- **Vercel** : après déploiement, même scénario sur l’URL de l’app (avec `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL` pointant vers cette URL).

Pas besoin de ngrok, de tunnel ni de compte Better Auth cloud pour ça.
