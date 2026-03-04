export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string; playerId: string }>;
}) {
  const { id, playerId } = await params;
  return (
    <div className="flex min-h-[60vh] min-w-[360px] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold text-[#333333]">
        Détail joueur
      </h1>
      <p className="text-[#333333]/70">
        Page placeholder — Fiche joueur — pas de logique métier
      </p>
      <p className="text-sm text-[#333333]/50">
        Tournoi: {id} — Joueur: {playerId}
      </p>
    </div>
  );
}
