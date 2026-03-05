import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { DemoClient } from "./DemoClient";

const DEMO_TOURNAMENT_NAME = "Tournoi Démo";

export default async function DemoPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const existing = await prisma.tournament.findMany({
    where: { userId: session.user.id, name: DEMO_TOURNAMENT_NAME },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      _count: { select: { players: true } },
    },
  });

  const mapped = existing.map((t) => ({
    id: t.id,
    name: t.name,
    status: t.status,
    playerCount: t._count.players,
  }));

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title="Mode démo"
          subtitle="Testez l'application avec des données fictives"
          backHref="/app"
          backLabel="Accueil"
        />

        <DemoClient userId={session.user.id} existing={mapped} />
      </div>
    </div>
  );
}
