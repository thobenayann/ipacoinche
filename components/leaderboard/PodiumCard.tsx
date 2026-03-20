import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

function formatWins(wins: number): string {
  return Number.isInteger(wins) ? String(wins) : wins.toFixed(1);
}

export function PodiumCard({
  href,
  rank,
  name,
  wins,
  goalAverage,
}: {
  href: string;
  rank: number;
  name: string;
  wins: number;
  goalAverage: number;
}) {
  const colors: Record<number, { bg: string; ring: string; text: string }> = {
    1: {
      bg: "bg-amber-50",
      ring: "ring-amber-400",
      text: "text-amber-600",
    },
    2: {
      bg: "bg-slate-50",
      ring: "ring-slate-300",
      text: "text-slate-500",
    },
    3: {
      bg: "bg-orange-50",
      ring: "ring-orange-300",
      text: "text-orange-500",
    },
  };
  const c = colors[rank] ?? colors[3];
  /*
   * Hauteurs fixes (pas seulement min-h) : sinon le contenu identique faisait
   * grandir chaque carte au même total. Parent en flex + items-end : le podium
   * redevient visuellement dégradé (1er le plus haut).
   */
  const heightClass =
    rank === 1 ? "h-40 sm:h-44" : rank === 2 ? "h-36 sm:h-40" : "h-32 sm:h-36";

  return (
    <Link
      href={href}
      className="block min-w-0 flex-1 cursor-pointer transition-all duration-200 active:scale-[0.97]"
    >
      <Card
        className={`${c.bg} ring-2 ${c.ring} h-full shadow-sm transition-shadow duration-200 hover:shadow-md`}
      >
        <CardContent
          className={`flex ${heightClass} flex-col items-center justify-center gap-1 px-2 py-2.5 sm:px-3 sm:py-3`}
        >
          <span className={`shrink-0 text-2xl font-bold leading-none ${c.text}`}>
            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
          </span>
          <p className="line-clamp-2 w-full max-w-full shrink-0 text-center text-sm font-semibold leading-snug text-[#333333]">
            {name}
          </p>
          <p className="shrink-0 text-xs leading-tight text-[#333333]/60">
            {formatWins(wins)} V · GA {goalAverage >= 0 ? "+" : ""}
            {goalAverage}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
