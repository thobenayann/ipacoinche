export function ScoreDisplay({
  scoreA,
  scoreB,
  hasScores,
}: {
  scoreA: number | null;
  scoreB: number | null;
  hasScores: boolean;
}) {
  if (!hasScores) {
    return (
      <span className="text-sm font-semibold uppercase tracking-widest text-[#333333]/25">
        vs
      </span>
    );
  }

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-5xl font-extrabold tabular-nums leading-none text-[#333333]">
        {scoreA}
      </span>
      <span className="px-1 text-2xl font-light leading-none text-[#333333]/20">
        –
      </span>
      <span className="text-5xl font-extrabold tabular-nums leading-none text-[#333333]">
        {scoreB}
      </span>
    </div>
  );
}
