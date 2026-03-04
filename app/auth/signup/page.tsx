"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await authClient.signUp.email(
      { name: name || email, email, password, callbackURL: "/app" },
      {
        fetchOptions: {
          onSuccess: () => router.push("/app"),
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? "Erreur lors de l'inscription");
          setLoading(false);
        },
      }
    );
    if (err) setLoading(false);
  };

  return (
    <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold text-[#333333]">Inscription</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-6 w-full max-w-sm space-y-4"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#333333]">
            Nom (optionnel)
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-[#333333]/20 bg-white px-3 py-2 text-[#333333] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#333333]">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 min-h-[44px] w-full rounded-lg border border-[#333333]/20 bg-white px-3 py-2 text-[#333333] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#333333]">
            Mot de passe (min. 8 caractères)
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 min-h-[44px] w-full rounded-lg border border-[#333333]/20 bg-white px-3 py-2 text-[#333333] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="min-h-[44px] w-full rounded-xl bg-[var(--accent)] font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Inscription…" : "Créer un compte"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[#333333]/70">
        <Link href="/auth/login" className="text-[var(--accent)] hover:underline">
          Déjà un compte ? Se connecter
        </Link>
      </p>
    </div>
  );
}
