"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ExternalLink, Medal, User } from "lucide-react";
import type { PlayerRoundEntry, PlayerStats } from "@/lib/ranking";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** Copie légère pour le client (évite d’importer le module ranking avec Prisma). */
function winAverage(stats: Pick<PlayerStats, "wins" | "played">): number {
  if (stats.played <= 0) return -1;
  return stats.wins / stats.played;
}

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
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[result]}`}
    >
      {labels[result]}
    </span>
  );
}

type LeaderboardRowProps = {
  stats: PlayerStats;
  playerHref: string;
  /** GET JSON { history: PlayerRoundEntry[] } */
  historyFetchUrl: string;
};

export function LeaderboardRow({
  stats: r,
  playerHref,
  historyFetchUrl,
}: LeaderboardRowProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [history, setHistory] = React.useState<PlayerRoundEntry[] | null>(null);
  const [historyError, setHistoryError] = React.useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [historyLoadKey, setHistoryLoadKey] = React.useState(0);

  React.useEffect(() => {
    if (!modalOpen) return;
    let cancelled = false;
    setHistoryLoading(true);
    setHistoryError(null);
    void fetch(historyFetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error("fetch");
        return res.json() as Promise<{ history: PlayerRoundEntry[] }>;
      })
      .then((data) => {
        if (!cancelled) setHistory(data.history);
      })
      .catch(() => {
        if (!cancelled) {
          setHistoryError("Erreur de chargement.");
          setHistory(null);
        }
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [modalOpen, historyFetchUrl, historyLoadKey]);

  const avg = winAverage(r);
  const avgLabel =
    avg < 0 ? "—" : avg.toFixed(2);

  return (
    <>
      <Card className="shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_3px_12px_rgba(0,0,0,0.08)]">
        {/*
          Une ligne : rang · icône · nom (tronqué si trop long) · badge · [prorata+GA si assez large] · pts.
          Sous le breakpoint xl : prorata + GA uniquement dans la modale.
        */}
        <CardContent className="flex min-h-[48px] items-center gap-2 p-2.5 pl-3 sm:gap-3 sm:p-3 sm:pl-4">
          <Link
            href={playerHref}
            title={r.playerName}
            className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
          >
            <span className="w-6 shrink-0 text-center text-sm font-bold text-[#333333]/40 sm:w-7">
              {r.rank}
            </span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 sm:size-8">
              {r.rank <= 3 ? (
                <Medal className="size-3.5 text-[var(--accent)] sm:size-4" />
              ) : (
                <User className="size-3.5 text-[var(--accent)] sm:size-4" />
              )}
            </div>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#333333]">
              {r.playerName}
            </p>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Badge
              variant={r.played > 0 ? "default" : "secondary"}
              className="shrink-0 px-1.5 py-0 text-[10px] font-semibold sm:text-xs sm:px-2"
            >
              {formatWins(r.wins)} V
            </Badge>
            <span
              className="hidden w-11 shrink-0 text-right text-xs tabular-nums text-[#333333]/60 xl:inline-block"
              title="Moyenne victoires / matchs joués"
            >
              {avgLabel}
            </span>
            <span className="hidden w-[3.25rem] shrink-0 text-right text-xs tabular-nums text-[#333333]/60 xl:inline-block">
              GA {r.goalAverage >= 0 ? "+" : ""}
              {r.goalAverage}
            </span>
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-1.5 py-0.5 text-xs font-bold tabular-nums leading-tight text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/14 active:scale-[0.98] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 sm:px-2"
              onClick={() => setModalOpen(true)}
              aria-label={`Détail des points pour ${r.playerName} : ${r.pointsScored} points marqués`}
            >
              {r.pointsScored} pts
            </button>
          </div>
        </CardContent>
      </Card>

      {mounted &&
        modalOpen &&
        createPortal(
          <PlayerScoreDetailModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            stats={r}
            history={history}
            historyLoading={historyLoading}
            historyError={historyError}
            playerHref={playerHref}
            onRetry={() => {
              setHistoryLoadKey((k) => k + 1);
            }}
          />,
          document.body,
        )}
    </>
  );
}

function PlayerScoreDetailModal({
  open,
  onOpenChange,
  stats,
  history,
  historyLoading,
  historyError,
  playerHref,
  onRetry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: PlayerStats;
  history: PlayerRoundEntry[] | null;
  historyLoading: boolean;
  historyError: string | null;
  playerHref: string;
  onRetry: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const avg = winAverage(stats);
  const avgLabel = avg < 0 ? "—" : avg.toFixed(2);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[#333333]/45 backdrop-blur-[2px]"
        aria-label="Fermer"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="score-detail-title"
        className="relative z-10 flex max-h-[min(85dvh,560px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#333333]/10 bg-white shadow-xl page-enter"
      >
        <div className="flex-shrink-0 border-b border-[#333333]/10 px-5 pt-5 pb-3">
          <h2
            id="score-detail-title"
            className="text-lg font-semibold leading-tight text-[#333333]"
          >
            {stats.playerName}
          </h2>
          <p className="mt-1 text-sm text-[#333333]/60">
            Rang #{stats.rank} · {formatWins(stats.wins)} victoires ·{" "}
            {stats.played} match{stats.played > 1 ? "s" : ""} joué
            {stats.played > 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-shrink-0 border-b border-[#333333]/08 bg-[var(--accent)]/10 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#333333]/55">
            Points marqués (total)
          </p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-[var(--accent)]">
            {stats.pointsScored}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <div>
              <span className="text-[#333333]/55">Points encaissés</span>
              <p className="font-semibold tabular-nums text-[#333333]">
                {stats.pointsConceded}
              </p>
            </div>
            <div>
              <span className="text-[#333333]/55">GA</span>
              <p className="font-semibold tabular-nums text-[#333333]">
                {stats.goalAverage >= 0 ? "+" : ""}
                {stats.goalAverage}
              </p>
            </div>
            <div>
              <span className="text-[#333333]/55">Prorata / match</span>
              <p className="font-semibold tabular-nums text-[#333333]">
                {avgLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <h3 className="text-sm font-semibold text-[#333333]">
            Détail par tour
          </h3>
          {historyLoading && (
            <p className="mt-3 text-sm text-[#333333]/60">Chargement…</p>
          )}
          {historyError && (
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-sm text-red-600">{historyError}</p>
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                Réessayer
              </Button>
            </div>
          )}
          {!historyLoading &&
            !historyError &&
            history &&
            history.length === 0 && (
              <p className="mt-3 text-sm text-[#333333]/60">
                Aucune table validée.
              </p>
            )}
          {!historyLoading &&
            !historyError &&
            history &&
            history.length > 0 && (
              <ul className="mt-3 space-y-2">
                {history.map((h) => (
                  <li
                    key={h.roundIndex}
                    className="rounded-xl border border-[#333333]/10 bg-[#fafafa] px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[#333333]/60">
                        Tour {h.roundIndex + 1}
                      </span>
                      <ResultBadge result={h.result} />
                    </div>
                    <p className="mt-2 text-xs leading-snug text-[#333333]/70">
                      Avec{" "}
                      <span className="font-medium text-[#333333]">
                        {h.partner ?? "—"}
                      </span>
                      {" · "}
                      contre{" "}
                      <span className="font-medium text-[#333333]">
                        {[h.opponent1, h.opponent2].filter(Boolean).join(" & ") ||
                          "—"}
                      </span>
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <span className="text-lg font-bold tabular-nums text-[#333333]">
                        {h.scoreTeam}
                      </span>
                      <span className="text-[#333333]/30">—</span>
                      <span className="text-lg font-bold tabular-nums text-[#333333]/45">
                        {h.scoreOpponent}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>

        <div className="flex-shrink-0 border-t border-[#333333]/10 bg-white px-5 py-4">
          <Link
            href={playerHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 py-2.5 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/15"
            onClick={() => onOpenChange(false)}
          >
            Fiche complète
            <ExternalLink className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
