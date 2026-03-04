# /spec/50-data-rules/52-cas-non-multiple-de-4.md

## Objectif
Gérer les cas où le nombre de joueurs n’est pas multiple de 4, sans complexifier l’UX.

## Règle
- Sur un tour donné, l’admin peut laisser certains joueurs non assignés ("en pause").

## UX attendue
- Sur l’écran du tour:
  - compteur assignés / total
  - section "Non assignés"
  - message explicite

## Conséquence
- Joueur en pause:
  - aucune table
  - aucune stat ajoutée sur ce tour