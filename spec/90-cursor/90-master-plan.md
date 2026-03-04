# /spec/90-cursor/90-master-plan.md

## Rôle de Cursor
Tu es l’IA d’implémentation dans Cursor. Ton objectif est de construire l’application "Tournoi de Coinche" en respectant STRICTEMENT les specs du dossier `/spec`.

### Règles impératives
- Ne pas inventer de fonctionnalités non spécifiées.
- Ne pas modifier les fichiers `/spec/*` (ils sont la source de vérité).
- Si une info manque, créer une TODO dans le tracker et proposer une hypothèse raisonnable dans le code (mais ne pas bloquer).
- Toujours implémenter par incréments petits et testables.
- Après chaque incrément, mettre à jour `/spec/95-tracking/95-feature-tracker.md` et s’arrêter pour demander validation à l’utilisateur.

---

## Ordre de lecture obligatoire
Avant toute implémentation, lire et respecter dans cet ordre :

1) `/spec/00-README.md`
2) `/spec/60-screens/60-sitemap-routes.md`
3) `/spec/50-data-rules/50-regles-metier.md`
4) `/spec/50-data-rules/51-classement-algorithme.md`
5) `/spec/50-data-rules/53-validation-correction-cloture.md`
6) `/spec/30-brand/30-ipanova-style.md`
7) `/spec/20-ux/20-ux-guidelines-mobile-first.md`
8) Ensuite seulement, les écrans détaillés `/spec/60-screens/*`
9) Exports: `/spec/70-exports/*`
10) QA: `/spec/80-qa/*`

---

## Découpage de travail (milestones)
Tu dois construire l’app en milestones stricts, dans cet ordre :

### Milestone 0 — Setup projet (structure)
- Routes et layout de base selon sitemap
- Shell UI mobile-first + navigation
- Pages placeholder avec titres corrects (pas de logique métier)

**Livrable:** navigation fonctionnelle + pages accessibles

### Milestone 1 — Auth Admin (email+mdp)
- Pages /auth/*
- Session persistante
- Accès protégé aux routes /app

**Livrable:** login complet + accès /app

### Milestone 2 — Tournois (CRUD minimal)
- Liste des tournois
- Création d’un tournoi
- Accès à un tournoi

**Livrable:** un admin peut créer et ouvrir un tournoi

### Milestone 3 — Setup tournoi (joueurs)
- Ajout/édition/suppression joueurs
- Garde-fous (min 4)
- Démarrage tournoi

**Livrable:** tournoi prêt avec joueurs

### Milestone 4 — Tours + Tables (manuel + gabarit)
- Écran tour
- Création table manuelle
- Gabarit auto (tables vides)
- Anti-doublon joueur par tour (UI + règle)

**Livrable:** tables créées par tour

### Milestone 5 — Scores + Validation + Correction
- Saisie scores
- Validation (conditions)
- Correction (déverrouiller / revalider)
- Recalcul déclenché

**Livrable:** résultats fiables par table

### Milestone 6 — Classement live + Détail joueur
- Leaderboard (tri correct)
- Détail joueur (historique)
- Animation de mise à jour (sobres)

**Livrable:** classement et parcours joueur complets

### Milestone 7 — Partage lecture seule + QR + expiration
- Lien /t/[token]
- Vues readonly: leaderboard, tours, joueurs
- QR code
- Expiration (7 jours) + écran lien expiré
- Activation/désactivation lien côté admin

**Livrable:** partage joueur complet

### Milestone 8 — Paramètres tournoi
- Nombre de tours
- Mode tours (par défaut 4 + pause, option auto-adapt)
- Durée lien readonly (par défaut 7j)
- Renommage tournoi

**Livrable:** settings fonctionnels

### Milestone 9 — Clôture + Exports
- Clôture tournoi + historique
- Export image podium
- Export PDF récap

**Livrable:** fin de tournoi propre + exports

### Milestone 10 — Mode démo
- /app/demo
- tournoi fictif resettable
- lien readonly de démo (bonus)

**Livrable:** démo utilisable

---

## Convention de validation (gate)
À la fin de chaque milestone :
1) Mettre à jour le tracker `/spec/95-tracking/95-feature-tracker.md`
2) Marquer toutes les features du milestone en `À TESTER`
3) Proposer à l’utilisateur un protocole de test simple (mobile-first)
4) STOP : ne pas continuer tant que l’utilisateur n’a pas validé
5) Une fois validé, passer les items en `VALIDÉE` puis attaquer le milestone suivant

---

## Design & UX obligatoires
- Mobile-first, ShadcnUI, Tailwind
- Palette IPANOVA: #51bdcb / #333333 / #f0f0f0
- Animations sobres (wow discret)
- États vides + erreurs clairs

Références:
- `/spec/20-ux/*`
- `/spec/30-brand/*`

---

## Notes importantes
- Le tirage des équipes est "à l’ancienne" : pas de génération d’équipes automatique.
- Le gabarit auto sert uniquement à créer le bon nombre de tables vides.
- Gestion non multiple de 4 : joueurs "en pause" sur un tour.
- Égalité: 0.5 victoire.
- Correction toujours possible par admin.
- Lecture seule : "on montre tout".