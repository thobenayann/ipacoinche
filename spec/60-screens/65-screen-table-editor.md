# /spec/60-screens/65-screen-table-editor.md

## Éditeur de table (Drawer ou page dédiée)
Emplacement:
- déclenché depuis l’écran tour
- peut être: drawer mobile ou route dédiée (à choisir)

Contenu:
- sélection 4 joueurs
- création des 2 équipes (2 vs 2)
- saisie score équipe A / B
- bouton "Valider"

Règles UX:
- joueurs déjà assignés au tour → indisponibles (grisés)
- validation désactivée si invalide
- validation → feedback + mise à jour classement
- correction possible même si validée (déverrouiller)