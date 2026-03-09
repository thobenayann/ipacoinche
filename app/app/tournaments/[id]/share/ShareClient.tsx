"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  createShareLinkAction,
  toggleShareLinkAction,
  regenerateShareLinkAction,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Link2,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  QrCode,
} from "lucide-react";

type ShareLinkItem = {
  id: string;
  token: string;
  active: boolean;
  expiresAt: string;
};

export function ShareClient({
  tournamentId,
  userId,
  links,
  baseUrl,
}: {
  tournamentId: string;
  userId: string;
  links: ShareLinkItem[];
  baseUrl: string;
}) {
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasActive = links.some((l) => l.active);

  async function handleCreate() {
    setError(null);
    setCreating(true);
    const res = await createShareLinkAction({ tournamentId, userId });
    setCreating(false);
    if (res.error) setError(res.error);
  }

  async function handleToggle(linkId: string, active: boolean) {
    setError(null);
    setTogglingId(linkId);
    const res = await toggleShareLinkAction({ linkId, active, userId });
    setTogglingId(null);
    if (res.error) setError(res.error);
  }

  async function handleRegenerate(linkId: string) {
    setError(null);
    setRegeneratingId(linkId);
    const res = await regenerateShareLinkAction({ linkId, userId });
    setRegeneratingId(null);
    if (res.error) setError(res.error);
  }

  function handleCopy(token: string, linkId: string) {
    const url = `${baseUrl}/t/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function getShareUrl(token: string) {
    return `${baseUrl}/t/${token}`;
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

      {links.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-[var(--accent)]/10">
              <Link2 className="size-7 text-[var(--accent)]" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-[#333333]">
                Aucun lien de partage
              </p>
              <p className="text-sm text-[#333333]/60">
                Générez un lien pour permettre aux joueurs de suivre le tournoi.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {links.map((link) => {
        const expired = new Date(link.expiresAt) < new Date();
        const isActive = link.active && !expired;

        return (
          <Card
            key={link.id}
            className={`shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${!isActive ? "opacity-70" : ""}`}
          >
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="size-4 text-[var(--accent)]" />
                  <span className="text-sm font-medium text-[#333333]">
                    Lien de partage
                  </span>
                </div>
                <Badge
                  variant={
                    expired ? "destructive" : isActive ? "default" : "secondary"
                  }
                >
                  {expired ? "Expiré" : isActive ? "Actif" : "Désactivé"}
                </Badge>
              </div>

              <div className="rounded-lg bg-[#333333]/5 p-3">
                <p className="truncate font-mono text-xs text-[#333333]/70">
                  {getShareUrl(link.token)}
                </p>
              </div>

              <p className="text-xs text-[#333333]/50">
                Expire le{" "}
                {new Date(link.expiresAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {showQr === link.id && (
                <div className="flex justify-center rounded-xl bg-white p-5 shadow-inner">
                  <QRCodeSVG
                    value={getShareUrl(link.token)}
                    size={200}
                    level="M"
                    fgColor="#333333"
                    bgColor="#ffffff"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(link.token, link.id)}
                  disabled={!isActive}
                >
                  {copiedId === link.id ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    <Copy className="size-4" aria-hidden />
                  )}
                  <span className="ml-1.5">
                    {copiedId === link.id ? "Copié" : "Copier"}
                  </span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setShowQr(showQr === link.id ? null : link.id)
                  }
                >
                  <QrCode className="size-4" aria-hidden />
                  <span className="ml-1.5">QR</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleToggle(link.id, !link.active)
                  }
                  disabled={togglingId === link.id}
                >
                  {link.active ? (
                    <ToggleRight className="size-4" aria-hidden />
                  ) : (
                    <ToggleLeft className="size-4" aria-hidden />
                  )}
                  <span className="ml-1.5">
                    {link.active ? "Désactiver" : "Activer"}
                  </span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRegenerate(link.id)}
                  disabled={regeneratingId === link.id}
                >
                  <RefreshCw
                    className={`size-4 ${regeneratingId === link.id ? "animate-spin" : ""}`}
                    aria-hidden
                  />
                  <span className="ml-1.5">Régénérer</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {!hasActive && (
        <Button onClick={handleCreate} disabled={creating} className="w-full">
          <Link2 className="size-5" aria-hidden />
          <span className="ml-1.5">
            {creating ? "Création…" : "Générer un lien de partage"}
          </span>
        </Button>
      )}
    </div>
  );
}
