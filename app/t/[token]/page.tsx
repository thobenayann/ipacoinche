import { redirect } from "next/navigation";

export default async function ReadonlyHomePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/t/${token}/leaderboard`);
}
