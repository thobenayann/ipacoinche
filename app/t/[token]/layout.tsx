import Link from "next/link";
import { Trophy, LayoutGrid } from "lucide-react";
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
      <div className="mx-auto min-w-[360px] max-w-lg">{children}</div>

      <nav className="fixed inset-x-0 bottom-0 border-t border-[#333333]/10 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          <Link
            href={`/t/${token}/leaderboard`}
            className="flex min-h-[44px] cursor-pointer flex-col items-center justify-center gap-0.5 px-4 text-[#333333]/60 transition-colors hover:text-[var(--accent)]"
          >
            <Trophy className="size-5" />
            <span className="text-[10px] font-medium">Classement</span>
          </Link>
          <Link
            href={`/t/${token}/rounds/0`}
            className="flex min-h-[44px] cursor-pointer flex-col items-center justify-center gap-0.5 px-4 text-[#333333]/60 transition-colors hover:text-[var(--accent)]"
          >
            <LayoutGrid className="size-5" />
            <span className="text-[10px] font-medium">Tours</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
