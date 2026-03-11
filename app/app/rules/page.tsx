import { PageHeader } from "@/components/ui/page-header";
import { RulesContent } from "@/components/rules/RulesContent";

export default function RulesPage() {
  return (
    <div className="min-w-[360px] px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <PageHeader
          title="Règlement"
          subtitle="Comment fonctionne le classement"
          backHref="/app"
          backLabel="Accueil"
        />
        <RulesContent />
      </div>
    </div>
  );
}
