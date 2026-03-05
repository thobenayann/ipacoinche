-- CreateTable
CREATE TABLE "share_link" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "share_link_token_key" ON "share_link"("token");

-- AddForeignKey
ALTER TABLE "share_link" ADD CONSTRAINT "share_link_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
