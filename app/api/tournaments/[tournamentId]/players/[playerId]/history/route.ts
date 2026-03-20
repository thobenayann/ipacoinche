import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPlayerHistory } from "@/lib/ranking";

/**
 * Historique des matchs validés pour un joueur (espace connecté).
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ tournamentId: string; playerId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tournamentId, playerId } = await context.params;
  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId, userId: session.user.id },
    select: { id: true },
  });
  if (!tournament) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const player = await prisma.player.findFirst({
    where: { id: playerId, tournamentId },
    select: { id: true },
  });
  if (!player) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const history = await getPlayerHistory(tournamentId, playerId);
  return NextResponse.json({ history });
}
