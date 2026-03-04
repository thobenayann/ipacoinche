# /spec/00-README.md

## Objectif
Ce dossier contient les spécifications fonctionnelles et UX de l’application "Tournoi de Coinche".
Il sert de source unique de vérité pour l’IA dans Cursor.

## Règles
- Pas de code ici.
- Pas de schéma Prisma ici.
- Chaque fichier précise :
  - les features attendues
  - les règles métier
  - les écrans
  - et les emplacements (routes, sections UI)

## Convention
- Routes Next.js (App Router) documentées dans: `/spec/60-screens/60-sitemap-routes.md`
- UI mobile-first, ShadcnUI, Tailwind, animations sobres (wow discret)
- Charte IPANOVA dans: `/spec/30-brand/30-ipanova-style.md`

## Priorité de lecture pour Cursor
1. 60-sitemap-routes
2. 50-regles-metier + 51-classement
3. 60-screens (écrans)
4. 20-ux (expérience)
5. 70-exports
6. 80-qa