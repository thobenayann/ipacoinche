"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createTournamentAction({
  name,
  date,
  userId,
}: {
  name: string;
  date: string | null;
  userId: string;
}): Promise<{ id?: string; error?: string }> {
  if (!name.trim()) return { error: "Le nom est obligatoire." };

  try {
    const tournament = await prisma.tournament.create({
      data: {
        name: name.trim(),
        date: date ? new Date(date) : null,
        userId,
      },
    });
    revalidatePath("/app");
    return { id: tournament.id };
  } catch {
    return { error: "Impossible de créer le tournoi." };
  }
}
