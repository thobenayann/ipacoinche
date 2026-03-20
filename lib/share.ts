import { prisma } from "@/lib/db";

/**
 * Résout un token de partage en tournamentId.
 * Retourne null si le token n'existe pas, est inactif ou expiré.
 */
export type ShareTokenResult = {
  tournamentId: string;
  tournamentName: string;
  tournamentStatus: string;
  totalRounds: number;
};

export async function resolveShareToken(
  token: string
): Promise<ShareTokenResult | null> {
  const link = await prisma.shareLink.findUnique({
    where: { token },
    include: {
      tournament: {
        select: { id: true, name: true, totalRounds: true, status: true },
      },
    },
  });

  if (!link) return null;
  if (!link.active) return null;
  if (new Date(link.expiresAt) < new Date()) return null;

  return {
    tournamentId: link.tournament.id,
    tournamentName: link.tournament.name,
    tournamentStatus: link.tournament.status,
    totalRounds: link.tournament.totalRounds,
  };
}
