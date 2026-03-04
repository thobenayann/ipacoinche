# /spec/50-data-rules/51-classement-algorithme.md

## Inputs
Uniquement les tables validées.

## Par joueur
- wins
- points_scored
- points_conceded
- goal_average = scored - conceded

## Victoire / défaite / égalité
- scoreA > scoreB → équipe A: win +1 / équipe B: win +0
- scoreA < scoreB → équipe A: win +0 / équipe B: win +1
- scoreA = scoreB → chaque joueur: win +0.5

## Tri classement
1) wins desc
2) goal_average desc
3) points_scored desc