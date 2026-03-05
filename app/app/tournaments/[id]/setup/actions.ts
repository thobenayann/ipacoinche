"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { DEFAULT_ROUNDS, MIN_PLAYERS } from "@/lib/tournament-constants";

async function getTournamentIfOwner(
  tournamentId: string,
  userId: string
): Promise<{ id: string; status: string } | null> {
  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId, userId },
    select: { id: true, status: true },
  });
  return tournament;
}

export async function createPlayerAction({
  tournamentId,
  name,
  userId,
}: {
  tournamentId: string;
  name: string;
  userId: string;
}): Promise<{ id?: string; error?: string }> {
  const tournament = await getTournamentIfOwner(tournamentId, userId);
  if (!tournament) return { error: "Tournoi introuvable." };
  if (tournament.status !== "draft")
    return { error: "Impossible d'ajouter des joueurs après le démarrage." };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Le nom est obligatoire." };

  try {
    const player = await prisma.player.create({
      data: { name: trimmed, tournamentId },
    });
    revalidatePath(`/app/tournaments/${tournamentId}`);
    revalidatePath(`/app/tournaments/${tournamentId}/setup`);
    return { id: player.id };
  } catch {
    return { error: "Impossible d'ajouter le joueur." };
  }
}

export async function updatePlayerAction({
  playerId,
  name,
  userId,
}: {
  playerId: string;
  name: string;
  userId: string;
}): Promise<{ error?: string }> {
  const player = await prisma.player.findFirst({
    where: { id: playerId },
    include: { tournament: true },
  });
  if (!player || player.tournament.userId !== userId)
    return { error: "Joueur introuvable." };
  if (player.tournament.status !== "draft")
    return { error: "Impossible de modifier après le démarrage." };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Le nom est obligatoire." };

  try {
    await prisma.player.update({
      where: { id: playerId },
      data: { name: trimmed },
    });
    revalidatePath(`/app/tournaments/${player.tournamentId}`);
    revalidatePath(`/app/tournaments/${player.tournamentId}/setup`);
    return {};
  } catch {
    return { error: "Impossible de modifier le joueur." };
  }
}

export async function deletePlayerAction({
  playerId,
  userId,
}: {
  playerId: string;
  userId: string;
}): Promise<{ error?: string }> {
  const player = await prisma.player.findFirst({
    where: { id: playerId },
    include: { tournament: true },
  });
  if (!player || player.tournament.userId !== userId)
    return { error: "Joueur introuvable." };
  if (player.tournament.status !== "draft")
    return { error: "Impossible de supprimer après le démarrage." };

  try {
    await prisma.player.delete({ where: { id: playerId } });
    revalidatePath(`/app/tournaments/${player.tournamentId}`);
    revalidatePath(`/app/tournaments/${player.tournamentId}/setup`);
    return {};
  } catch {
    return { error: "Impossible de supprimer le joueur." };
  }
}

export async function startTournamentAction({
  tournamentId,
  userId,
}: {
  tournamentId: string;
  userId: string;
}): Promise<{ error?: string }> {
  const tournament = await getTournamentIfOwner(tournamentId, userId);
  if (!tournament) return { error: "Tournoi introuvable." };
  if (tournament.status !== "draft")
    return { error: "Le tournoi a déjà démarré." };

  const count = await prisma.player.count({
    where: { tournamentId },
  });
  if (count < MIN_PLAYERS)
    return { error: `Il faut au moins ${MIN_PLAYERS} joueurs pour démarrer.` };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.tournament.update({
        where: { id: tournamentId },
        data: { status: "started" },
      });
      await tx.round.createMany({
        data: Array.from({ length: DEFAULT_ROUNDS }, (_, i) => ({
          tournamentId,
          roundIndex: i,
        })),
      });
    });
    revalidatePath(`/app/tournaments/${tournamentId}`);
    revalidatePath(`/app/tournaments/${tournamentId}/setup`);
    return {};
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Impossible de démarrer le tournoi.";
    return { error: message };
  }
}
