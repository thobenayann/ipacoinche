import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Retour",
  action,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="space-y-3">
      {backHref && (
        <Link
          href={backHref}
          className="group inline-flex min-h-[36px] cursor-pointer items-center gap-1 rounded-full border border-[#333333]/10 bg-white pl-2 pr-4 text-sm font-medium text-[#333333]/70 shadow-sm transition-all duration-200 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 hover:text-[var(--accent)] active:scale-[0.96]"
        >
          <ChevronLeft
            className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden
          />
          {backLabel}
        </Link>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#333333]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-[#333333]/60">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </header>
  );
}
