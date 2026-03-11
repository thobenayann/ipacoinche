import { notFound } from "next/navigation";
import { resolveShareToken } from "@/lib/share";
import { PageHeader } from "@/components/ui/page-header";
import { RulesContent } from "@/components/rules/RulesContent";

export default async function SharedRulesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await resolveShareToken(token);
  if (!share) notFound();

  return (
    <div className="min-w-[360px] px-4 py-6 pb-24">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title="Règlement"
          subtitle={share.tournamentName}
          backHref={`/t/${token}/leaderboard`}
          backLabel="Classement"
        />
        <RulesContent />
      </div>
    </div>
  );
}
