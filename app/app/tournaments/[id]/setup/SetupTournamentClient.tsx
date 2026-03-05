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
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, UserPlus, Users } from "lucide-react";

type PlayerItem = { id: string; name: string };

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

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
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title={tournamentName}
          subtitle={`Configuration des joueurs · ${count} joueur${count !== 1 ? "s" : ""}`}
          backHref={`/app/tournaments/${tournamentId}`}
          backLabel="Retour"
          action={
            <Badge variant={isDraft ? "secondary" : "default"}>
              {isDraft ? "Brouillon" : "En cours"}
            </Badge>
          }
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {isDraft && (
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom du joueur"
              autoComplete="off"
              className="flex-1"
            />
            <Button type="submit" disabled={adding}>
              <UserPlus className="size-5" aria-hidden />
              <span className="ml-1.5">{adding ? "Ajout…" : "Ajouter"}</span>
            </Button>
          </form>
        )}

        {count > 0 && count < MIN_PLAYERS && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Il faut au moins {MIN_PLAYERS} joueurs pour démarrer le tournoi.
          </div>
        )}
        {nonMultipleOf4 && (
          <div className="rounded-xl border border-[#333333]/10 bg-[#333333]/5 p-3 text-sm text-[#333333]/70">
            Ce nombre de joueurs n&apos;est pas un multiple de 4 : certains seront en pause à chaque tour.
          </div>
        )}

        {players.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aucun joueur"
            description={`Ajoutez au moins ${MIN_PLAYERS} joueurs pour démarrer le tournoi.`}
          />
        ) : (
          <ul className="space-y-2">
            {players.map((p) => (
              <li key={p.id}>
                <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <CardContent className="flex min-h-[52px] items-center gap-3 p-3 pl-4">
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
                          OK
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
                          ✕
                        </Button>
                      </form>
                    ) : (
                      <>
                        <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs font-semibold text-[var(--accent)]">
                          {getInitials(p.name)}
                        </div>
                        <span className="flex-1 truncate font-medium text-[#333333]">
                          {p.name}
                        </span>
                        {isDraft && (
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => beginEdit(p)}
                              aria-label="Modifier"
                              className="size-8"
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
                              className="size-8 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}

        {status === "started" && (
          <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 text-center">
            <p className="text-sm text-[#333333]/70">
              Le tournoi a démarré.{" "}
              <Link
                href={`/app/tournaments/${tournamentId}/rounds/0`}
                className="cursor-pointer font-medium text-[var(--accent)] hover:underline"
              >
                Voir les tours →
              </Link>
            </p>
          </div>
        )}
      </div>

      {isDraft && (
        <div className="fixed inset-x-0 bottom-0 border-t border-[#333333]/10 bg-white/80 px-4 py-3 backdrop-blur-lg">
          <div className="mx-auto max-w-lg">
            <Button
              onClick={handleStart}
              disabled={!canStart || starting}
              className="w-full"
              size="lg"
            >
              {starting ? "Démarrage…" : `Démarrer le tournoi (${count} joueurs)`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
