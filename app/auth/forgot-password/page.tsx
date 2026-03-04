"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      {
        email,
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/login`
            : "",
      },
      {
        onError: (ctx) => {
          setError(ctx.error.message ?? "Une erreur est survenue");
        },
      }
    );
    if (!err) setSent(true);
    setLoading(false);
  };

  if (sent) {
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
            <CardTitle>Email envoyé</CardTitle>
            <CardDescription>
              Si un compte existe pour cette adresse, vous recevrez un lien pour
              réinitialiser votre mot de passe.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3 border-t border-[#333333]/10 pt-6">
            <Link href="/auth/login" className="block w-full cursor-pointer">
              <Button className="w-full">Retour à la connexion</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Saisissez votre email pour recevoir un lien de réinitialisation
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
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi…" : "Envoyer le lien"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-[#333333]/10 pt-6">
            <Link
              href="/auth/login"
              className="cursor-pointer text-center text-sm text-[var(--accent)] hover:underline"
            >
              Retour à la connexion
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
