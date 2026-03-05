"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTournamentAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateTournamentForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const nameValue = formData.get("name");
    const name = typeof nameValue === "string" ? nameValue.trim() : "";
    const dateValue = formData.get("date");
    const dateStr = typeof dateValue === "string" ? dateValue : null;
    const result = await createTournamentAction({
      name: name || "",
      date: dateStr,
      userId,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.id) router.push(`/app/tournaments/${result.id}`);
  }

  return (
    <form action={handleSubmit} className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du tournoi</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="off"
          placeholder="Ex. Soirée Coinche Mars 2025"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date (optionnel)</Label>
        <Input id="date" name="date" type="date" />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Création…" : "Créer le tournoi"}
      </Button>
    </form>
  );
}
