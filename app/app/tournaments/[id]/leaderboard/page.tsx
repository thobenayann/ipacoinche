import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeRanking } from "@/lib/ranking";
import { podiumDisplayIndices } from "@/lib/podium-display";
import { PodiumCard } from "@/components/leaderboard/PodiumCard";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId, userId: session.user.id },
    select: { id: true, name: true, status: true },
  });
  if (!tournament || (tournament.status !== "started" && tournament.status !== "closed")) notFound();

  const ranking = await computeRanking(tournamentId);
  const hasData = ranking.some((r) => r.played > 0);

  const podium = ranking.slice(0, 3);
  const podiumOrder = podiumDisplayIndices(podium);

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title="Classement"
          subtitle={tournament.name}
          backHref={`/app/tournaments/${tournamentId}`}
          backLabel="Tournoi"
        />

        {!hasData ? (
          <EmptyState
            icon={Trophy}
            title="Pas encore de résultats"
            description="Validez au moins une table pour voir le classement."
          />
        ) : (
          <>
            {podium.length >= 3 && (
              <div className="flex items-end gap-2">
                {podiumOrder.map((idx) => {
                  const row = podium[idx];
                  return (
                    <PodiumCard
                      key={row.playerId}
                      href={`/app/tournaments/${tournamentId}/players/${row.playerId}`}
                      rank={row.rank}
                      name={row.playerName}
                      wins={row.wins}
                      goalAverage={row.goalAverage}
                    />
                  );
                })}
              </div>
            )}

            <div className="space-y-2">
              {ranking.map((r) => (
                <LeaderboardRow
                  key={r.playerId}
                  stats={r}
                  playerHref={`/app/tournaments/${tournamentId}/players/${r.playerId}`}
                  historyFetchUrl={`/api/tournaments/${tournamentId}/players/${r.playerId}/history`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
