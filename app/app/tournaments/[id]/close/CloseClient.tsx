"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { closeTournamentAction, reopenTournamentAction } from "./actions";
import { generateRecapPdf } from "@/lib/export-pdf";
import { winAverage } from "@/lib/ranking";
import { podiumDisplayIndices } from "@/lib/podium-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lock,
  LockOpen,
  Download,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

type PlayerRanking = {
  rank: number;
  playerName: string;
  wins: number;
  goalAverage: number;
  pointsScored: number;
  played: number;
};

export function CloseClient({
  tournamentId,
  tournamentName,
  tournamentDate,
  userId,
  status,
  ranking,
  totalPlayers,
  totalValidatedTables,
}: {
  tournamentId: string;
  tournamentName: string;
  tournamentDate: string | null;
  userId: string;
  status: string;
  ranking: PlayerRanking[];
  totalPlayers: number;
  totalValidatedTables: number;
}) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const [reopening, setReopening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isClosed = status === "closed";
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const cvs = document.createElement("canvas");
      cvs.width = img.naturalWidth || 480;
      cvs.height = img.naturalHeight || 120;
      const c = cvs.getContext("2d");
      if (c) {
        c.drawImage(img, 0, 0, cvs.width, cvs.height);
        setLogoDataUrl(cvs.toDataURL("image/png"));
      }
    };
    img.src = "/logo/logo-ipanova.svg";
  }, []);

  async function handleClose() {
    setError(null);
    setClosing(true);
    const res = await closeTournamentAction({ tournamentId, userId });
    setClosing(false);
    if (res.error) setError(res.error);
    else router.refresh();
  }

  async function handleReopen() {
    setError(null);
    setReopening(true);
    const res = await reopenTournamentAction({ tournamentId, userId });
    setReopening(false);
    if (res.error) setError(res.error);
    else router.refresh();
  }

  function formatWins(wins: number): string {
    return Number.isInteger(wins) ? String(wins) : wins.toFixed(1);
  }

  /** Médaille selon le rang réel (ex æquo = même médaille : plusieurs or si plusieurs rangs 1). */
  function medalForRank(rank: number): string {
    if (rank === 1) return "\u{1F947}";
    if (rank === 2) return "\u{1F948}";
    return "\u{1F949}";
  }

  /** Hauteur du plateau : le rang 1 est toujours le plus haut ; ex æquo = même hauteur. */
  function barHeightForRank(rank: number): number {
    if (rank === 1) return 260;
    if (rank === 2) return 200;
    return 160;
  }

  function barColorForRank(rank: number): string {
    if (rank === 1) return "#51bdcb";
    if (rank === 2) return "#a0d8df";
    return "#c8e8ec";
  }

  function drawPodiumBars(
    ctx: CanvasRenderingContext2D,
    W: number,
    startY: number,
    bottomY: number
  ) {
    const podium = ranking.slice(0, 3);
    if (podium.length === 0) return;

    const displayIndices = podiumDisplayIndices(podium);
    const numCols = displayIndices.length;
    const gap = 20;
    const barWidth = numCols === 2 ? 220 : 180;
    const totalBarsWidth = barWidth * numCols + gap * (numCols - 1);
    const startX = (W - totalBarsWidth) / 2;

    const heights = displayIndices.map((pi) => barHeightForRank(podium[pi].rank));
    const maxBarH = Math.max(...heights);
    const availableH = bottomY - startY;
    const scale = availableH < maxBarH + 20 ? (availableH - 20) / maxBarH : 1;

    displayIndices.forEach((pi, col) => {
      const p = podium[pi];
      if (!p) return;
      const x = startX + col * (barWidth + gap);
      const barH = barHeightForRank(p.rank) * scale;
      const barY = bottomY - barH;

      ctx.fillStyle = barColorForRank(p.rank);
      ctx.beginPath();
      ctx.roundRect(x, barY, barWidth, barH, [12, 12, 0, 0]);
      ctx.fill();

      ctx.fillStyle = "#333333";
      ctx.font = "36px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(medalForRank(p.rank), x + barWidth / 2, barY + 50);

      ctx.font = "bold 20px sans-serif";
      ctx.fillText(p.playerName, x + barWidth / 2, barY + 85);

      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#333333";
      ctx.globalAlpha = 0.7;
      ctx.fillText(
        `${formatWins(p.wins)} V \u00b7 GA ${p.goalAverage >= 0 ? "+" : ""}${p.goalAverage}`,
        x + barWidth / 2,
        barY + 112
      );
      ctx.globalAlpha = 1;
    });
  }

  const exportPodiumImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 800;
    const H = 580;
    canvas.width = W;
    canvas.height = H;

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#51bdcb";
    ctx.fillRect(0, 0, W, 10);

    let y = 28;

    if (logoDataUrl) {
      const logoImg = new Image();
      logoImg.src = logoDataUrl;
      const logoW = 140;
      const logoH = 36;
      ctx.drawImage(logoImg, (W - logoW) / 2, y, logoW, logoH);
      y += logoH + 8;
    }

    ctx.fillStyle = "#51bdcb";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("IPACOINCHE", W / 2, y);
    y += 28;

    ctx.fillStyle = "#333333";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(tournamentName, W / 2, y);
    y += 30;

    if (tournamentDate) {
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#333333";
      ctx.globalAlpha = 0.6;
      ctx.fillText(tournamentDate, W / 2, y);
      ctx.globalAlpha = 1;
      y += 20;
    }

    y += 10;

    drawPodiumBars(ctx, W, y, H - 40);

    ctx.fillStyle = "#51bdcb";
    ctx.fillRect(0, H - 10, W, 10);

    const link = document.createElement("a");
    link.download = `podium-${tournamentName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [ranking, tournamentName, tournamentDate, logoDataUrl]);

  const exportPdfRecap = useCallback(() => {
    const canvas = canvasRef.current;
    let podiumImageDataUrl: string | null = null;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const W = 800;
        const H = 340;
        canvas.width = W;
        canvas.height = H;

        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, W, H);

        drawPodiumBars(ctx, W, 10, H - 10);

        podiumImageDataUrl = canvas.toDataURL("image/png");
      }
    }

    generateRecapPdf({
      tournamentName,
      tournamentDate,
      totalPlayers,
      totalValidatedTables,
      ranking: ranking.map((r) => ({
        rank: r.rank,
        playerName: r.playerName,
        winAverage:
          winAverage(r) < 0 ? "—" : winAverage(r).toFixed(2),
        wins: formatWins(r.wins),
        goalAverage: `${r.goalAverage >= 0 ? "+" : ""}${r.goalAverage}`,
        pointsScored: r.pointsScored,
      })),
      logoDataUrl,
      podiumImageDataUrl,
    });
  }, [ranking, tournamentName, tournamentDate, totalPlayers, totalValidatedTables, logoDataUrl]);

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <CardContent className="space-y-3 p-4">
          <h2 className="text-sm font-semibold text-[#333333]">Résumé</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Joueurs", value: totalPlayers },
              { label: "Tables validées", value: totalValidatedTables },
              { label: "Statut", value: isClosed ? "Clôturé" : "En cours" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg bg-[#333333]/5 p-3 text-center"
              >
                <p className="text-lg font-bold text-[var(--accent)]">
                  {s.value}
                </p>
                <p className="text-[11px] text-[#333333]/60">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <CardContent className="space-y-3 p-4">
          <h2 className="text-sm font-semibold text-[#333333]">Exports</h2>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={exportPodiumImage}>
              <ImageIcon className="size-4" aria-hidden />
              <span className="ml-1.5">Image podium</span>
            </Button>
            <Button size="sm" variant="outline" onClick={exportPdfRecap}>
              <FileText className="size-4" aria-hidden />
              <span className="ml-1.5">PDF récap</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {!isClosed ? (
        <Card className="border-amber-200 bg-amber-50 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <CardContent className="space-y-3 p-4">
            <h2 className="text-sm font-semibold text-amber-800">
              Clôturer le tournoi
            </h2>
            <p className="text-xs text-amber-700">
              Le classement sera figé. Vous pourrez toujours corriger des tables
              et consulter l&apos;historique.
            </p>
            <Button
              onClick={handleClose}
              disabled={closing}
              className="w-full"
            >
              <Lock className="size-4" aria-hidden />
              <span className="ml-1.5">
                {closing ? "Clôture…" : "Clôturer le tournoi"}
              </span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[var(--accent)]/20 bg-[var(--accent)]/5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <CardContent className="space-y-3 p-4">
            <h2 className="text-sm font-semibold text-[#333333]">
              Tournoi clôturé
            </h2>
            <p className="text-xs text-[#333333]/60">
              Le tournoi est clôturé. Vous pouvez le rouvrir si nécessaire.
            </p>
            <Button
              variant="outline"
              onClick={handleReopen}
              disabled={reopening}
              size="sm"
            >
              <LockOpen className="size-4" aria-hidden />
              <span className="ml-1.5">
                {reopening ? "Réouverture…" : "Rouvrir le tournoi"}
              </span>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <CardContent className="space-y-3 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[#333333]">
            <Download className="size-4" aria-hidden />
            Classement final
          </h2>
          <ul className="space-y-1">
            {ranking.map((r) => (
              <li
                key={r.rank + r.playerName}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm"
              >
                <span className="w-6 flex-shrink-0 text-center font-bold text-[#333333]/40">
                  {r.rank}
                </span>
                <span className="flex-1 truncate font-medium text-[#333333]">
                  {r.playerName}
                </span>
                <span className="text-xs tabular-nums text-[#333333]/60">
                  {formatWins(r.wins)} V
                </span>
                <span
                  className="w-10 text-right text-xs tabular-nums text-[#333333]/50"
                  title="Moyenne"
                >
                  {winAverage(r) < 0 ? "—" : winAverage(r).toFixed(2)}
                </span>
                <span className="w-12 text-right text-xs tabular-nums text-[#333333]/60">
                  GA {r.goalAverage >= 0 ? "+" : ""}
                  {r.goalAverage}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
