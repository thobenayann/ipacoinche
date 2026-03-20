import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, Medal, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeRanking, winAverage } from "@/lib/ranking";
import { podiumDisplayIndices } from "@/lib/podium-display";
import { PodiumCard } from "@/components/leaderboard/PodiumCard";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatWins(wins: number): string {
  return Number.isInteger(wins) ? String(wins) : wins.toFixed(1);
}

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
                <Link
                  key={r.playerId}
                  href={`/app/tournaments/${tournamentId}/players/${r.playerId}`}
                  className="block cursor-pointer transition-all duration-200 active:scale-[0.985]"
                >
                  <Card className="shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
                    <CardContent className="flex min-h-[52px] items-center gap-3 p-3 pl-4">
                      <span className="w-7 flex-shrink-0 text-center text-sm font-bold text-[#333333]/40">
                        {r.rank}
                      </span>
                      <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10">
                        {r.rank <= 3 ? (
                          <Medal className="size-4 text-[var(--accent)]" />
                        ) : (
                          <User className="size-4 text-[var(--accent)]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#333333]">
                          {r.playerName}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 text-xs text-[#333333]/60 sm:gap-3">
                        <Badge
                          variant={r.played > 0 ? "default" : "secondary"}
                        >
                          {formatWins(r.wins)} V
                        </Badge>
                        <span
                          className="w-11 text-right tabular-nums"
                          title="Moyenne victoires / matchs joués"
                        >
                          {winAverage(r) < 0
                            ? "—"
                            : winAverage(r).toFixed(2)}
                        </span>
                        <span className="w-12 text-right tabular-nums">
                          GA {r.goalAverage >= 0 ? "+" : ""}
                          {r.goalAverage}
                        </span>
                        <span className="w-10 text-right tabular-nums">
                          {r.pointsScored} pts
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
