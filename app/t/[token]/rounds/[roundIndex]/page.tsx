import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveShareToken } from "@/lib/share";
import { prisma } from "@/lib/db";
import { DEFAULT_ROUNDS } from "@/lib/tournament-constants";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


export default async function ReadonlyRoundPage({
  params,
}: {
  params: Promise<{ token: string; roundIndex: string }>;
}) {
  const { token, roundIndex: roundIndexStr } = await params;
  const roundIndex = parseInt(roundIndexStr, 10);
  if (Number.isNaN(roundIndex) || roundIndex < 0 || roundIndex >= DEFAULT_ROUNDS) {
    notFound();
  }

  const share = await resolveShareToken(token);
  if (!share) notFound();

  const round = await prisma.round.findFirst({
    where: { tournamentId: share.tournamentId, roundIndex },
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
    where: { tournamentId: share.tournamentId },
    select: { id: true, name: true },
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
    <div className="px-4 pb-24 pt-6">
      <div className="space-y-6">
        <PageHeader
          title={share.tournamentName}
          subtitle={`Tour ${roundIndex + 1} / ${DEFAULT_ROUNDS} · ${assignedIds.size}/${players.length} joueurs`}
        />

        {tables.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            title="Aucune table"
            description="Ce tour n&apos;a pas encore de tables configurées."
          />
        ) : (
          <ul className="space-y-4">
            {tables.map((t, i) => (
              <li key={t.id}>
                <ReadonlyMatchCard match={t} tableIndex={i + 1} />
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
              href={`/t/${token}/rounds/${roundIndex - 1}`}
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
              href={`/t/${token}/rounds/${roundIndex + 1}`}
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

function ReadonlyMatchCard({
  match,
  tableIndex,
}: {
  match: {
    id: string;
    status: string;
    scoreTeamA: number | null;
    scoreTeamB: number | null;
    playerA1: string | null;
    playerA2: string | null;
    playerB1: string | null;
    playerB2: string | null;
  };
  tableIndex: number;
}) {
  const SUIT_ICONS = ["\u2660", "\u2665", "\u2666", "\u2663"] as const;
  const suit = SUIT_ICONS[(tableIndex - 1) % SUIT_ICONS.length];
  const hasScores = match.scoreTeamA !== null && match.scoreTeamB !== null;

  return (
    <Card className="overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-5 pb-0 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden>
              {suit}
            </span>
            <span className="text-sm font-semibold text-[#333333]">
              Table {tableIndex}
            </span>
          </div>
          <Badge
            variant={match.status === "validated" ? "success" : "secondary"}
          >
            {match.status === "validated" ? "Validée" : "Brouillon"}
          </Badge>
        </div>

        <div className="flex items-center gap-0 px-5 pb-4 pt-4">
          <div className="min-w-0 flex-1">
            <TeamDisplay
              player1={match.playerA1}
              player2={match.playerA2}
              label="Équipe A"
              align="left"
            />
          </div>
          <div className="flex flex-shrink-0 items-center justify-center px-3">
            {hasScores ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums text-[#333333]">
                  {match.scoreTeamA}
                </span>
                <span className="text-sm text-[#333333]/30">—</span>
                <span className="text-2xl font-bold tabular-nums text-[#333333]/40">
                  {match.scoreTeamB}
                </span>
              </div>
            ) : (
              <span className="text-sm text-[#333333]/30">vs</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <TeamDisplay
              player1={match.playerB1}
              player2={match.playerB2}
              label="Équipe B"
              align="right"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamDisplay({
  player1,
  player2,
  label,
  align,
}: {
  player1: string | null;
  player2: string | null;
  label: string;
  align: "left" | "right";
}) {
  const textAlign = align === "right" ? "text-right" : "text-left";
  return (
    <div className={`space-y-1 ${textAlign}`}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-[#333333]/40">
        {label}
      </p>
      <p className="truncate text-sm text-[#333333]">
        {player1 ?? "Joueur\u2026"}
      </p>
      <p className="truncate text-sm text-[#333333]/60">
        {player2 ?? "Joueur\u2026"}
      </p>
    </div>
  );
}
