# Mobile UI Playbook (non négociable)

## Objectif
L’UI doit ressembler à une vraie application mobile moderne, pas à un CRUD web.

## Layout global
- App Shell mobile : max-width (mobile), padding cohérent
- Navigation bas de page (tabs) persistante (admin et readonly)
- Chaque écran = PageHeader + Content + Floating/Bottom actions si pertinent

## Pattern d’écran (obligatoire)
Chaque écran majeur suit cette structure :
1) PageHeader
   - Titre
   - Sous-titre utile (contexte)
   - Action secondaire (optionnelle)
2) Content Sections (cards)
   - sections espacées, hiérarchie claire
3) Feedback
   - toasts, inline errors, états vides
4) Primary Action
   - toujours visible (bottom bar ou sticky CTA) quand nécessaire

## Cards (pattern central)
Tout contenu clé est présenté en cards.
- Jamais de "table/grid" pour la logique métier de tournoi.
- Les "tables" de tournoi sont des MATCH CARDS, style app sportive / jeu.

## Match Card (Coinche) — composant signature
Structure obligatoire :
- Header : icône ♠♥♦♣ + "Table X" + status chip (Validée/Brouillon)
- Body : équipes à gauche/droite, score énorme au centre
- Footer : labels "Équipe A / Équipe B" + action hint ("Tap to edit")

Règles :
- Score = élément le plus visible
- Joueurs = lignes individuelles avec avatar/initiales
- Toute la card est tappable

## Animation (wow discret mais réel)
- Press state sur card (scale très léger + shadow)
- Entrée de page : fade+slide léger
- Updates (ex: classement) : transition douce de position
Durées : 150–250ms

## États obligatoires
- loading : skeletons cohérents
- empty state : icône lucide + message + CTA
- error : message court + champ surligné
- success : toast + micro feedback

## Anti-patterns (interdits)
- UI type “tableau admin”
- Labels génériques inutiles (“TABLE”)
- Dashes “—” à la place d’un placeholder (“Joueur…”)
- 1 page jolie et les pages sœurs brutes (cohérence par domaine)