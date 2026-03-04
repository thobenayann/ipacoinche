# /spec/50-data-rules/50-regles-metier.md

## Structure tournoi
- Joueurs: N variable, min 4
- Tours: par défaut 4
- Tables: 4 joueurs, 2 équipes, 2 scores

## Règle d’unicité par tour
- Un joueur ne peut être assigné qu’à une seule table sur un même tour.

## Table validable si
- 4 joueurs présents
- 2 scores entiers >= 0
- équipes définies (2 vs 2)

## En pause
- Si N non multiple de 4:
  - certains joueurs peuvent être "en pause" sur un tour
  - pas de points, pas de victoires sur ce tour