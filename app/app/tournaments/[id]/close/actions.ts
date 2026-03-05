"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function closeTournamentAction({
  tournamentId,
  userId,
}: {
  tournamentId: string;
  userId: string;
}): Promise<{ error?: string }> {
  try {
    const tournament = await prisma.tournament.findFirst({
      where: { id: tournamentId, userId },
      select: { id: true, status: true },
    });
    if (!tournament) return { error: "Tournoi introuvable." };
    if (tournament.status === "closed")
      return { error: "Le tournoi est déjà clôturé." };
    if (tournament.status !== "started")
      return { error: "Le tournoi doit être démarré pour être clôturé." };

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: "closed" },
    });

    revalidatePath(`/app/tournaments/${tournamentId}`);
    revalidatePath(`/app/tournaments/${tournamentId}/close`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}

export async function reopenTournamentAction({
  tournamentId,
  userId,
}: {
  tournamentId: string;
  userId: string;
}): Promise<{ error?: string }> {
  try {
    const tournament = await prisma.tournament.findFirst({
      where: { id: tournamentId, userId },
      select: { id: true, status: true },
    });
    if (!tournament) return { error: "Tournoi introuvable." };
    if (tournament.status !== "closed")
      return { error: "Le tournoi n'est pas clôturé." };

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: "started" },
    });

    revalidatePath(`/app/tournaments/${tournamentId}`);
    revalidatePath(`/app/tournaments/${tournamentId}/close`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
