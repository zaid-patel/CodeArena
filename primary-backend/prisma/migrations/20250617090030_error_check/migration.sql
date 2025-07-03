/*
  Warnings:

  - A unique constraint covering the columns `[rankingId,problemId]` on the table `ProblemStat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProblemStat" ALTER COLUMN "attempts" SET DEFAULT 0,
ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "solved" SET DEFAULT false,
ALTER COLUMN "timeTaken" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "statement" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProblemStat_rankingId_problemId_key" ON "ProblemStat"("rankingId", "problemId");
