import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, Medal, User } from "lucide-react";
import { resolveShareToken } from "@/lib/share";
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

export default async function ReadonlyLeaderboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await resolveShareToken(token);
  if (!share) notFound();

  const ranking = await computeRanking(share.tournamentId);
  const hasData = ranking.some((r) => r.played > 0);

  const podium = ranking.slice(0, 3);
  const podiumOrder = podiumDisplayIndices(podium);
  const isClosed = share.tournamentStatus === "closed";

  return (
    <div className="px-4 pb-24 pt-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader title="Classement" subtitle={share.tournamentName} />

        {!hasData ? (
          <EmptyState
            icon={Trophy}
            title="Pas encore de résultats"
            description="Le tournoi est en cours, revenez bientôt."
          />
        ) : (
          <>
            {podium.length >= 3 && (
              <div className="space-y-3">
                <h2 className="text-center text-sm font-semibold tracking-wide text-[#333333]">
                  {isClosed ? "Podium final" : "Podium provisoire"}
                </h2>
                <p className="text-center text-xs text-[#333333]/55">
                  {isClosed
                    ? "Classement figé après clôture du tournoi."
                    : "Évolution possible selon les prochains résultats."}
                </p>
                <div className="flex items-end gap-2">
                  {podiumOrder.map((idx) => {
                    const row = podium[idx];
                    return (
                      <PodiumCard
                        key={row.playerId}
                        href={`/t/${token}/players/${row.playerId}`}
                        rank={row.rank}
                        name={row.playerName}
                        wins={row.wins}
                        goalAverage={row.goalAverage}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {podium.length >= 3 && (
                <h3 className="px-1 pt-2 text-xs font-semibold uppercase tracking-wide text-[#333333]/45">
                  Détail du classement
                </h3>
              )}
              {ranking.map((r) => (
                <Link
                  key={r.playerId}
                  href={`/t/${token}/players/${r.playerId}`}
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
