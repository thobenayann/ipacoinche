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
Cursor ne passe pas au milestone suivant tant que l'utilisateur n'a pas validé les items "À TESTER".

---

# Milestones & Features

## Milestone 0 — Setup projet (structure)
- [x] (VALIDÉE) Routes et layout de base selon `/spec/60-screens/60-sitemap-routes.md`
- [x] (VALIDÉE) Shell UI mobile-first + navigation (bottom tabs)
- [x] (VALIDÉE) Pages placeholder avec titres corrects
### Tests
- (x) Navigation fonctionne sur mobile
- (x) Toutes les pages s'ouvrent sans erreur

---

## Milestone 1 — Auth Admin
- [x] (VALIDÉE) /auth/login
- [x] (VALIDÉE) /auth/signup
- [x] (VALIDÉE) /auth/forgot-password
- [x] (VALIDÉE) Accès protégé aux routes /app
### Tests
- (x) Création de compte
- (x) Login OK
- (x) Logout OK
- (x) Session persistante mobile OK

---

## Milestone 2 — Tournois (CRUD minimal)
- [x] (VALIDÉE) Liste des tournois (home admin)
- [x] (VALIDÉE) Création tournoi (nom, date)
- [x] (VALIDÉE) Accès à un tournoi
### Tests
- (x) Créer un tournoi
- (x) Le retrouver dans la liste
- (x) Ouvrir le tournoi

---

## Milestone 3 — Setup tournoi (joueurs)
- [x] (VALIDÉE) Ajouter joueur (rapide)
- [x] (VALIDÉE) Éditer joueur
- [x] (VALIDÉE) Supprimer joueur
- [x] (VALIDÉE) Validation min 4 joueurs
- [x] (VALIDÉE) Démarrer tournoi
### Tests
- (x) Ajouter 12 joueurs en < 1 min
- (x) Démarrer uniquement si >=4

---

## Milestone 4 — Tours + Tables (manuel + gabarit)
- [x] (VALIDÉE) Écran tour (tour X/total)
- [x] (VALIDÉE) Création table manuelle
- [x] (VALIDÉE) Gabarit auto: tables vides
- [x] (VALIDÉE) Anti-doublon joueur par tour (UI + règle)
- [x] (VALIDÉE) Affichage "non assignés" (pause)
### Tests
- (x) Impossible de mettre un joueur sur 2 tables du même tour
- (x) Les non assignés sont visibles

---

## Milestone 5 — Scores + Validation + Correction
- [x] (VALIDÉE) Saisie scores (entiers >=0)
- [x] (VALIDÉE) Validation table (conditions)
- [x] (VALIDÉE) Table validée: état visible
- [x] (VALIDÉE) Correction table (déverrouiller -> modifier -> revalider)
### Tests
- (x) Validation impossible si incomplet
- (x) Correction met à jour l'affichage

---

## Milestone 6 — Classement live + Détail joueur
- [x] (À TESTER) Leaderboard (tri: wins, GA, points)
- [x] (À TESTER) Égalité: 0.5 victoire
- [x] (À TESTER) Détail joueur (historique par tour)
- [x] (À TESTER) Animations sobres leaderboard
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
- ( ) Aucune action d'édition possible
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
- ( ) Les paramètres impactent l'affichage des tours

---

## Milestone 9 — Clôture + Exports
- [ ] (TODO) Clôture tournoi
- [ ] (TODO) Historique consultable
- [ ] (TODO) Export image podium
- [ ] (TODO) Export PDF récap
### Tests
- ( ) Clôture conserve l'historique
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
