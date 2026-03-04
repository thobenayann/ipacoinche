export default async function ReadOnlyPlayerPage({
  params,
}: {
  params: Promise<{ token: string; playerPublicId: string }>;
}) {
  const { token, playerPublicId } = await params;
  return (
    <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold text-[#333333]">
        Joueur (lecture seule)
      </h1>
      <p className="text-[#333333]/70">
        Page placeholder — Détail joueur partagé — pas de logique métier
      </p>
      <p className="text-sm text-[#333333]/50">
        Token: {token.slice(0, 8)}… — Joueur: {playerPublicId}
      </p>
    </div>
  );
}
