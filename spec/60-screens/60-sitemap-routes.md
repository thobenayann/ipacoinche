# /spec/60-screens/60-sitemap-routes.md

## Routes (App Router - suggestion d’emplacements)
### Auth
- /auth/login
- /auth/signup
- /auth/forgot-password

### Admin (app)
- /app (home tournois)
- /app/tournaments/new
- /app/tournaments/[id]
- /app/tournaments/[id]/setup
- /app/tournaments/[id]/rounds/[roundIndex]
- /app/tournaments/[id]/leaderboard
- /app/tournaments/[id]/players/[playerId]
- /app/tournaments/[id]/share
- /app/tournaments/[id]/settings
- /app/tournaments/[id]/close
- /app/demo (mode démo admin)

### Lecture seule
- /t/[token] (home lecture seule)
- /t/[token]/leaderboard
- /t/[token]/rounds/[roundIndex]
- /t/[token]/players/[playerPublicId]