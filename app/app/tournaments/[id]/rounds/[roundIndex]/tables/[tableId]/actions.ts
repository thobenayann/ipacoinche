"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

async function getTableIfOwner(
  tableId: string,
  userId: string
): Promise<{
  id: string;
  roundId: string;
  roundIndex: number;
  tournamentId: string;
} | null> {
  const gameTable = await prisma.gameTable.findFirst({
    where: { id: tableId },
    include: {
      round: {
        select: { id: true, tournamentId: true, roundIndex: true },
      },
    },
  });
  if (!gameTable) return null;
  const tournament = await prisma.tournament.findFirst({
    where: { id: gameTable.round.tournamentId, userId },
    select: { id: true },
  });
  if (!tournament) return null;
  return {
    id: gameTable.id,
    roundId: gameTable.round.id,
    roundIndex: gameTable.round.roundIndex,
    tournamentId: gameTable.round.tournamentId,
  };
}

/** Retourne les IDs de joueurs déjà assignés sur une autre table du même tour (sans compter cette table). */
async function getAssignedPlayerIdsInRound(
  roundId: string,
  excludeTableId: string
): Promise<Set<string>> {
  const tables = await prisma.gameTable.findMany({
    where: { roundId, id: { not: excludeTableId } },
    select: {
      playerA1Id: true,
      playerA2Id: true,
      playerB1Id: true,
      playerB2Id: true,
    },
  });
  const ids = new Set<string>();
  for (const t of tables) {
    if (t.playerA1Id) ids.add(t.playerA1Id);
    if (t.playerA2Id) ids.add(t.playerA2Id);
    if (t.playerB1Id) ids.add(t.playerB1Id);
    if (t.playerB2Id) ids.add(t.playerB2Id);
  }
  return ids;
}

export async function updateTableAction({
  tableId,
  userId,
  playerA1Id,
  playerA2Id,
  playerB1Id,
  playerB2Id,
  scoreTeamA,
  scoreTeamB,
}: {
  tableId: string;
  userId: string;
  playerA1Id: string | null;
  playerA2Id: string | null;
  playerB1Id: string | null;
  playerB2Id: string | null;
  scoreTeamA: number | null;
  scoreTeamB: number | null;
}): Promise<{ error?: string }> {
  const meta = await getTableIfOwner(tableId, userId);
  if (!meta) return { error: "Table introuvable." };

  const playerIds = [playerA1Id, playerA2Id, playerB1Id, playerB2Id].filter(
    (id): id is string => id !== null && id !== ""
  );
  const unique = new Set(playerIds);
  if (playerIds.length !== unique.size)
    return { error: "Un joueur ne peut apparaître qu'une seule fois sur la table." };

  const assigned = await getAssignedPlayerIdsInRound(meta.roundId, tableId);
  for (const id of playerIds) {
    if (assigned.has(id))
      return {
        error:
          "Un de ces joueurs est déjà assigné à une autre table pour ce tour.",
      };
  }

  try {
    await prisma.gameTable.update({
      where: { id: tableId },
      data: {
        playerA1Id: playerA1Id || null,
        playerA2Id: playerA2Id || null,
        playerB1Id: playerB1Id || null,
        playerB2Id: playerB2Id || null,
        scoreTeamA: scoreTeamA ?? null,
        scoreTeamB: scoreTeamB ?? null,
      },
    });
    revalidatePath(
      `/app/tournaments/${meta.tournamentId}/rounds/${meta.roundIndex}`
    );
    revalidatePath(
      `/app/tournaments/${meta.tournamentId}/rounds/${meta.roundIndex}/tables/${tableId}`
    );
    return {};
  } catch {
    return { error: "Impossible de mettre à jour la table." };
  }
}

export async function validateTableAction({
  tableId,
  userId,
}: {
  tableId: string;
  userId: string;
}): Promise<{ error?: string }> {
  const meta = await getTableIfOwner(tableId, userId);
  if (!meta) return { error: "Table introuvable." };

  const gameTable = await prisma.gameTable.findUnique({
    where: { id: tableId },
    select: {
      playerA1Id: true,
      playerA2Id: true,
      playerB1Id: true,
      playerB2Id: true,
      scoreTeamA: true,
      scoreTeamB: true,
    },
  });
  if (!gameTable) return { error: "Table introuvable." };

  const hasFour =
    gameTable.playerA1Id &&
    gameTable.playerA2Id &&
    gameTable.playerB1Id &&
    gameTable.playerB2Id;
  if (!hasFour)
    return { error: "Il faut 4 joueurs pour valider la table." };

  const scoreA = gameTable.scoreTeamA ?? -1;
  const scoreB = gameTable.scoreTeamB ?? -1;
  if (scoreA < 0 || scoreB < 0)
    return { error: "Les deux scores doivent être renseignés (entiers ≥ 0)." };

  try {
    await prisma.gameTable.update({
      where: { id: tableId },
      data: { status: "validated" },
    });
    revalidatePath(
      `/app/tournaments/${meta.tournamentId}/rounds/${meta.roundIndex}`
    );
    revalidatePath(
      `/app/tournaments/${meta.tournamentId}/rounds/${meta.roundIndex}/tables/${tableId}`
    );
    return {};
  } catch {
    return { error: "Impossible de valider la table." };
  }
}

export async function deleteTableAction({
  tableId,
  userId,
}: {
  tableId: string;
  userId: string;
}): Promise<{ error?: string }> {
  const meta = await getTableIfOwner(tableId, userId);
  if (!meta) return { error: "Table introuvable." };

  const tournament = await prisma.tournament.findFirst({
    where: { id: meta.tournamentId, userId },
    select: { status: true },
  });
  if (!tournament) return { error: "Tournoi introuvable." };
  if (tournament.status !== "started" && tournament.status !== "closed") {
    return {
      error:
        "La suppression n’est possible que pour un tournoi démarré ou clôturé.",
    };
  }

  try {
    await prisma.gameTable.delete({ where: { id: tableId } });
    const base = `/app/tournaments/${meta.tournamentId}`;
    revalidatePath(`${base}/rounds/${meta.roundIndex}`);
    revalidatePath(`${base}/leaderboard`);
    revalidatePath(`${base}/close`);
    revalidatePath(`${base}/share`);
    revalidatePath(`${base}`);
    return {};
  } catch {
    return { error: "Impossible de supprimer la table." };
  }
}

export async function unlockTableAction({
  tableId,
  userId,
}: {
  tableId: string;
  userId: string;
}): Promise<{ error?: string }> {
  const meta = await getTableIfOwner(tableId, userId);
  if (!meta) return { error: "Table introuvable." };

  const gameTable = await prisma.gameTable.findUnique({
    where: { id: tableId },
    select: { status: true },
  });
  if (!gameTable) return { error: "Table introuvable." };
  if (gameTable.status !== "validated")
    return { error: "Seule une table validée peut être déverrouillée." };

  try {
    await prisma.gameTable.update({
      where: { id: tableId },
      data: { status: "draft" },
    });
    revalidatePath(
      `/app/tournaments/${meta.tournamentId}/rounds/${meta.roundIndex}`
    );
    revalidatePath(
      `/app/tournaments/${meta.tournamentId}/rounds/${meta.roundIndex}/tables/${tableId}`
    );
    return {};
  } catch {
    return { error: "Impossible de déverrouiller la table." };
  }
}
