import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TableEditorClient } from "./TableEditorClient";

export default async function TableEditorPage({
  params,
}: {
  params: Promise<{ id: string; roundIndex: string; tableId: string }>;
}) {
  const { id: tournamentId, roundIndex: roundIndexStr, tableId } = await params;
  const roundIndex = parseInt(roundIndexStr, 10);
  if (Number.isNaN(roundIndex) || roundIndex < 0) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId, userId: session.user.id },
    select: { id: true },
  });
  if (!tournament) notFound();

  const gameTable = await prisma.gameTable.findFirst({
    where: { id: tableId, round: { tournamentId } },
    include: {
      round: { select: { roundIndex: true } },
      playerA1: { select: { id: true, name: true } },
      playerA2: { select: { id: true, name: true } },
      playerB1: { select: { id: true, name: true } },
      playerB2: { select: { id: true, name: true } },
    },
  });
  if (!gameTable || gameTable.round.roundIndex !== roundIndex) notFound();

  const roundId = gameTable.roundId;
  const assignedInRound = new Set<string>();
  const allTablesInRound = await prisma.gameTable.findMany({
    where: { roundId },
    select: {
      playerA1Id: true,
      playerA2Id: true,
      playerB1Id: true,
      playerB2Id: true,
    },
  });
  for (const t of allTablesInRound) {
    if (t.playerA1Id) assignedInRound.add(t.playerA1Id);
    if (t.playerA2Id) assignedInRound.add(t.playerA2Id);
    if (t.playerB1Id) assignedInRound.add(t.playerB1Id);
    if (t.playerB2Id) assignedInRound.add(t.playerB2Id);
  }

  const thisTableIds = new Set<string>();
  if (gameTable.playerA1Id) thisTableIds.add(gameTable.playerA1Id);
  if (gameTable.playerA2Id) thisTableIds.add(gameTable.playerA2Id);
  if (gameTable.playerB1Id) thisTableIds.add(gameTable.playerB1Id);
  if (gameTable.playerB2Id) thisTableIds.add(gameTable.playerB2Id);

  const players = await prisma.player.findMany({
    where: { tournamentId },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });
  const availablePlayers = players.filter(
    (p) => !assignedInRound.has(p.id) || thisTableIds.has(p.id)
  );

  return (
    <TableEditorClient
      tournamentId={tournamentId}
      roundIndex={roundIndex}
      tableId={tableId}
      playerA1Id={gameTable.playerA1Id}
      playerA2Id={gameTable.playerA2Id}
      playerB1Id={gameTable.playerB1Id}
      playerB2Id={gameTable.playerB2Id}
      scoreTeamA={gameTable.scoreTeamA}
      scoreTeamB={gameTable.scoreTeamB}
      status={gameTable.status}
      availablePlayers={availablePlayers}
      userId={session.user.id}
    />
  );
}
