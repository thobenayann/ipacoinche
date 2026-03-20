import { prisma } from "@/lib/db";

export type PlayerStats = {
  playerId: string;
  playerName: string;
  wins: number;
  pointsScored: number;
  pointsConceded: number;
  goalAverage: number;
  played: number;
  rank: number;
};

export type PlayerRoundEntry = {
  roundIndex: number;
  partner: string | null;
  opponent1: string | null;
  opponent2: string | null;
  scoreTeam: number;
  scoreOpponent: number;
  result: "W" | "L" | "D";
};

/** Moyenne de points de victoire (prorata matchs joués). */
export function winAverage(stats: Pick<PlayerStats, "wins" | "played">): number {
  if (stats.played <= 0) return -1;
  return stats.wins / stats.played;
}

function sameRankingRow(a: PlayerStats, b: PlayerStats): boolean {
  return (
    Math.abs(winAverage(a) - winAverage(b)) < 1e-9 &&
    a.wins === b.wins &&
    a.goalAverage === b.goalAverage &&
    a.pointsScored === b.pointsScored
  );
}

/**
 * Calcule le classement complet d'un tournoi à partir des tables validées.
 * Tri: 1) moyenne de victoires (wins/played) 2) victoires totales 3) GA 4) points marqués.
 * La moyenne permet de comparer équitablement si tout le monde n'a pas joué le même nombre de matchs.
 */
export async function computeRanking(
  tournamentId: string
): Promise<PlayerStats[]> {
  const players = await prisma.player.findMany({
    where: { tournamentId },
    select: { id: true, name: true },
  });

  const validatedTables = await prisma.gameTable.findMany({
    where: {
      round: { tournamentId },
      status: "validated",
    },
    select: {
      scoreTeamA: true,
      scoreTeamB: true,
      playerA1Id: true,
      playerA2Id: true,
      playerB1Id: true,
      playerB2Id: true,
    },
  });

  const statsMap = new Map<
    string,
    { wins: number; scored: number; conceded: number; played: number }
  >();
  for (const p of players) {
    statsMap.set(p.id, { wins: 0, scored: 0, conceded: 0, played: 0 });
  }

  for (const t of validatedTables) {
    if (t.scoreTeamA === null || t.scoreTeamB === null) continue;

    const teamAIds = [t.playerA1Id, t.playerA2Id].filter(Boolean) as string[];
    const teamBIds = [t.playerB1Id, t.playerB2Id].filter(Boolean) as string[];

    let winA: number;
    let winB: number;
    if (t.scoreTeamA > t.scoreTeamB) {
      winA = 1;
      winB = 0;
    } else if (t.scoreTeamA < t.scoreTeamB) {
      winA = 0;
      winB = 1;
    } else {
      winA = 0.5;
      winB = 0.5;
    }

    for (const id of teamAIds) {
      const s = statsMap.get(id);
      if (s) {
        s.wins += winA;
        s.scored += t.scoreTeamA;
        s.conceded += t.scoreTeamB;
        s.played += 1;
      }
    }
    for (const id of teamBIds) {
      const s = statsMap.get(id);
      if (s) {
        s.wins += winB;
        s.scored += t.scoreTeamB;
        s.conceded += t.scoreTeamA;
        s.played += 1;
      }
    }
  }

  const playerMap = new Map(players.map((p) => [p.id, p.name]));
  const result: PlayerStats[] = [];

  for (const [id, s] of statsMap) {
    result.push({
      playerId: id,
      playerName: playerMap.get(id) ?? "",
      wins: s.wins,
      pointsScored: s.scored,
      pointsConceded: s.conceded,
      goalAverage: s.scored - s.conceded,
      played: s.played,
      rank: 0,
    });
  }

  result.sort((a, b) => {
    const avgA = winAverage(a);
    const avgB = winAverage(b);
    if (avgB !== avgA) return avgB - avgA;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.goalAverage !== a.goalAverage) return b.goalAverage - a.goalAverage;
    return b.pointsScored - a.pointsScored;
  });

  for (let i = 0; i < result.length; i++) {
    if (i > 0 && sameRankingRow(result[i], result[i - 1])) {
      result[i].rank = result[i - 1].rank;
    } else {
      result[i].rank = i + 1;
    }
  }

  return result;
}

/**
 * Historique par tour d'un joueur spécifique (partenaire, adversaires, score, résultat).
 */
export async function getPlayerHistory(
  tournamentId: string,
  playerId: string
): Promise<PlayerRoundEntry[]> {
  const tables = await prisma.gameTable.findMany({
    where: {
      round: { tournamentId },
      status: "validated",
      OR: [
        { playerA1Id: playerId },
        { playerA2Id: playerId },
        { playerB1Id: playerId },
        { playerB2Id: playerId },
      ],
    },
    include: {
      round: { select: { roundIndex: true } },
      playerA1: { select: { name: true } },
      playerA2: { select: { name: true } },
      playerB1: { select: { name: true } },
      playerB2: { select: { name: true } },
    },
    orderBy: { round: { roundIndex: "asc" } },
  });

  return tables.map((t) => {
    const inTeamA =
      t.playerA1Id === playerId || t.playerA2Id === playerId;
    const scoreA = t.scoreTeamA ?? 0;
    const scoreB = t.scoreTeamB ?? 0;

    const scoreTeam = inTeamA ? scoreA : scoreB;
    const scoreOpponent = inTeamA ? scoreB : scoreA;

    let partner: string | null;
    let opponent1: string | null;
    let opponent2: string | null;

    if (inTeamA) {
      partner =
        t.playerA1Id === playerId
          ? (t.playerA2?.name ?? null)
          : (t.playerA1?.name ?? null);
      opponent1 = t.playerB1?.name ?? null;
      opponent2 = t.playerB2?.name ?? null;
    } else {
      partner =
        t.playerB1Id === playerId
          ? (t.playerB2?.name ?? null)
          : (t.playerB1?.name ?? null);
      opponent1 = t.playerA1?.name ?? null;
      opponent2 = t.playerA2?.name ?? null;
    }

    let result: "W" | "L" | "D";
    if (scoreTeam > scoreOpponent) result = "W";
    else if (scoreTeam < scoreOpponent) result = "L";
    else result = "D";

    return {
      roundIndex: t.round.roundIndex,
      partner,
      opponent1,
      opponent2,
      scoreTeam,
      scoreOpponent,
      result,
    };
  });
}
