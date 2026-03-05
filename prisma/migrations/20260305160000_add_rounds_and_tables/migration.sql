-- CreateTable
CREATE TABLE "round" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "roundIndex" INTEGER NOT NULL,

    CONSTRAINT "round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_table" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "playerA1Id" TEXT,
    "playerA2Id" TEXT,
    "playerB1Id" TEXT,
    "playerB2Id" TEXT,
    "scoreTeamA" INTEGER,
    "scoreTeamB" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',

    CONSTRAINT "game_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "round_tournamentId_roundIndex_key" ON "round"("tournamentId", "roundIndex");

-- AddForeignKey
ALTER TABLE "round" ADD CONSTRAINT "round_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_table" ADD CONSTRAINT "game_table_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_table" ADD CONSTRAINT "game_table_playerA1Id_fkey" FOREIGN KEY ("playerA1Id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_table" ADD CONSTRAINT "game_table_playerA2Id_fkey" FOREIGN KEY ("playerA2Id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_table" ADD CONSTRAINT "game_table_playerB1Id_fkey" FOREIGN KEY ("playerB1Id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_table" ADD CONSTRAINT "game_table_playerB2Id_fkey" FOREIGN KEY ("playerB2Id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
