"use client";

import { useState } from "react";
import {
  updateTournamentNameAction,
  updateTotalRoundsAction,
  updateShareLinkExpiryAction,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Pencil, RotateCcw } from "lucide-react";

function SettingSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <CardContent className="space-y-4 p-4">
        <div>
          <h2 className="text-sm font-semibold text-[#333333]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-[#333333]/60">{description}</p>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function SettingsClient({
  tournamentId,
  userId,
  initialName,
  initialTotalRounds,
  initialShareLinkExpiryDays,
}: {
  tournamentId: string;
  userId: string;
  initialName: string;
  initialTotalRounds: number;
  initialShareLinkExpiryDays: number;
}) {
  const [name, setName] = useState(initialName);
  const [totalRounds, setTotalRounds] = useState(String(initialTotalRounds));
  const [expiryDays, setExpiryDays] = useState(
    String(initialShareLinkExpiryDays)
  );

  const [savingName, setSavingName] = useState(false);
  const [savingRounds, setSavingRounds] = useState(false);
  const [savingExpiry, setSavingExpiry] = useState(false);

  const [successName, setSuccessName] = useState(false);
  const [successRounds, setSuccessRounds] = useState(false);
  const [successExpiry, setSuccessExpiry] = useState(false);

  const [error, setError] = useState<string | null>(null);

  function flashSuccess(setter: (v: boolean) => void) {
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  async function handleSaveName() {
    setError(null);
    setSavingName(true);
    const res = await updateTournamentNameAction({
      tournamentId,
      userId,
      name,
    });
    setSavingName(false);
    if (res.error) setError(res.error);
    else flashSuccess(setSuccessName);
  }

  async function handleSaveRounds() {
    setError(null);
    setSavingRounds(true);
    const res = await updateTotalRoundsAction({
      tournamentId,
      userId,
      totalRounds: parseInt(totalRounds, 10),
    });
    setSavingRounds(false);
    if (res.error) setError(res.error);
    else flashSuccess(setSuccessRounds);
  }

  async function handleSaveExpiry() {
    setError(null);
    setSavingExpiry(true);
    const res = await updateShareLinkExpiryAction({
      tournamentId,
      userId,
      days: parseInt(expiryDays, 10),
    });
    setSavingExpiry(false);
    if (res.error) setError(res.error);
    else flashSuccess(setSuccessExpiry);
  }

  return (
    <div className="space-y-4">
      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <SettingSection
        title="Nom du tournoi"
        description="Visible partout dans l&apos;application."
      >
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleSaveName}
            disabled={savingName || name.trim() === initialName}
          >
            {successName ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <Pencil className="size-4" aria-hidden />
            )}
            <span className="ml-1.5">
              {successName ? "Enregistré" : savingName ? "…" : "Renommer"}
            </span>
          </Button>
        </div>
      </SettingSection>

      <SettingSection
        title="Nombre de tours"
        description="Définit le nombre total de tours du tournoi (1 à 20)."
      >
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="totalRounds">Tours</Label>
            <Input
              id="totalRounds"
              type="number"
              min={1}
              max={20}
              value={totalRounds}
              onChange={(e) => setTotalRounds(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            onClick={handleSaveRounds}
            disabled={
              savingRounds ||
              parseInt(totalRounds, 10) === initialTotalRounds
            }
          >
            {successRounds ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <RotateCcw className="size-4" aria-hidden />
            )}
            <span className="ml-1.5">
              {successRounds
                ? "Enregistré"
                : savingRounds
                  ? "…"
                  : "Appliquer"}
            </span>
          </Button>
        </div>
      </SettingSection>

      <SettingSection
        title="Durée du lien de partage"
        description="Expiration des liens lecture seule (1 à 90 jours)."
      >
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="expiryDays">Jours</Label>
            <Input
              id="expiryDays"
              type="number"
              min={1}
              max={90}
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            onClick={handleSaveExpiry}
            disabled={
              savingExpiry ||
              parseInt(expiryDays, 10) === initialShareLinkExpiryDays
            }
          >
            {successExpiry ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <RotateCcw className="size-4" aria-hidden />
            )}
            <span className="ml-1.5">
              {successExpiry
                ? "Enregistré"
                : savingExpiry
                  ? "…"
                  : "Appliquer"}
            </span>
          </Button>
        </div>
      </SettingSection>
    </div>
  );
}
