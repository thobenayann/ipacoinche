import Image from "next/image";
import Link from "next/link";
import { Trophy, LayoutGrid, BookOpen } from "lucide-react";
import { resolveShareToken } from "@/lib/share";
import { notFound } from "next/navigation";

export default async function ReadonlyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await resolveShareToken(token);

  if (!result) notFound();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Branded header */}
      <header className="border-b border-[var(--accent)]/15 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-2.5">
          <Image
            src="/logo/logo-ipanova.svg"
            alt="IPANOVA"
            width={80}
            height={26}
            className="h-6 w-auto"
          />
          <div className="h-4 w-px bg-[#333333]/15" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#333333]">
              {result.tournamentName}
            </p>
            <p className="text-[10px] font-medium tracking-wide text-[var(--accent)]">
              IPACOINCHE
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto min-w-[360px] max-w-lg pb-20">{children}</div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#333333]/10 bg-white/95 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] backdrop-blur-md"
        aria-label="Navigation"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around">
          <Link
            href={`/t/${token}/leaderboard`}
            className="flex min-h-[44px] min-w-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 text-[#333333]/60 transition-colors hover:text-[var(--accent)]"
          >
            <Trophy className="size-5" />
            <span className="text-[10px] font-medium">Classement</span>
          </Link>
          <Link
            href={`/t/${token}/rounds/0`}
            className="flex min-h-[44px] min-w-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 text-[#333333]/60 transition-colors hover:text-[var(--accent)]"
          >
            <LayoutGrid className="size-5" />
            <span className="text-[10px] font-medium">Tours</span>
          </Link>
          <Link
            href={`/t/${token}/rules`}
            className="flex min-h-[44px] min-w-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 text-[#333333]/60 transition-colors hover:text-[var(--accent)]"
          >
            <BookOpen className="size-5" />
            <span className="text-[10px] font-medium">Règles</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
