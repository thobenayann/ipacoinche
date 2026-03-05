"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { seedDemoAction, resetDemoAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, RotateCcw, ArrowRight, Trash2 } from "lucide-react";

type DemoTournament = {
  id: string;
  name: string;
  status: string;
  playerCount: number;
};

export function DemoClient({
  userId,
  existing,
}: {
  userId: string;
  existing: DemoTournament[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSeed() {
    setError(null);
    setLoading(true);
    const res = await seedDemoAction({ userId });
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else if (res.tournamentId) {
      router.push(`/app/tournaments/${res.tournamentId}`);
    }
  }

  async function handleReset() {
    setError(null);
    setResetting(true);
    const res = await resetDemoAction({ userId });
    setResetting(false);
    if (res.error) setError(res.error);
    else router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <Card className="border-[var(--accent)]/20 bg-[var(--accent)]/5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[var(--accent)]/15">
              <Gamepad2 className="size-5 text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#333333]">Tournoi de démonstration</h2>
              <p className="text-xs text-[#333333]/60">
                12 joueurs, 4 tours, tables et scores pré-remplis
              </p>
            </div>
          </div>

          <Button
            onClick={handleSeed}
            disabled={loading}
            className="w-full"
          >
            <Gamepad2 className="size-4" aria-hidden />
            <span className="ml-1.5">
              {loading ? "Création…" : "Lancer une démo"}
            </span>
          </Button>
        </CardContent>
      </Card>

      {existing.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#333333]">
            Tournois démo existants
          </h2>

          {existing.map((t) => (
            <Card
              key={t.id}
              className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#333333]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#333333]/60">
                    {t.playerCount} joueurs · {t.status === "closed" ? "Clôturé" : "En cours"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/app/tournaments/${t.id}`)}
                >
                  <ArrowRight className="size-4" aria-hidden />
                  <span className="ml-1 hidden sm:inline">Ouvrir</span>
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={resetting}
            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {resetting ? (
              <>
                <RotateCcw className="size-4 animate-spin" aria-hidden />
                <span className="ml-1.5">Suppression…</span>
              </>
            ) : (
              <>
                <Trash2 className="size-4" aria-hidden />
                <span className="ml-1.5">Supprimer tous les tournois démo</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
