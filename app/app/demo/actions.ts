"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const DEMO_PLAYERS = [
  "Alice", "Bob", "Claire", "David",
  "Emma", "Fabien", "Gaëlle", "Hugo",
  "Inès", "Julien", "Karen", "Léo",
];

const DEMO_TOURNAMENT_NAME = "Tournoi Démo";
const DEMO_ROUNDS = 4;

function randomScore(): number {
  return Math.floor(Math.random() * 120) + 30;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function seedDemoAction({
  userId,
}: {
  userId: string;
}): Promise<{ tournamentId?: string; error?: string }> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const tournament = await tx.tournament.create({
        data: {
          name: DEMO_TOURNAMENT_NAME,
          date: new Date(),
          status: "started",
          totalRounds: DEMO_ROUNDS,
          userId,
        },
      });

      const players = await Promise.all(
        DEMO_PLAYERS.map((name) =>
          tx.player.create({
            data: { name, tournamentId: tournament.id },
          })
        )
      );

      const playerIds = players.map((p) => p.id);

      for (let ri = 0; ri < DEMO_ROUNDS; ri++) {
        const round = await tx.round.create({
          data: { tournamentId: tournament.id, roundIndex: ri },
        });

        const shuffled = shuffle(playerIds);
        const tablesCount = Math.floor(shuffled.length / 4);

        for (let ti = 0; ti < tablesCount; ti++) {
          const base = ti * 4;
          const sA = randomScore();
          const sB = randomScore();

          await tx.gameTable.create({
            data: {
              roundId: round.id,
              playerA1Id: shuffled[base],
              playerA2Id: shuffled[base + 1],
              playerB1Id: shuffled[base + 2],
              playerB2Id: shuffled[base + 3],
              scoreTeamA: sA,
              scoreTeamB: sB,
              status: "validated",
            },
          });
        }
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await tx.shareLink.create({
        data: {
          tournamentId: tournament.id,
          active: true,
          expiresAt,
        },
      });

      return tournament.id;
    });

    revalidatePath("/app");
    revalidatePath("/app/demo");
    return { tournamentId: result };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}

export async function resetDemoAction({
  userId,
}: {
  userId: string;
}): Promise<{ error?: string }> {
  try {
    await prisma.tournament.deleteMany({
      where: { userId, name: DEMO_TOURNAMENT_NAME },
    });
    revalidatePath("/app");
    revalidatePath("/app/demo");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
