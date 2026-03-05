"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

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
