/**
 * Ordre des colonnes du podium (indices dans le slice top 3 du classement).
 * — Rang 1, 2 et 3 distincts : disposition olympique classique (2e – 1er – 3e).
 * — Ex æquo ou autre : ordre du classement (gauche → droite), ex. deux or + bronze.
 */
export function podiumDisplayIndices(
  podium: readonly { rank: number }[]
): number[] {
  const top = podium.slice(0, 3);
  const n = top.length;
  if (n === 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [1, 0];
  const r0 = top[0].rank;
  const r1 = top[1].rank;
  const r2 = top[2].rank;
  if (r0 === 1 && r1 === 2 && r2 === 3) return [1, 0, 2];
  return [0, 1, 2];
}
