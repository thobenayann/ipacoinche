-- AlterTable
ALTER TABLE "tournament" ADD COLUMN "totalRounds" INTEGER NOT NULL DEFAULT 4;
ALTER TABLE "tournament" ADD COLUMN "shareLinkExpiryDays" INTEGER NOT NULL DEFAULT 7;
