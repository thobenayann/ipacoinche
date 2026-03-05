"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function getTournamentIfOwner(tournamentId: string, userId: string) {
  return prisma.tournament.findFirst({
    where: { id: tournamentId, userId },
    select: { id: true },
  });
}

export async function updateTournamentNameAction({
  tournamentId,
  userId,
  name,
}: {
  tournamentId: string;
  userId: string;
  name: string;
}): Promise<{ error?: string }> {
  try {
    const trimmed = name.trim();
    if (!trimmed) return { error: "Le nom ne peut pas être vide." };
    if (trimmed.length > 100) return { error: "100 caractères maximum." };

    const t = await getTournamentIfOwner(tournamentId, userId);
    if (!t) return { error: "Tournoi introuvable." };

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { name: trimmed },
    });

    revalidatePath(`/app/tournaments/${tournamentId}`);
    revalidatePath(`/app/tournaments/${tournamentId}/settings`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}

export async function updateTotalRoundsAction({
  tournamentId,
  userId,
  totalRounds,
}: {
  tournamentId: string;
  userId: string;
  totalRounds: number;
}): Promise<{ error?: string }> {
  try {
    if (!Number.isInteger(totalRounds) || totalRounds < 1 || totalRounds > 20)
      return { error: "Le nombre de tours doit être entre 1 et 20." };

    const t = await getTournamentIfOwner(tournamentId, userId);
    if (!t) return { error: "Tournoi introuvable." };

    const existingRounds = await prisma.round.findMany({
      where: { tournamentId },
      select: { roundIndex: true },
    });
    const existingIndices = new Set(existingRounds.map((r) => r.roundIndex));

    await prisma.$transaction(async (tx) => {
      await tx.tournament.update({
        where: { id: tournamentId },
        data: { totalRounds },
      });

      const toCreate: { tournamentId: string; roundIndex: number }[] = [];
      for (let i = 0; i < totalRounds; i++) {
        if (!existingIndices.has(i)) {
          toCreate.push({ tournamentId, roundIndex: i });
        }
      }
      if (toCreate.length > 0) {
        await tx.round.createMany({ data: toCreate });
      }
    });

    revalidatePath(`/app/tournaments/${tournamentId}`);
    revalidatePath(`/app/tournaments/${tournamentId}/settings`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}

export async function updateShareLinkExpiryAction({
  tournamentId,
  userId,
  days,
}: {
  tournamentId: string;
  userId: string;
  days: number;
}): Promise<{ error?: string }> {
  try {
    if (!Number.isInteger(days) || days < 1 || days > 90)
      return { error: "La durée doit être entre 1 et 90 jours." };

    const t = await getTournamentIfOwner(tournamentId, userId);
    if (!t) return { error: "Tournoi introuvable." };

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { shareLinkExpiryDays: days },
    });

    revalidatePath(`/app/tournaments/${tournamentId}/settings`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
