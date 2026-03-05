import { prisma } from "@/lib/db";

/**
 * Résout un token de partage en tournamentId.
 * Retourne null si le token n'existe pas, est inactif ou expiré.
 */
export async function resolveShareToken(
  token: string
): Promise<{ tournamentId: string; tournamentName: string } | null> {
  const link = await prisma.shareLink.findUnique({
    where: { token },
    include: { tournament: { select: { id: true, name: true } } },
  });

  if (!link) return null;
  if (!link.active) return null;
  if (new Date(link.expiresAt) < new Date()) return null;

  return {
    tournamentId: link.tournament.id,
    tournamentName: link.tournament.name,
  };
}
