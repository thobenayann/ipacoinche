import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center gap-6 bg-[var(--background)] px-6">
      <h1 className="text-2xl font-semibold text-[#333333]">
        Tournoi de Coinche
      </h1>
      <p className="text-center text-[#333333]/80">
        Application de gestion de tournois. Accédez à l’espace admin pour
        commencer.
      </p>
      <Link
        href="/app"
        className="min-h-[44px] rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white shadow-sm transition-opacity hover:opacity-90"
      >
        Aller à l’espace admin
      </Link>
    </div>
  );
}
