import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DEFAULT_ROUNDS } from "@/lib/tournament-constants";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { MatchCard } from "@/components/match/MatchCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoundActions } from "./RoundActions";

export default async function RoundPage({
  params,
}: {
  params: Promise<{ id: string; roundIndex: string }>;
}) {
  const { id: tournamentId, roundIndex: roundIndexStr } = await params;
  const roundIndex = parseInt(roundIndexStr, 10);
  if (Number.isNaN(roundIndex) || roundIndex < 0 || roundIndex >= DEFAULT_ROUNDS) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId, userId: session.user.id },
    select: { id: true, name: true, status: true },
  });
  if (!tournament || tournament.status !== "started") notFound();

  const round = await prisma.round.findFirst({
    where: { tournamentId, roundIndex },
    include: {
      gameTables: {
        include: {
          playerA1: { select: { name: true } },
          playerA2: { select: { name: true } },
          playerB1: { select: { name: true } },
          playerB2: { select: { name: true } },
        },
      },
    },
  });
  if (!round) notFound();

  const players = await prisma.player.findMany({
    where: { tournamentId },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  const assignedIds = new Set<string>();
  for (const t of round.gameTables) {
    if (t.playerA1Id) assignedIds.add(t.playerA1Id);
    if (t.playerA2Id) assignedIds.add(t.playerA2Id);
    if (t.playerB1Id) assignedIds.add(t.playerB1Id);
    if (t.playerB2Id) assignedIds.add(t.playerB2Id);
  }
  const unassigned = players.filter((p) => !assignedIds.has(p.id));

  const tables = round.gameTables.map((t) => ({
    id: t.id,
    status: t.status,
    scoreTeamA: t.scoreTeamA,
    scoreTeamB: t.scoreTeamB,
    playerA1: t.playerA1?.name ?? null,
    playerA2: t.playerA2?.name ?? null,
    playerB1: t.playerB1?.name ?? null,
    playerB2: t.playerB2?.name ?? null,
  }));

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title={tournament.name}
          subtitle={`Tour ${roundIndex + 1} / ${DEFAULT_ROUNDS} · ${assignedIds.size}/${players.length} joueurs assignés`}
          backHref={`/app/tournaments/${tournament.id}`}
          backLabel="Retour"
        />

        <RoundActions
          tournamentId={tournament.id}
          roundIndex={roundIndex}
          userId={session.user.id}
        />

        {tables.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            title="Aucune table"
            description="Ajoutez une table manuellement ou utilisez le gabarit automatique."
          />
        ) : (
          <ul className="space-y-4">
            {tables.map((t, i) => (
              <li key={t.id}>
                <MatchCard
                  match={t}
                  tableIndex={i + 1}
                  tournamentId={tournament.id}
                  roundIndex={roundIndex}
                />
              </li>
            ))}
          </ul>
        )}

        {unassigned.length > 0 && (
          <Card className="border-dashed">
            <CardContent className="p-4">
              <h2 className="flex items-center gap-2 text-sm font-medium text-[#333333]">
                <Users className="size-4" aria-hidden />
                En pause
                <Badge variant="secondary">{unassigned.length}</Badge>
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {unassigned.map((p) => (
                  <span
                    key={p.id}
                    className="rounded-full bg-[#333333]/5 px-3 py-1 text-xs font-medium text-[#333333]/70"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <nav className="flex justify-between gap-3 pt-2" aria-label="Navigation entre tours">
          {roundIndex > 0 ? (
            <Link
              href={`/app/tournaments/${tournament.id}/rounds/${roundIndex - 1}`}
              className="group inline-flex min-h-[40px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#333333]/10 bg-white px-4 text-sm font-medium text-[#333333]/70 shadow-sm transition-all duration-200 hover:border-[var(--accent)]/30 hover:text-[var(--accent)] active:scale-[0.97]"
            >
              <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
              Tour {roundIndex}
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {roundIndex < DEFAULT_ROUNDS - 1 ? (
            <Link
              href={`/app/tournaments/${tournament.id}/rounds/${roundIndex + 1}`}
              className="group inline-flex min-h-[40px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#333333]/10 bg-white px-4 text-sm font-medium text-[#333333]/70 shadow-sm transition-all duration-200 hover:border-[var(--accent)]/30 hover:text-[var(--accent)] active:scale-[0.97]"
            >
              Tour {roundIndex + 2}
              <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </div>
    </div>
  );
}
