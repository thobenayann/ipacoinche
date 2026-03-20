import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPlayerHistory } from "@/lib/ranking";
import { resolveShareToken } from "@/lib/share";

/**
 * Historique des matchs validés pour un joueur (lien de partage).
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ token: string; playerId: string }> },
) {
  const { token, playerId } = await context.params;
  const share = await resolveShareToken(token);
  if (!share) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const player = await prisma.player.findFirst({
    where: { id: playerId, tournamentId: share.tournamentId },
    select: { id: true },
  });
  if (!player) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const history = await getPlayerHistory(share.tournamentId, playerId);
  return NextResponse.json({ history });
}
