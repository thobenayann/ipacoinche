import { Clock, LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ShareNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
            <Clock className="size-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-[#333333]">
              Lien indisponible
            </h1>
            <p className="text-sm text-[#333333]/60">
              Ce lien de partage a expiré ou a été désactivé par
              l&apos;organisateur du tournoi.
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#333333]/5 px-4 py-2 text-xs text-[#333333]/50">
            <LinkIcon className="size-3.5" />
            Demandez un nouveau lien à l&apos;organisateur
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
