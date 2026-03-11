import Image from "next/image";
import Link from "next/link";
import { Home, Gamepad2, BookOpen } from "lucide-react";
import { AppNavClient } from "./AppNavClient";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-w-[360px] flex-col bg-[var(--background)]">
      {/* Branded header */}
      <header className="border-b border-[var(--accent)]/15 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-2.5">
          <Link href="/app" className="flex-shrink-0">
            <Image
              src="/logo/logo-ipanova.svg"
              alt="IPANOVA"
              width={80}
              height={26}
              className="h-6 w-auto"
            />
          </Link>
          <div className="h-4 w-px bg-[#333333]/15" />
          <p className="text-[10px] font-medium tracking-wide text-[var(--accent)]">
            IPACOINCHE
          </p>
        </div>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#333333]/10 bg-white/95 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] backdrop-blur-md"
        aria-label="Navigation principale"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around">
          <Link
            href="/app"
            className="flex min-h-[44px] min-w-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 text-[#333333] transition-colors hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
          >
            <Home className="size-5" aria-hidden />
            <span className="text-xs font-medium">Accueil</span>
          </Link>
          <Link
            href="/app/rules"
            className="flex min-h-[44px] min-w-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 text-[#333333] transition-colors hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
          >
            <BookOpen className="size-5" aria-hidden />
            <span className="text-xs font-medium">Règles</span>
          </Link>
          <Link
            href="/app/demo"
            className="flex min-h-[44px] min-w-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 text-[#333333] transition-colors hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
          >
            <Gamepad2 className="size-5" aria-hidden />
            <span className="text-xs font-medium">Démo</span>
          </Link>
          <AppNavClient />
        </div>
      </nav>
    </div>
  );
}
