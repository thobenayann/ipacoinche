import { cn } from "@/lib/utils";

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function PlayerSlot({
  name,
  align,
}: {
  name: string | null;
  align: "left" | "right";
}) {
  const isEmpty = !name;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        align === "right" && "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex size-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold",
          isEmpty
            ? "bg-[#333333]/8 text-[#333333]/30"
            : "bg-[var(--accent)]/12 text-[var(--accent)]"
        )}
      >
        {getInitials(name)}
      </div>
      <span
        className={cn(
          "truncate text-sm font-medium",
          isEmpty ? "text-[#333333]/35" : "text-[#333333]"
        )}
      >
        {name || "Joueur…"}
      </span>
    </div>
  );
}

export function TeamStack({
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
  return (
    <div className="flex flex-col gap-2.5">
      <PlayerSlot name={player1} align={align} />
      <PlayerSlot name={player2} align={align} />
      <p
        className={cn(
          "text-[10px] font-semibold uppercase tracking-widest text-[#333333]/35",
          align === "right" && "text-right"
        )}
      >
        {label}
      </p>
    </div>
  );
}
