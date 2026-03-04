import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ArrowLeft, Settings, Users } from "lucide-react";

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const tournament = await prisma.tournament.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!tournament) notFound();

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg">
        <Link
          href="/app"
          className="mb-6 inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-[#333333]/70 transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft className="size-5" />
          Retour aux tournois
        </Link>

        <h1 className="text-2xl font-semibold text-[#333333]">
          {tournament.name}
        </h1>
        {tournament.date && (
          <p className="mt-1 text-[#333333]/60">
            {new Date(tournament.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        <nav className="mt-8 flex flex-col gap-3" aria-label="Actions tournoi">
          <Link
            href={`/app/tournaments/${id}/setup`}
            className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-[#333333]/10 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-[var(--accent)]/30 hover:shadow-md"
          >
            <Users className="size-5 text-[var(--accent)]" />
            <span className="font-medium text-[#333333]">Joueurs</span>
            <span className="ml-auto text-sm text-[#333333]/60">Configuration</span>
          </Link>
          <Link
            href={`/app/tournaments/${id}/settings`}
            className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-[#333333]/10 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-[var(--accent)]/30 hover:shadow-md"
          >
            <Settings className="size-5 text-[#333333]/60" />
            <span className="font-medium text-[#333333]">Paramètres</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
