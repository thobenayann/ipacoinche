"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AppNavClient() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  };

  if (session?.user) {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        className="flex min-h-[44px] min-w-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 text-[#333333] transition-colors hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
        aria-label="Déconnexion"
      >
        <LogOut className="size-5" aria-hidden />
        <span className="text-xs font-medium">Déconnexion</span>
      </button>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="flex min-h-[44px] min-w-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 text-[#333333] transition-colors hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
    >
      <User className="size-5" aria-hidden />
      <span className="text-xs font-medium">Compte</span>
    </Link>
  );
}
