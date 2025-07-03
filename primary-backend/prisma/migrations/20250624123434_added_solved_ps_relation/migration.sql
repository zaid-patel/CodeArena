-- CreateTable
CREATE TABLE "_solved problems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_solved problems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_solved problems_B_index" ON "_solved problems"("B");

-- CreateIndex
CREATE INDEX "ProblemStat_rankingId_idx" ON "ProblemStat"("rankingId");

-- CreateIndex
CREATE INDEX "Ranking_contestId_idx" ON "Ranking"("contestId");

-- AddForeignKey
ALTER TABLE "_solved problems" ADD CONSTRAINT "_solved problems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_solved problems" ADD CONSTRAINT "_solved problems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
