export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-[60vh] min-w-[360px] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold text-[#333333]">
        Tournoi (détail)
      </h1>
      <p className="text-[#333333]/70">
        Page placeholder — Tournoi id — pas de logique métier
      </p>
      <p className="text-sm text-[#333333]/50">ID: {id}</p>
    </div>
  );
}
