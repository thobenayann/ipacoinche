/** Clé canonique pour une paire de joueurs (partenaires). */
export function partnerPairKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

/** Construit l’ensemble des paires déjà partenaires à partir des tables (tournoi entier). */
export function buildForbiddenPartnerKeys(
  tables: ReadonlyArray<{
    playerA1Id: string | null;
    playerA2Id: string | null;
    playerB1Id: string | null;
    playerB2Id: string | null;
  }>
): Set<string> {
  const set = new Set<string>();
  for (const t of tables) {
    if (t.playerA1Id && t.playerA2Id) {
      set.add(partnerPairKey(t.playerA1Id, t.playerA2Id));
    }
    if (t.playerB1Id && t.playerB2Id) {
      set.add(partnerPairKey(t.playerB1Id, t.playerB2Id));
    }
  }
  return set;
}

/**
 * Nombre de tables « pleines » (4 joueurs) qu’on peut remplir : floor(n/4), min 1 si n >= 4.
 */
export function fullTableCount(playerCount: number): number {
  if (playerCount < 4) return 0;
  return Math.floor(playerCount / 4);
}

export type TableAssignment = {
  playerA1Id: string;
  playerA2Id: string;
  playerB1Id: string;
  playerB2Id: string;
};

/**
 * Partage `players` (longueur multiple de 4) en paires sans paire interdite, puis en tables de 4.
 * Retourne `null` si aucune solution après plusieurs essais.
 */
export function suggestAssignmentsForPlayers(
  playerIds: string[],
  forbidden: ReadonlySet<string>,
  maxAttempts = 80
): TableAssignment[] | null {
  const n = playerIds.length;
  if (n % 4 !== 0 || n === 0) return null;
  const numTables = n / 4;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = shuffleCopy(playerIds, attempt);
    const pairs = partitionIntoPairs(shuffled, forbidden);
    if (!pairs) continue;

    const tables: TableAssignment[] = [];
    for (let t = 0; t < numTables; t++) {
      const i = t * 2;
      const [p1a, p1b] = pairs[i];
      const [p2a, p2b] = pairs[i + 1];
      tables.push({
        playerA1Id: p1a,
        playerA2Id: p1b,
        playerB1Id: p2a,
        playerB2Id: p2b,
      });
    }
    return tables;
  }
  return null;
}

function shuffleCopy(ids: string[], seed: number): string[] {
  const a = [...ids];
  let s = seed + 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Découpe 4k joueurs en 2k paires (arbre de backtracking).
 */
function partitionIntoPairs(
  ordered: string[],
  forbidden: ReadonlySet<string>
): Array<[string, string]> | null {
  const n = ordered.length;
  const pairs: Array<[string, string]> = [];
  const used = new Array<boolean>(n).fill(false);

  function dfs(): boolean {
    let i = 0;
    while (i < n && used[i]) i++;
    if (i >= n) return true;
    for (let j = i + 1; j < n; j++) {
      if (used[j]) continue;
      const a = ordered[i];
      const b = ordered[j];
      if (forbidden.has(partnerPairKey(a, b))) continue;
      used[i] = true;
      used[j] = true;
      pairs.push([a, b]);
      if (dfs()) return true;
      pairs.pop();
      used[i] = false;
      used[j] = false;
    }
    return false;
  }

  if (!dfs()) return null;
  return pairs;
}

/**
 * Choisit `count` joueurs : priorité aux exempts du tour précédent, puis moins de matchs joués (validés), puis ordre stable.
 */
export function selectPlayersByPriority(
  allPlayerIds: string[],
  exemptFromPreviousRound: readonly string[],
  validatedMatchesPlayed: ReadonlyMap<string, number>,
  count: number
): string[] {
  if (count <= 0) return [];
  if (count >= allPlayerIds.length) return [...allPlayerIds];

  const exemptSet = new Set(exemptFromPreviousRound);
  const rest = allPlayerIds.filter((id) => !exemptSet.has(id));

  const sortKey = (id: string) => validatedMatchesPlayed.get(id) ?? 0;

  const exemptSorted = [...exemptFromPreviousRound].filter((id) =>
    allPlayerIds.includes(id)
  );
  exemptSorted.sort((a, b) => sortKey(a) - sortKey(b) || a.localeCompare(b));

  const restSorted = rest.sort(
    (a, b) => sortKey(a) - sortKey(b) || a.localeCompare(b)
  );

  const out: string[] = [];
  for (const id of exemptSorted) {
    if (out.length >= count) break;
    out.push(id);
  }
  for (const id of restSorted) {
    if (out.length >= count) break;
    if (!out.includes(id)) out.push(id);
  }
  return out.slice(0, count);
}
