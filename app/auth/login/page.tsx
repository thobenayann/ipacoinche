"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center gap-8 bg-[var(--background)] px-4 py-8">
      <div className="flex flex-col items-center gap-2">
        <Link href="/" className="cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2">
          <Image
            src="/logo/logo-ipanova.svg"
            alt="IPANOVA"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <p className="text-sm text-[#333333]/60">Tournoi de Coinche</p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous pour gérer vos tournois
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vous@exemple.fr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-[#333333]/10 pt-6">
            <Link
              href="/auth/forgot-password"
              className="cursor-pointer text-sm text-[var(--accent)] hover:underline"
            >
              Mot de passe oublié
            </Link>
            <div className="w-full rounded-lg bg-[#333333]/5 p-4 text-center">
              <p className="text-sm font-medium text-[#333333]">
                Première visite ?
              </p>
              <p className="mt-1 text-sm text-[#333333]/70">
                Créez un compte en moins d’une minute pour gérer vos tournois.
              </p>
              <Link href="/auth/signup" className="mt-3 block w-full cursor-pointer">
                <Button variant="outline" className="w-full">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[#333333]/70">
          Chargement…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
