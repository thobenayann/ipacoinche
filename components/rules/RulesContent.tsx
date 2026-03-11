import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy,
  Users,
  Target,
  Calculator,
  ArrowDownUp,
  Equal,
  Medal,
} from "lucide-react";

function RuleSection({
  icon: Icon,
  title,
  children,
  accent = false,
}: {
  icon: typeof Trophy;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card
      className={`shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${accent ? "border-[var(--accent)]/20 bg-[var(--accent)]/5" : ""}`}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-9 flex-shrink-0 items-center justify-center rounded-full ${accent ? "bg-[var(--accent)]/20" : "bg-[var(--accent)]/10"}`}
          >
            <Icon className="size-4.5 text-[var(--accent)]" />
          </div>
          <h2 className="text-sm font-semibold text-[#333333]">{title}</h2>
        </div>
        <div className="space-y-2 pl-12 text-sm leading-relaxed text-[#333333]/75">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
        {n}
      </span>
      <span>{label}</span>
    </div>
  );
}

export function RulesContent() {
  return (
    <div className="space-y-4">
      <RuleSection icon={Users} title="Format du tournoi">
        <p>
          Chaque tournoi se joue en <strong>plusieurs tours</strong> (4 par
          défaut, configurable de 1 à 20).
        </p>
        <p>
          À chaque tour, les joueurs sont répartis en{" "}
          <strong>tables de 4</strong> : 2 équipes de 2 joueurs s&apos;affrontent.
        </p>
        <p>
          Un joueur ne peut être assigné qu&apos;à{" "}
          <strong>une seule table par tour</strong>. Si le nombre de joueurs
          n&apos;est pas un multiple de 4, certains joueurs sont en pause.
        </p>
      </RuleSection>

      <RuleSection icon={Target} title="Scores">
        <p>
          Chaque table produit un score par équipe :{" "}
          <strong>Équipe A</strong> vs <strong>Équipe B</strong>.
        </p>
        <p>
          Les scores sont des entiers positifs ou nuls. Une table doit être{" "}
          <strong>validée</strong> pour compter dans le classement.
        </p>
      </RuleSection>

      <RuleSection icon={Calculator} title="Victoires" accent>
        <p>
          L&apos;équipe avec le score le plus élevé{" "}
          <strong>remporte la table</strong>. Chaque joueur de l&apos;équipe
          gagnante reçoit :
        </p>
        <div className="mt-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-amber-500" />
            <span>
              <strong>1 victoire</strong> en cas de victoire
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Equal className="size-4 text-[var(--accent)]" />
            <span>
              <strong>0.5 victoire</strong> en cas d&apos;égalité
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-4 text-center text-[#333333]/30">—</span>
            <span>
              <strong>0 victoire</strong> en cas de défaite
            </span>
          </div>
        </div>
      </RuleSection>

      <RuleSection icon={ArrowDownUp} title="Goal Average (GA)">
        <p>Le Goal Average d&apos;un joueur se calcule ainsi :</p>
        <div className="my-2 rounded-lg bg-[#333333]/5 px-4 py-3 text-center font-mono text-sm font-semibold text-[#333333]">
          GA = Points marqués − Points encaissés
        </div>
        <p>
          Un GA positif signifie que le joueur a marqué plus de points qu&apos;il
          n&apos;en a concédé. Plus le GA est élevé, mieux c&apos;est.
        </p>
      </RuleSection>

      <RuleSection icon={Medal} title="Classement" accent>
        <p>
          Les joueurs sont classés selon{" "}
          <strong>3 critères successifs</strong> :
        </p>
        <div className="mt-2 space-y-2">
          <OrderBadge n={1} label="Nombre de victoires (décroissant)" />
          <OrderBadge n={2} label="Goal Average (décroissant)" />
          <OrderBadge n={3} label="Points marqués (décroissant)" />
        </div>
        <p className="mt-2 text-xs text-[#333333]/50">
          En cas d&apos;égalité parfaite sur les 3 critères, les joueurs
          partagent le même rang.
        </p>
      </RuleSection>

      <Card className="border-dashed shadow-none">
        <CardContent className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 p-4">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="animate-pulse-slow text-[var(--accent)]/40">♠</span>
            <span
              className="animate-pulse-slow text-red-400/40"
              style={{ animationDelay: "0.3s" }}
            >
              ♥
            </span>
            <span
              className="animate-pulse-slow text-[var(--accent)]/40"
              style={{ animationDelay: "0.6s" }}
            >
              ♦
            </span>
            <span
              className="animate-pulse-slow text-red-400/40"
              style={{ animationDelay: "0.9s" }}
            >
              ♣
            </span>
          </div>
          <span className="text-xs text-[#333333]/40">—</span>
          <span className="text-xs text-[#333333]/40">Ipacoinche par</span>
          <Image
            src="/logo/logo-ipanova.svg"
            alt="IPANOVA"
            width={56}
            height={18}
            className="h-4 w-auto opacity-70"
          />
        </CardContent>
      </Card>
    </div>
  );
}
