"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
    const { data, error: err } = await authClient.signUp.email(
      { name: name || email, email, password, callbackURL: "/app" },
      {
        onError: (ctx) => {
          setError(ctx.error.message ?? "Erreur lors de l'inscription");
        },
      }
    );
    setLoading(false);
    if (err) return;
    if (data) {
      router.push("/app");
    } else {
      router.push("/auth/login?message=compte-cree");
    }
  };

  return (
    <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center gap-8 bg-[var(--background)] px-4 py-8">
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/"
          className="cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
        >
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
          <CardTitle>Inscription</CardTitle>
          <CardDescription>
            Créez un compte pour gérer vos tournois
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom (optionnel)</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
              />
            </div>
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
              <Label htmlFor="password">Mot de passe (min. 8 caractères)</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Inscription…" : "Créer un compte"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-[#333333]/10 pt-6">
            <p className="text-center text-sm text-[#333333]/70">
              Déjà un compte ?{" "}
              <Link
                href="/auth/login"
                className="cursor-pointer font-medium text-[var(--accent)] hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
