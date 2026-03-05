"use client";

import { useState } from "react";
import Link from "next/link";
import {
  createPlayerAction,
  updatePlayerAction,
  deletePlayerAction,
  startTournamentAction,
} from "./actions";
import { MIN_PLAYERS } from "@/lib/tournament-constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Pencil, Trash2, UserPlus } from "lucide-react";

type PlayerItem = { id: string; name: string };

export function SetupTournamentClient({
  tournamentId,
  tournamentName,
  players,
  status,
  userId,
}: {
  tournamentId: string;
  tournamentName: string;
  players: PlayerItem[];
  status: string;
  userId: string;
}) {
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDraft = status === "draft";
  const count = players.length;
  const canStart = isDraft && count >= MIN_PLAYERS;
  const nonMultipleOf4 = count > 0 && count % 4 !== 0;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAdding(true);
    const result = await createPlayerAction({
      tournamentId,
      name: newName,
      userId,
    });
    setAdding(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setNewName("");
  }

  async function handleUpdate(e: React.FormEvent, playerId: string) {
    e.preventDefault();
    setError(null);
    const result = await updatePlayerAction({
      playerId,
      name: editingName,
      userId,
    });
    if (result.error) {
      setError(result.error);
      return;
    }
    setEditingId(null);
    setEditingName("");
  }

  async function handleDelete(playerId: string) {
    setError(null);
    setDeletingId(playerId);
    const result = await deletePlayerAction({ playerId, userId });
    setDeletingId(null);
    if (result.error) setError(result.error);
  }

  async function handleStart() {
    setError(null);
    setStarting(true);
    const result = await startTournamentAction({ tournamentId, userId });
    setStarting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    window.location.href = `/app/tournaments/${tournamentId}/rounds/0`;
  }

  function beginEdit(p: PlayerItem) {
    setEditingId(p.id);
    setEditingName(p.name);
    setError(null);
  }

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg">
        <Link
          href={`/app/tournaments/${tournamentId}`}
          className="mb-6 inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-[#333333]/70 transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft className="size-5" />
          Retour
        </Link>

        <h1 className="text-2xl font-semibold text-[#333333]">
          {tournamentName}
        </h1>
        <p className="mt-1 text-sm text-[#333333]/60">Configuration des joueurs</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {isDraft && (
          <form onSubmit={handleAdd} className="mt-6 flex gap-2">
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom du joueur"
              autoComplete="off"
              className="flex-1"
            />
            <Button type="submit" disabled={adding} size="default">
              <UserPlus className="size-5" aria-hidden />
              <span className="ml-1">{adding ? "Ajout…" : "Ajouter"}</span>
            </Button>
          </form>
        )}

        {count < MIN_PLAYERS && count > 0 && (
          <p className="mt-4 text-sm text-amber-700">
            Il faut au moins {MIN_PLAYERS} joueurs pour démarrer le tournoi.
          </p>
        )}
        {nonMultipleOf4 && (
          <p className="mt-2 text-sm text-[#333333]/70">
            Ce nombre de joueurs n’est pas un multiple de 4 : certains seront en pause à chaque tour.
          </p>
        )}

        <ul className="mt-6 space-y-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-[#333333]/10 bg-white px-4 py-2 shadow-sm"
            >
              {editingId === p.id ? (
                <form
                  onSubmit={(e) => handleUpdate(e, p.id)}
                  className="flex flex-1 gap-2"
                >
                  <Input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    Valider
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                  >
                    Annuler
                  </Button>
                </form>
              ) : (
                <>
                  <span className="flex-1 font-medium text-[#333333]">{p.name}</span>
                  {isDraft && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => beginEdit(p)}
                        aria-label="Modifier"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        aria-label="Supprimer"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>

        {players.length === 0 && (
          <p className="mt-6 text-center text-[#333333]/60">
            Aucun joueur. Ajoutez au moins {MIN_PLAYERS} joueurs pour démarrer.
          </p>
        )}

        {isDraft && (
          <div className="mt-8">
            <Button
              onClick={handleStart}
              disabled={!canStart || starting}
              className="w-full"
            >
              {starting ? "Démarrage…" : "Démarrer le tournoi"}
            </Button>
          </div>
        )}

        {status === "started" && (
          <p className="mt-6 text-center text-sm text-[#333333]/70">
            Le tournoi a démarré.{" "}
            <Link
              href={`/app/tournaments/${tournamentId}/rounds/0`}
              className="cursor-pointer font-medium text-[var(--accent)] hover:underline"
            >
              Voir les tours
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
