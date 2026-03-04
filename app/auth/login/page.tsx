"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await authClient.signIn.email(
      { email, password, callbackURL: callbackUrl },
      {
        fetchOptions: {
          onSuccess: () => router.push(callbackUrl),
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? "Identifiants incorrects");
          setLoading(false);
        },
      }
    );
    if (err) setLoading(false);
  };

  return (
    <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold text-[#333333]">Connexion</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-6 w-full max-w-sm space-y-4"
      >
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
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[#333333]/70">
        <Link href="/auth/forgot-password" className="text-[var(--accent)] hover:underline">
          Mot de passe oublié
        </Link>
        {" · "}
        <Link href="/auth/signup" className="text-[var(--accent)] hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-[#333333]/70">Chargement…</div>}>
      <LoginForm />
    </Suspense>
  );
}
