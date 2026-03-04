# /spec/95-tracking/95-feature-tracker.md

## Comment utiliser ce tracker
- Ce fichier est mis à jour par Cursor à la fin de chaque incrément/milestone.
- Les statuts possibles :
  - TODO
  - EN COURS
  - À TESTER
  - VALIDÉE
  - BLOQUÉE (si info manquante)

## Règle
Cursor ne passe pas au milestone suivant tant que l’utilisateur n’a pas validé les items "À TESTER".

---

# Milestones & Features

## Milestone 0 — Setup projet (structure)
- [ ] (TODO) Routes et layout de base selon `/spec/60-screens/60-sitemap-routes.md`
- [ ] (TODO) Shell UI mobile-first + navigation (bottom tabs)
- [ ] (TODO) Pages placeholder avec titres corrects
### Tests
- ( ) Navigation fonctionne sur mobile
- ( ) Toutes les pages s’ouvrent sans erreur

---

## Milestone 1 — Auth Admin
- [ ] (TODO) /auth/login
- [ ] (TODO) /auth/signup
- [ ] (TODO) /auth/forgot-password
- [ ] (TODO) Accès protégé aux routes /app
### Tests
- ( ) Création de compte
- ( ) Login OK
- ( ) Logout OK
- ( ) Session persistante mobile OK

---

## Milestone 2 — Tournois (CRUD minimal)
- [ ] (TODO) Liste des tournois (home admin)
- [ ] (TODO) Création tournoi (nom, date)
- [ ] (TODO) Accès à un tournoi
### Tests
- ( ) Créer un tournoi
- ( ) Le retrouver dans la liste
- ( ) Ouvrir le tournoi

---

## Milestone 3 — Setup tournoi (joueurs)
- [ ] (TODO) Ajouter joueur (rapide)
- [ ] (TODO) Éditer joueur
- [ ] (TODO) Supprimer joueur
- [ ] (TODO) Validation min 4 joueurs
- [ ] (TODO) Démarrer tournoi
### Tests
- ( ) Ajouter 12 joueurs en < 1 min
- ( ) Démarrer uniquement si >=4

---

## Milestone 4 — Tours + Tables (manuel + gabarit)
- [ ] (TODO) Écran tour (tour X/total)
- [ ] (TODO) Création table manuelle
- [ ] (TODO) Gabarit auto: tables vides
- [ ] (TODO) Anti-doublon joueur par tour (UI + règle)
- [ ] (TODO) Affichage "non assignés" (pause)
### Tests
- ( ) Impossible de mettre un joueur sur 2 tables du même tour
- ( ) Les non assignés sont visibles

---

## Milestone 5 — Scores + Validation + Correction
- [ ] (TODO) Saisie scores (entiers >=0)
- [ ] (TODO) Validation table (conditions)
- [ ] (TODO) Table validée: état visible
- [ ] (TODO) Correction table (déverrouiller -> modifier -> revalider)
### Tests
- ( ) Validation impossible si incomplet
- ( ) Correction met à jour l’affichage

---

## Milestone 6 — Classement live + Détail joueur
- [ ] (TODO) Leaderboard (tri: wins, GA, points)
- [ ] (TODO) Égalité: 0.5 victoire
- [ ] (TODO) Détail joueur (historique par tour)
- [ ] (TODO) Animations sobres leaderboard
### Tests
- ( ) Le tri est correct
- ( ) Les égalités comptent 0.5
- ( ) Le détail joueur affiche partenaires/adversaires/scores

---

## Milestone 7 — Partage lecture seule + QR + expiration
- [ ] (TODO) Générer lien readonly
- [ ] (TODO) Vues readonly (leaderboard, tours, joueurs)
- [ ] (TODO) QR code
- [ ] (TODO) Expiration 7 jours + écran expiré
- [ ] (TODO) Activer/désactiver lien
### Tests
- ( ) Le lien montre tout
- ( ) Aucune action d’édition possible
- ( ) Lien expiré affiche écran dédié

---

## Milestone 8 — Paramètres tournoi
- [ ] (TODO) Nombre de tours (config)
- [ ] (TODO) Mode tours:
  - [ ] (TODO) défaut 4 tours + pause
  - [ ] (TODO) option auto-adapt tours
- [ ] (TODO) Durée lien readonly (défaut 7j)
- [ ] (TODO) Renommer tournoi
### Tests
- ( ) Les paramètres impactent l’affichage des tours

---

## Milestone 9 — Clôture + Exports
- [ ] (TODO) Clôture tournoi
- [ ] (TODO) Historique consultable
- [ ] (TODO) Export image podium
- [ ] (TODO) Export PDF récap
### Tests
- ( ) Clôture conserve l’historique
- ( ) Image podium exportable
- ( ) PDF récap exportable

---

## Milestone 10 — Mode démo
- [ ] (TODO) /app/demo
- [ ] (TODO) Génération tournoi fictif
- [ ] (TODO) Reset démo
- [ ] (TODO) Bonus: lien readonly démo
### Tests
- ( ) Démo utilisable sans compte