"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function AuthForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await authClient.requestPasswordReset(
      { email, redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/login` },
      {
        onError: (ctx) => {
          setError(ctx.error.message ?? "Une erreur est survenue");
          setLoading(false);
        },
      }
    );
    if (!err) {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-2xl font-semibold text-[#333333]">Email envoyé</h1>
        <p className="text-center text-[#333333]/70">
          Si un compte existe pour cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe.
        </p>
        <Link
          href="/auth/login"
          className="min-h-[44px] rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold text-[#333333]">Mot de passe oublié</h1>
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
          {loading ? "Envoi…" : "Envoyer le lien"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[#333333]/70">
        <Link href="/auth/login" className="text-[var(--accent)] hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
