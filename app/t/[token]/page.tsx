export default async function ReadOnlyHomePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="flex min-h-screen min-w-[360px] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold text-[#333333]">
        Lecture seule (accueil)
      </h1>
      <p className="text-[#333333]/70">
        Page placeholder — Vue partagée — pas de logique métier
      </p>
      <p className="text-sm text-[#333333]/50">Token: {token.slice(0, 8)}…</p>
    </div>
  );
}
