# /spec/40-auth/41-roles-acces.md

## Admin
- Accès aux routes /app (gestion)
- Peut créer/éditer/supprimer (si prévu) ses tournois
- Peut générer/activer lien lecture seule

## Joueur (lecture seule)
- Accès via /t/[token] (ou route équivalente)
- Aucun accès aux fonctions admin
- Peut voir classement + tours + détails joueurs