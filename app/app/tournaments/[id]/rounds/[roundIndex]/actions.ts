"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  buildForbiddenPartnerKeys,
  fullTableCount,
  selectPlayersByPriority,
  suggestAssignmentsForPlayers,
} from "@/lib/pairing-suggest";

async function getRoundIfOwner(
  tournamentId: string,
  roundIndex: number,
  userId: string
): Promise<{ id: string; roundId: string } | null> {
  const round = await prisma.round.findFirst({
    where: {
      tournamentId,
      roundIndex,
      tournament: { userId },
    },
    select: { id: true, roundIndex: true },
  });
  if (!round) return null;
  return { id: round.id, roundId: round.id };
}

export async function addTableAction({
  tournamentId,
  roundIndex,
  userId,
}: {
  tournamentId: string;
  roundIndex: number;
  userId: string;
}): Promise<{ id?: string; error?: string }> {
  const round = await getRoundIfOwner(tournamentId, roundIndex, userId);
  if (!round) return { error: "Tour introuvable." };

  try {
    const gameTable = await prisma.gameTable.create({
      data: { roundId: round.roundId },
    });
    revalidatePath(`/app/tournaments/${tournamentId}/rounds/${roundIndex}`);
    return { id: gameTable.id };
  } catch {
    return { error: "Impossible d'ajouter la table." };
  }
}

export async function applyGabaritAction({
  tournamentId,
  roundIndex,
  userId,
}: {
  tournamentId: string;
  roundIndex: number;
  userId: string;
}): Promise<{ count?: number; error?: string }> {
  const round = await getRoundIfOwner(tournamentId, roundIndex, userId);
  if (!round) return { error: "Tour introuvable." };

  const playerCount = await prisma.player.count({
    where: { tournamentId },
  });
  const tableCount = Math.ceil(playerCount / 4) || 1;
  const existing = await prisma.gameTable.count({ where: { roundId: round.roundId } });
  const toCreate = Math.max(0, tableCount - existing);
  if (toCreate === 0) {
    revalidatePath(`/app/tournaments/${tournamentId}/rounds/${roundIndex}`);
    return { count: 0 };
  }

  try {
    await prisma.gameTable.createMany({
      data: Array.from({ length: toCreate }, () => ({ roundId: round.roundId })),
    });
    revalidatePath(`/app/tournaments/${tournamentId}/rounds/${roundIndex}`);
    return { count: toCreate };
  } catch {
    return { error: "Impossible d'appliquer le gabarit." };
  }
}

/**
 * Remplit les premières tables « pleines » du tour (4 joueurs par table) avec une suggestion :
 * priorité aux exempts du tour précédent, pas deux fois le même partenaire (historique du tournoi).
 * Les tables du tour doivent être vides et en brouillon. Le remplissage manuel reste la référence.
 */
export async function suggestPairingsAction({
  tournamentId,
  roundIndex,
  userId,
}: {
  tournamentId: string;
  roundIndex: number;
  userId: string;
}): Promise<{ error?: string }> {
  const round = await getRoundIfOwner(tournamentId, roundIndex, userId);
  if (!round) return { error: "Tour introuvable." };

  const players = await prisma.player.findMany({
    where: { tournamentId },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  const n = players.length;
  if (n < 4) {
    return { error: "Au moins 4 joueurs sont nécessaires pour une suggestion." };
  }

  const neededTables = fullTableCount(n);
  if (neededTables === 0) {
    return { error: "Nombre de joueurs insuffisant." };
  }

  let gameTables = await prisma.gameTable.findMany({
    where: { roundId: round.roundId },
    orderBy: { id: "asc" },
  });

  if (gameTables.some((t) => t.status === "validated")) {
    return {
      error:
        "Impossible de suggérer des équipes : une table de ce tour est déjà validée.",
    };
  }

  const hasAnyPlayer = gameTables.some(
    (t) =>
      t.playerA1Id ||
      t.playerA2Id ||
      t.playerB1Id ||
      t.playerB2Id
  );
  if (hasAnyPlayer) {
    return {
      error:
        "Videz d'abord les affectations sur ce tour pour utiliser la suggestion, ou remplissez les tables à la main.",
    };
  }

  if (gameTables.length < neededTables) {
    const toAdd = neededTables - gameTables.length;
    await prisma.gameTable.createMany({
      data: Array.from({ length: toAdd }, () => ({ roundId: round.roundId })),
    });
    gameTables = await prisma.gameTable.findMany({
      where: { roundId: round.roundId },
      orderBy: { id: "asc" },
    });
  }

  const tablesToFill = gameTables.slice(0, neededTables);

  let exemptIds: string[] = [];
  if (roundIndex > 0) {
    const prevRound = await prisma.round.findFirst({
      where: { tournamentId, roundIndex: roundIndex - 1 },
      include: { gameTables: true },
    });
    if (prevRound) {
      const assigned = new Set<string>();
      for (const t of prevRound.gameTables) {
        if (t.playerA1Id) assigned.add(t.playerA1Id);
        if (t.playerA2Id) assigned.add(t.playerA2Id);
        if (t.playerB1Id) assigned.add(t.playerB1Id);
        if (t.playerB2Id) assigned.add(t.playerB2Id);
      }
      exemptIds = players
        .map((p) => p.id)
        .filter((id) => !assigned.has(id));
    }
  }

  const validatedTables = await prisma.gameTable.findMany({
    where: {
      round: { tournamentId },
      status: "validated",
    },
    select: {
      playerA1Id: true,
      playerA2Id: true,
      playerB1Id: true,
      playerB2Id: true,
    },
  });

  const matchesPlayed = new Map<string, number>();
  for (const p of players) matchesPlayed.set(p.id, 0);
  for (const t of validatedTables) {
    for (const id of [
      t.playerA1Id,
      t.playerA2Id,
      t.playerB1Id,
      t.playerB2Id,
    ]) {
      if (id) matchesPlayed.set(id, (matchesPlayed.get(id) ?? 0) + 1);
    }
  }

  const allIds = players.map((p) => p.id);
  const k = neededTables * 4;
  const selected = selectPlayersByPriority(
    allIds,
    exemptIds,
    matchesPlayed,
    k
  );

  const historyForForbidden = await prisma.gameTable.findMany({
    where: { round: { tournamentId } },
    select: {
      playerA1Id: true,
      playerA2Id: true,
      playerB1Id: true,
      playerB2Id: true,
    },
  });
  const forbidden = buildForbiddenPartnerKeys(historyForForbidden);

  const assignments = suggestAssignmentsForPlayers(selected, forbidden);
  if (!assignments) {
    return {
      error:
        "Aucune répartition trouvée sans refaire une paire déjà jouée. Ajustez à la main ou réessayez.",
    };
  }

  try {
    await prisma.$transaction(
      tablesToFill.map((gt, i) => {
        const a = assignments[i];
        return prisma.gameTable.update({
          where: { id: gt.id },
          data: {
            playerA1Id: a.playerA1Id,
            playerA2Id: a.playerA2Id,
            playerB1Id: a.playerB1Id,
            playerB2Id: a.playerB2Id,
          },
        });
      })
    );
    revalidatePath(`/app/tournaments/${tournamentId}/rounds/${roundIndex}`);
    return {};
  } catch {
    return { error: "Impossible d'appliquer la suggestion." };
  }
}
