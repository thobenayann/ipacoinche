import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SetupTournamentClient } from "./SetupTournamentClient";

export default async function TournamentSetupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const tournament = await prisma.tournament.findFirst({
    where: { id: tournamentId, userId: session.user.id },
    include: {
      players: {
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true },
      },
    },
  });
  if (!tournament) notFound();

  return (
    <SetupTournamentClient
      tournamentId={tournament.id}
      tournamentName={tournament.name}
      players={tournament.players}
      status={tournament.status}
      userId={session.user.id}
    />
  );
}
