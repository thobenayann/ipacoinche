import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { CreateTournamentForm } from "./CreateTournamentForm";

export default async function NewTournamentPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/auth/login");

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg">
        <Link
          href="/app"
          className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-[#333333]/70 transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft className="size-5" />
          Retour
        </Link>
        <h1 className="text-2xl font-semibold text-[#333333]">
          Nouveau tournoi
        </h1>
        <CreateTournamentForm userId={session.user.id} />
      </div>
    </div>
  );
}
