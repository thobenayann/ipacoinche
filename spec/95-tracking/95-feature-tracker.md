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
- [x] (VALIDÉE) Leaderboard (tri: wins, GA, points)
- [x] (VALIDÉE) Égalité: 0.5 victoire
- [x] (VALIDÉE) Détail joueur (historique par tour)
- [x] (VALIDÉE) Animations sobres leaderboard
### Tests
- (x) Le tri est correct
- (x) Les égalités comptent 0.5
- (x) Le détail joueur affiche partenaires/adversaires/scores

---

## Milestone 7 — Partage lecture seule + QR + expiration
- [x] (VALIDÉE) Générer lien readonly
- [x] (VALIDÉE) Vues readonly (leaderboard, tours, joueurs)
- [x] (VALIDÉE) QR code
- [x] (VALIDÉE) Expiration 7 jours + écran expiré
- [x] (VALIDÉE) Activer/désactiver lien
### Tests
- (x) Le lien montre tout
- (x) Aucune action d'édition possible
- (x) Lien expiré affiche écran dédié

---

## Milestone 8 — Paramètres tournoi
- [x] (VALIDÉE) Nombre de tours (config)
- [x] (VALIDÉE) Mode tours: défaut 4 tours + pause (configurable 1-20)
- [x] (VALIDÉE) Durée lien readonly (configurable 1-90 jours)
- [x] (VALIDÉE) Renommer tournoi
### Tests
- (x) Les paramètres impactent l'affichage des tours

---

## Milestone 9 — Clôture + Exports
- [x] (VALIDÉE) Clôture tournoi (status → closed + réouverture)
- [x] (VALIDÉE) Historique consultable (tours, classement, partage restent accessibles)
- [x] (VALIDÉE) Export image podium (canvas → PNG téléchargeable)
- [x] (VALIDÉE) Export PDF récap (jsPDF + logo + podium canvas intégré)
### Tests
- (x) Clôture conserve l'historique
- (x) Image podium exportable
- (x) PDF récap exportable

---

## Milestone 10 — Mode démo
- [x] (VALIDÉE) /app/demo (page avec bouton Lancer + Reset)
- [x] (VALIDÉE) Génération tournoi fictif (12 joueurs, 4 tours, tables validées, scores aléatoires)
- [x] (VALIDÉE) Reset démo (suppression de tous les tournois démo)
- [x] (VALIDÉE) Bonus: lien readonly démo (ShareLink auto-généré à la création)
### Tests
- (x) Lancer la démo crée un tournoi pré-rempli
- (x) Le tournoi contient classement, tours, tables validées
- (x) Reset supprime les tournois démo
- (x) Le lien de partage est accessible depuis la page Partage du tournoi démo

---

## TOUS LES MILESTONES SONT VALIDÉS ✓
