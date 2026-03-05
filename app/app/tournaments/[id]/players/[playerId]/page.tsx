import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeRanking, getPlayerHistory } from "@/lib/ranking";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Swords } from "lucide-react";

function formatWins(wins: number): string {
  return Number.isInteger(wins) ? String(wins) : wins.toFixed(1);
}

function ResultBadge({ result }: { result: "W" | "L" | "D" }) {
  const styles = {
    W: "bg-emerald-100 text-emerald-700",
    L: "bg-red-100 text-red-700",
    D: "bg-amber-100 text-amber-700",
  };
  const labels = { W: "Victoire", L: "Défaite", D: "Égalité" };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles[result]}`}
    >
      {labels[result]}
    </span>
  );
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string; playerId: string }>;
}) {
  const { id: tournamentId, playerId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId, userId: session.user.id },
    select: { id: true, name: true, status: true },
  });
  if (!tournament || tournament.status !== "started") notFound();

  const player = await prisma.player.findFirst({
    where: { id: playerId, tournamentId },
    select: { id: true, name: true },
  });
  if (!player) notFound();

  const [ranking, history] = await Promise.all([
    computeRanking(tournamentId),
    getPlayerHistory(tournamentId, playerId),
  ]);

  const stats = ranking.find((r) => r.playerId === playerId);

  const partnerCounts = new Map<string, number>();
  for (const h of history) {
    if (h.partner) {
      partnerCounts.set(h.partner, (partnerCounts.get(h.partner) ?? 0) + 1);
    }
  }
  const bestPartner = [...partnerCounts.entries()].sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title={player.name}
          subtitle={tournament.name}
          backHref={`/app/tournaments/${tournamentId}/leaderboard`}
          backLabel="Classement"
        />

        {stats && (
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Rang", value: `#${stats.rank}` },
              { label: "Victoires", value: formatWins(stats.wins) },
              { label: "GA", value: `${stats.goalAverage >= 0 ? "+" : ""}${stats.goalAverage}` },
              { label: "Points", value: String(stats.pointsScored) },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="flex flex-col items-center gap-1 p-3">
                  <span className="text-xl font-bold text-[var(--accent)]">
                    {s.value}
                  </span>
                  <span className="text-[11px] text-[#333333]/60">
                    {s.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {bestPartner && (
          <Card className="border-[var(--accent)]/20 bg-[var(--accent)]/5">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-lg">🤝</span>
              <div>
                <p className="text-sm font-medium text-[#333333]">
                  Meilleur partenaire
                </p>
                <p className="text-xs text-[#333333]/60">
                  {bestPartner[0]} ({bestPartner[1]} match
                  {bestPartner[1] > 1 ? "s" : ""} ensemble)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[#333333]">
            <Swords className="size-4" aria-hidden />
            Historique par tour
          </h2>

          {history.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="Aucun match joué"
              description="Ce joueur n&apos;a pas encore de table validée."
            />
          ) : (
            <ul className="space-y-2">
              {history.map((h) => (
                <li key={h.roundIndex}>
                  <Card className="shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          Tour {h.roundIndex + 1}
                        </Badge>
                        <ResultBadge result={h.result} />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm">
                          <p className="text-[#333333]/60">
                            Avec{" "}
                            <span className="font-medium text-[#333333]">
                              {h.partner ?? "—"}
                            </span>
                          </p>
                          <p className="text-[#333333]/60">
                            Contre{" "}
                            <span className="font-medium text-[#333333]">
                              {[h.opponent1, h.opponent2]
                                .filter(Boolean)
                                .join(" & ") || "—"}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold tabular-nums text-[#333333]">
                            {h.scoreTeam}
                          </span>
                          <span className="mx-1.5 text-[#333333]/30">—</span>
                          <span className="text-2xl font-bold tabular-nums text-[#333333]/40">
                            {h.scoreOpponent}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
