export default async function ReadOnlyRoundPage({
  params,
}: {
  params: Promise<{ token: string; roundIndex: string }>;
}) {
  const { token, roundIndex } = await params;
  return (
    <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold text-[#333333]">
        Tour {roundIndex} (lecture seule)
      </h1>
      <p className="text-[#333333]/70">
        Page placeholder — Tour partagé — pas de logique métier
      </p>
      <p className="text-sm text-[#333333]/50">
        Token: {token.slice(0, 8)}… — Tour: {roundIndex}
      </p>
    </div>
  );
}
