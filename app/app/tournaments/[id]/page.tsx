import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LayoutGrid, Settings, Users, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    include: { _count: { select: { players: true } } },
  });
  if (!tournament) notFound();

  const dateStr = tournament.date
    ? new Date(tournament.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const subtitle = [
    dateStr,
    `${tournament._count.players} joueur${tournament._count.players !== 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(" · ");

  type NavItem = {
    href: string;
    icon: typeof Users;
    label: string;
    hint: string;
    show: boolean;
  };
  const navItems: NavItem[] = [
    {
      href: `/app/tournaments/${id}/setup`,
      icon: Users,
      label: "Joueurs",
      hint: "Configuration",
      show: true,
    },
    {
      href: `/app/tournaments/${id}/rounds/0`,
      icon: LayoutGrid,
      label: "Tours",
      hint: "Tables par tour",
      show: tournament.status === "started",
    },
    {
      href: `/app/tournaments/${id}/settings`,
      icon: Settings,
      label: "Paramètres",
      hint: "",
      show: true,
    },
  ];

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title={tournament.name}
          subtitle={subtitle}
          backHref="/app"
          backLabel="Retour aux tournois"
          action={
            <Badge
              variant={
                tournament.status === "started" ? "default" : "secondary"
              }
            >
              {tournament.status === "started" ? "En cours" : "Brouillon"}
            </Badge>
          }
        />

        <nav
          className="flex flex-col gap-3"
          aria-label="Actions tournoi"
        >
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block cursor-pointer transition-all duration-200 active:scale-[0.985]"
              >
                <Card className="shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
                  <CardContent className="flex min-h-[56px] items-center gap-4 p-4">
                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10">
                      <item.icon className="size-5 text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#333333]">
                        {item.label}
                      </p>
                      {item.hint && (
                        <p className="text-xs text-[#333333]/60">
                          {item.hint}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="size-5 text-[#333333]/30" />
                  </CardContent>
                </Card>
              </Link>
            ))}
        </nav>
      </div>
    </div>
  );
}
