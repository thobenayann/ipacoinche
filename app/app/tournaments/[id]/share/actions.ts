"use server";

import { prisma } from "@/lib/db";
import { SHARE_LINK_EXPIRY_DAYS } from "@/lib/share-constants";
import { revalidatePath } from "next/cache";

async function getTournamentIfOwner(tournamentId: string, userId: string) {
  return prisma.tournament.findFirst({
    where: { id: tournamentId, userId },
    select: { id: true },
  });
}

export async function createShareLinkAction({
  tournamentId,
  userId,
}: {
  tournamentId: string;
  userId: string;
}): Promise<{ error?: string }> {
  try {
    const t = await getTournamentIfOwner(tournamentId, userId);
    if (!t) return { error: "Tournoi introuvable." };

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SHARE_LINK_EXPIRY_DAYS);

    await prisma.shareLink.create({
      data: { tournamentId, expiresAt },
    });

    revalidatePath(`/app/tournaments/${tournamentId}/share`);
    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return { error: message };
  }
}

export async function toggleShareLinkAction({
  linkId,
  active,
  userId,
}: {
  linkId: string;
  active: boolean;
  userId: string;
}): Promise<{ error?: string }> {
  try {
    const link = await prisma.shareLink.findUnique({
      where: { id: linkId },
      include: { tournament: { select: { userId: true, id: true } } },
    });
    if (!link || link.tournament.userId !== userId)
      return { error: "Lien introuvable." };

    await prisma.shareLink.update({
      where: { id: linkId },
      data: { active },
    });

    revalidatePath(`/app/tournaments/${link.tournament.id}/share`);
    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return { error: message };
  }
}

export async function regenerateShareLinkAction({
  linkId,
  userId,
}: {
  linkId: string;
  userId: string;
}): Promise<{ error?: string }> {
  try {
    const link = await prisma.shareLink.findUnique({
      where: { id: linkId },
      include: { tournament: { select: { userId: true, id: true } } },
    });
    if (!link || link.tournament.userId !== userId)
      return { error: "Lien introuvable." };

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SHARE_LINK_EXPIRY_DAYS);

    const { randomBytes } = await import("crypto");
    const newToken = randomBytes(16).toString("hex");

    await prisma.shareLink.update({
      where: { id: linkId },
      data: { token: newToken, expiresAt, active: true },
    });

    revalidatePath(`/app/tournaments/${link.tournament.id}/share`);
    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return { error: message };
  }
}
