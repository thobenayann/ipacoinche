import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, Medal, User } from "lucide-react";
import { resolveShareToken } from "@/lib/share";
import { computeRanking } from "@/lib/ranking";
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

  return (
    <div className="px-4 pb-24 pt-6">
      <div className="space-y-6">
        <PageHeader title="Classement" subtitle={share.tournamentName} />

        {!hasData ? (
          <EmptyState
            icon={Trophy}
            title="Pas encore de résultats"
            description="Le tournoi est en cours, revenez bientôt."
          />
        ) : (
          <div className="space-y-2">
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
                    <div className="flex items-center gap-3 text-xs text-[#333333]/60">
                      <Badge
                        variant={r.played > 0 ? "default" : "secondary"}
                      >
                        {formatWins(r.wins)} V
                      </Badge>
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
        )}
      </div>
    </div>
  );
}
