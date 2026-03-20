"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteTableAction,
  unlockTableAction,
  updateTableAction,
  validateTableAction,
} from "./actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, LockOpen, Trash2 } from "lucide-react";

type PlayerOption = { id: string; name: string };

export function TableEditorClient({
  tournamentId,
  roundIndex,
  tableId,
  playerA1Id,
  playerA2Id,
  playerB1Id,
  playerB2Id,
  scoreTeamA,
  scoreTeamB,
  status,
  availablePlayers,
  userId,
}: {
  tournamentId: string;
  roundIndex: number;
  tableId: string;
  playerA1Id: string | null;
  playerA2Id: string | null;
  playerB1Id: string | null;
  playerB2Id: string | null;
  scoreTeamA: number | null;
  scoreTeamB: number | null;
  status: string;
  availablePlayers: PlayerOption[];
  userId: string;
}) {
  const router = useRouter();
  const [a1, setA1] = useState(playerA1Id ?? "");
  const [a2, setA2] = useState(playerA2Id ?? "");
  const [b1, setB1] = useState(playerB1Id ?? "");
  const [b2, setB2] = useState(playerB2Id ?? "");
  const [scoreA, setScoreA] = useState(
    scoreTeamA !== null && scoreTeamA !== undefined ? String(scoreTeamA) : ""
  );
  const [scoreB, setScoreB] = useState(
    scoreTeamB !== null && scoreTeamB !== undefined ? String(scoreTeamB) : ""
  );
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empty = "";
  const options = [
    { value: empty, label: "—" },
    ...availablePlayers.map((p) => ({ value: p.id, label: p.name })),
  ];

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const result = await updateTableAction({
      tableId,
      userId,
      playerA1Id: a1 || null,
      playerA2Id: a2 || null,
      playerB1Id: b1 || null,
      playerB2Id: b2 || null,
      scoreTeamA: scoreA === "" ? null : parseInt(scoreA, 10) ?? null,
      scoreTeamB: scoreB === "" ? null : parseInt(scoreB, 10) ?? null,
    });
    setSaving(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  async function handleValidate() {
    setError(null);
    setValidating(true);
    const updateResult = await updateTableAction({
      tableId,
      userId,
      playerA1Id: a1 || null,
      playerA2Id: a2 || null,
      playerB1Id: b1 || null,
      playerB2Id: b2 || null,
      scoreTeamA: scoreA === "" ? null : parseInt(scoreA, 10) ?? null,
      scoreTeamB: scoreB === "" ? null : parseInt(scoreB, 10) ?? null,
    });
    if (updateResult.error) {
      setError(updateResult.error);
      setValidating(false);
      return;
    }
    const result = await validateTableAction({ tableId, userId });
    setValidating(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  async function handleUnlock() {
    setError(null);
    setUnlocking(true);
    const result = await unlockTableAction({ tableId, userId });
    setUnlocking(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  async function handleConfirmDelete() {
    setError(null);
    setDeleting(true);
    const result = await deleteTableAction({ tableId, userId });
    setDeleting(false);
    if (result.error) {
      setError(result.error);
      setDeleteOpen(false);
      return;
    }
    setDeleteOpen(false);
    router.push(`/app/tournaments/${tournamentId}/rounds/${roundIndex}`);
    router.refresh();
  }

  const isDraft = status === "draft";
  const isReadOnly = status === "validated";

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg">
        <Link
          href={`/app/tournaments/${tournamentId}/rounds/${roundIndex}`}
          className="group mb-6 inline-flex min-h-[36px] cursor-pointer items-center gap-1 rounded-full border border-[#333333]/10 bg-white pl-2 pr-4 text-sm font-medium text-[#333333]/70 shadow-sm transition-all duration-200 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 hover:text-[var(--accent)] active:scale-[0.96]"
        >
          <ChevronLeft className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
          Tour {roundIndex + 1}
        </Link>

        <h1 className="text-2xl font-semibold text-[#333333]">
          Éditeur de table
        </h1>
        <p className="mt-1 text-sm text-[#333333]/60">
          Tour {roundIndex + 1} — 2 équipes de 2 joueurs
        </p>

        {error && (
          <p
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <div className="rounded-xl border border-[#333333]/10 bg-white p-4">
            <h2 className="text-sm font-medium text-[#333333]/70">
              Équipe A
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="a1">Joueur 1</Label>
                <select
                  id="a1"
                  value={a1}
                  onChange={(e) => setA1(e.target.value)}
                  disabled={isReadOnly}
                  className="flex min-h-[44px] w-full rounded-lg border border-[#333333]/20 bg-white px-3 py-2 text-[#333333] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {options.map((o) => (
                    <option key={o.value || "empty"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="a2">Joueur 2</Label>
                <select
                  id="a2"
                  value={a2}
                  onChange={(e) => setA2(e.target.value)}
                  disabled={isReadOnly}
                  className="flex min-h-[44px] w-full rounded-lg border border-[#333333]/20 bg-white px-3 py-2 text-[#333333] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {options.map((o) => (
                    <option key={o.value || "empty"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#333333]/10 bg-white p-4">
            <h2 className="text-sm font-medium text-[#333333]/70">
              Équipe B
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="b1">Joueur 1</Label>
                <select
                  id="b1"
                  value={b1}
                  onChange={(e) => setB1(e.target.value)}
                  disabled={isReadOnly}
                  className="flex min-h-[44px] w-full rounded-lg border border-[#333333]/20 bg-white px-3 py-2 text-[#333333] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {options.map((o) => (
                    <option key={o.value || "empty"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="b2">Joueur 2</Label>
                <select
                  id="b2"
                  value={b2}
                  onChange={(e) => setB2(e.target.value)}
                  disabled={isReadOnly}
                  className="flex min-h-[44px] w-full rounded-lg border border-[#333333]/20 bg-white px-3 py-2 text-[#333333] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {options.map((o) => (
                    <option key={o.value || "empty"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scoreA">Score équipe A</Label>
              <Input
                id="scoreA"
                type="number"
                min={0}
                value={scoreA}
                onChange={(e) => setScoreA(e.target.value)}
                placeholder="0"
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scoreB">Score équipe B</Label>
              <Input
                id="scoreB"
                type="number"
                min={0}
                value={scoreB}
                onChange={(e) => setScoreB(e.target.value)}
                placeholder="0"
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving || isReadOnly}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
            {isDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={handleValidate}
                disabled={validating}
              >
                {validating ? "Validation…" : "Valider la table"}
              </Button>
            )}
            {isReadOnly && (
              <Button
                type="button"
                variant="outline"
                onClick={handleUnlock}
                disabled={unlocking}
              >
                <LockOpen className="size-4" aria-hidden />
                <span className="ml-1">
                  {unlocking ? "Déverrouillage…" : "Déverrouiller pour modifier"}
                </span>
              </Button>
            )}
          </div>
        </form>

        {status === "validated" && (
          <p className="mt-4 text-sm text-green-700">
            Cette table est validée. Déverrouillez-la pour modifier puis
            revalider.
          </p>
        )}

        <div className="mt-10 rounded-xl border border-red-200/80 bg-red-50/50 p-4">
          <h2 className="text-sm font-semibold text-red-900">Zone sensible</h2>
          <p className="mt-1 text-xs leading-relaxed text-red-900/80">
            Supprime définitivement cette table du tour (affectations, scores et
            validation). Utile si la table a été ajoutée par erreur.
          </p>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="mt-3"
            onClick={() => {
              setError(null);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="size-4" aria-hidden />
            <span className="ml-1.5">Supprimer la table</span>
          </Button>
        </div>

        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Supprimer cette table ?"
          description={
            <>
              <p>
                Cette action est <strong>irréversible</strong>. Seront
                définitivement perdus&nbsp;: les joueurs assignés, les scores,
                et le statut de validation de cette table.
              </p>
              {status === "validated" && (
                <p className="mt-2">
                  Comme la table est validée, le <strong>classement</strong> du
                  tournoi sera recalculé sans ces résultats.
                </p>
              )}
            </>
          }
          confirmLabel="Supprimer définitivement"
          onConfirm={handleConfirmDelete}
          loading={deleting}
        />
      </div>
    </div>
  );
}
