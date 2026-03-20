import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeRanking } from "@/lib/ranking";
import { PageHeader } from "@/components/ui/page-header";
import { CloseClient } from "./CloseClient";

export default async function ClosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId, userId: session.user.id },
    select: {
      id: true,
      name: true,
      status: true,
      date: true,
    },
  });

  if (!tournament || (tournament.status !== "started" && tournament.status !== "closed")) {
    notFound();
  }

  const ranking = await computeRanking(tournamentId);

  const totalValidatedTables = await prisma.gameTable.count({
    where: {
      round: { tournamentId },
      status: "validated",
    },
  });

  const totalPlayers = await prisma.player.count({
    where: { tournamentId },
  });

  const dateStr = tournament.date
    ? tournament.date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title={
            tournament.status === "closed"
              ? "Tournoi clôturé"
              : "Clôture"
          }
          subtitle={tournament.name}
          backHref={`/app/tournaments/${tournamentId}`}
          backLabel="Tournoi"
        />

        <CloseClient
          tournamentId={tournamentId}
          tournamentName={tournament.name}
          tournamentDate={dateStr}
          userId={session.user.id}
          status={tournament.status}
          ranking={ranking.map((r) => ({
            rank: r.rank,
            playerName: r.playerName,
            wins: r.wins,
            goalAverage: r.goalAverage,
            pointsScored: r.pointsScored,
            played: r.played,
          }))}
          totalPlayers={totalPlayers}
          totalValidatedTables={totalValidatedTables}
        />
      </div>
    </div>
  );
}
