import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Plus, Trophy } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AppHomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return (
      <div className="flex min-h-[60vh] min-w-[360px] flex-col items-center justify-center gap-4 px-6">
        <p className="text-[#333333]/70">Non connecté.</p>
      </div>
    );
  }

  const tournaments = await prisma.tournament.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { players: true } } },
  });

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title="Mes tournois"
          subtitle={
            tournaments.length > 0
              ? `${tournaments.length} tournoi${tournaments.length > 1 ? "s" : ""}`
              : undefined
          }
          action={
            <Link href="/app/tournaments/new">
              <Button size="default">
                <Plus className="size-5" aria-hidden />
                <span className="ml-1.5 hidden sm:inline">Nouveau</span>
              </Button>
            </Link>
          }
        />

        {tournaments.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="Aucun tournoi"
            description="Créez votre premier tournoi de coinche pour commencer."
            action={
              <Link href="/app/tournaments/new">
                <Button>Créer un tournoi</Button>
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {tournaments.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/app/tournaments/${t.id}`}
                  className="block cursor-pointer transition-all duration-200 active:scale-[0.985]"
                >
                  <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10">
                        <Trophy className="size-5 text-[var(--accent)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[#333333]">
                          {t.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#333333]/60">
                          {t._count.players} joueur
                          {t._count.players !== 1 ? "s" : ""}
                          {t.date &&
                            ` · ${new Date(t.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          t.status === "started" ? "default" : "secondary"
                        }
                      >
                        {t.status === "started" ? "En cours" : "Brouillon"}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
