import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamStack } from "./TeamStack";
import { ScoreDisplay } from "./ScoreDisplay";

const SUIT_ICONS = ["\u2660", "\u2665", "\u2666", "\u2663"] as const;

export type MatchCardData = {
  id: string;
  status: string;
  scoreTeamA: number | null;
  scoreTeamB: number | null;
  playerA1: string | null;
  playerA2: string | null;
  playerB1: string | null;
  playerB2: string | null;
};

export function MatchCard({
  match,
  tableIndex,
  tournamentId,
  roundIndex,
}: {
  match: MatchCardData;
  tableIndex: number;
  tournamentId: string;
  roundIndex: number;
}) {
  const suit = SUIT_ICONS[(tableIndex - 1) % SUIT_ICONS.length];
  const hasScores = match.scoreTeamA !== null && match.scoreTeamB !== null;

  return (
    <Link
      href={`/app/tournaments/${tournamentId}/rounds/${roundIndex}/tables/${match.id}`}
      className="block cursor-pointer transition-all duration-200 active:scale-[0.985]"
    >
      <Card className="overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]">
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
              <TeamStack
                player1={match.playerA1}
                player2={match.playerA2}
                label="Équipe A"
                align="left"
              />
            </div>

            <div className="flex flex-shrink-0 items-center justify-center px-3">
              <ScoreDisplay
                scoreA={match.scoreTeamA}
                scoreB={match.scoreTeamB}
                hasScores={hasScores}
              />
            </div>

            <div className="min-w-0 flex-1">
              <TeamStack
                player1={match.playerB1}
                player2={match.playerB2}
                label="Équipe B"
                align="right"
              />
            </div>
          </div>

          <div className="border-t border-[#333333]/8 px-5 py-2.5">
            <p className="text-center text-[11px] text-[#333333]/40">
              Appuyez pour modifier
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
