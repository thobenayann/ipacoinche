import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { CreateTournamentForm } from "./CreateTournamentForm";

export default async function NewTournamentPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/auth/login");

  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title="Nouveau tournoi"
          backHref="/app"
          backLabel="Retour"
        />
        <CreateTournamentForm userId={session.user.id} />
      </div>
    </div>
  );
}
