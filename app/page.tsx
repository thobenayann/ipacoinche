import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen min-w-[360px] flex-col items-center justify-center overflow-hidden bg-[var(--background)]">
      {/* Animated background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -left-20 -top-20 size-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="animate-float-medium absolute -right-16 top-1/3 size-64 rounded-full bg-[var(--accent)]/8 blur-3xl" />
        <div className="animate-float-fast absolute -bottom-10 left-1/4 size-56 rounded-full bg-[var(--accent)]/6 blur-3xl" />

        {/* Card suit decorations */}
        <span className="animate-drift-1 absolute left-[10%] top-[15%] text-6xl text-[var(--accent)]/10 select-none">
          ♠
        </span>
        <span className="animate-drift-2 absolute right-[12%] top-[25%] text-5xl text-[var(--accent)]/8 select-none">
          ♥
        </span>
        <span className="animate-drift-3 absolute bottom-[20%] left-[20%] text-7xl text-[var(--accent)]/6 select-none">
          ♦
        </span>
        <span className="animate-drift-4 absolute bottom-[30%] right-[15%] text-5xl text-[var(--accent)]/10 select-none">
          ♣
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-12">
        {/* Logo entrance */}
        <div className="animate-fade-in-up">
          <Image
            src="/logo/logo-ipanova.svg"
            alt="IPANOVA"
            width={160}
            height={52}
            className="h-13 w-auto drop-shadow-sm"
            priority
          />
        </div>

        {/* App name with staggered animation */}
        <div className="animate-fade-in-up-delay-1 flex flex-col items-center gap-2">
          <h1 className="bg-gradient-to-r from-[var(--accent)] to-[#3a9aa8] bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Ipacoinche
          </h1>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[var(--accent)] to-[#3a9aa8]" />
        </div>

        {/* Tagline */}
        <p className="animate-fade-in-up-delay-2 max-w-xs text-center text-base leading-relaxed text-[#333333]/70">
          Gérez vos tournois de coinche en toute simplicité.
          Scores, classements et partage en temps réel.
        </p>

        {/* Card suits row */}
        <div className="animate-fade-in-up-delay-2 flex items-center gap-4 text-2xl">
          <span className="animate-pulse-slow text-[var(--accent)]/40">♠</span>
          <span className="animate-pulse-slow text-red-400/40" style={{ animationDelay: "0.3s" }}>♥</span>
          <span className="animate-pulse-slow text-[var(--accent)]/40" style={{ animationDelay: "0.6s" }}>♦</span>
          <span className="animate-pulse-slow text-red-400/40" style={{ animationDelay: "0.9s" }}>♣</span>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up-delay-3 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/app"
            className="group flex min-h-[52px] items-center gap-2 rounded-2xl bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_20px_rgba(81,189,203,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(81,189,203,0.45)] active:scale-[0.98]"
          >
            Commencer
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/auth/login"
            className="flex min-h-[44px] items-center rounded-2xl border border-[#333333]/15 bg-white/70 px-6 py-2.5 text-sm font-medium text-[#333333]/80 backdrop-blur-sm transition-all duration-200 hover:border-[var(--accent)]/30 hover:bg-white hover:text-[var(--accent)] active:scale-[0.97]"
          >
            Se connecter
          </Link>
        </div>

        {/* Footer */}
        <p className="animate-fade-in-up-delay-4 mt-4 text-xs text-[#333333]/40">
          par IPANOVA
        </p>
      </div>
    </div>
  );
}
