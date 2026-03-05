"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTableAction, applyGabaritAction } from "./actions";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Plus } from "lucide-react";

export function RoundActions({
  tournamentId,
  roundIndex,
  userId,
}: {
  tournamentId: string;
  roundIndex: number;
  userId: string;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddTable() {
    setError(null);
    setAdding(true);
    const result = await addTableAction({
      tournamentId,
      roundIndex,
      userId,
    });
    setAdding(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  async function handleGabarit() {
    setError(null);
    setApplying(true);
    const result = await applyGabaritAction({
      tournamentId,
      roundIndex,
      userId,
    });
    setApplying(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="space-y-3">
      {error && (
        <p
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={handleAddTable}
          disabled={adding}
          variant="outline"
        >
          <Plus className="size-5" aria-hidden />
          <span className="ml-1.5">{adding ? "Ajout…" : "Ajouter une table"}</span>
        </Button>
        <Button
          type="button"
          onClick={handleGabarit}
          disabled={applying}
          variant="outline"
        >
          <LayoutGrid className="size-5" aria-hidden />
          <span className="ml-1.5">
            {applying ? "Application…" : "Gabarit auto"}
          </span>
        </Button>
      </div>
    </div>
  );
}
