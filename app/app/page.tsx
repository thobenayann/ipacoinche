import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";

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
  });

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#333333]">Mes tournois</h1>
          <Link
            href="/app/tournaments/new"
            className="cursor-pointer flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-white shadow-sm transition-all duration-200 hover:brightness-110 hover:shadow-md active:scale-[0.98]"
            aria-label="Nouveau tournoi"
          >
            <Plus className="size-5" />
            <span className="hidden sm:inline">Nouveau</span>
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <div className="rounded-xl border border-[#333333]/10 bg-white p-8 text-center">
            <p className="text-[#333333]/70">Aucun tournoi pour l’instant.</p>
            <Link
              href="/app/tournaments/new"
              className="mt-4 inline-block cursor-pointer min-h-[44px] rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110 hover:shadow-md active:scale-[0.98]"
            >
              Créer un tournoi
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {tournaments.map((t: (typeof tournaments)[number]) => (
              <li key={t.id}>
                <Link
                  href={`/app/tournaments/${t.id}`}
                  className="block cursor-pointer rounded-xl border border-[#333333]/10 bg-white p-4 shadow-sm transition-all duration-200 hover:border-[var(--accent)]/30 hover:shadow-md"
                >
                  <span className="font-medium text-[#333333]">{t.name}</span>
                  {t.date && (
                    <span className="ml-2 text-sm text-[#333333]/60">
                      — {new Date(t.date).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
