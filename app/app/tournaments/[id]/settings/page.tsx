import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { SettingsClient } from "./SettingsClient";

export default async function TournamentSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId, userId: session.user.id },
    select: {
      id: true,
      name: true,
      totalRounds: true,
      shareLinkExpiryDays: true,
    },
  });
  if (!tournament) notFound();

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title="Paramètres"
          subtitle={tournament.name}
          backHref={`/app/tournaments/${tournamentId}`}
          backLabel="Tournoi"
        />
        <SettingsClient
          tournamentId={tournamentId}
          userId={session.user.id}
          initialName={tournament.name}
          initialTotalRounds={tournament.totalRounds}
          initialShareLinkExpiryDays={tournament.shareLinkExpiryDays}
        />
      </div>
    </div>
  );
}
