import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { resolveShareToken } from "@/lib/share";
import { computeRanking } from "@/lib/ranking";
import { podiumDisplayIndices } from "@/lib/podium-display";
import { PodiumCard } from "@/components/leaderboard/PodiumCard";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

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
                <LeaderboardRow
                  key={r.playerId}
                  stats={r}
                  playerHref={`/t/${token}/players/${r.playerId}`}
                  historyFetchUrl={`/api/t/${token}/players/${r.playerId}/history`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
