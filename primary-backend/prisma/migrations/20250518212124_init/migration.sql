-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('Accepted', 'Wrong_Answer', 'TLE', 'MLE', 'Runtime_Error', 'Compilation_Error', 'Pending', 'Judging');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Medium', 'Easy', 'Hard');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('coder', 'admin', 'problem_setter');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "s3Url" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "acceptedCount" INTEGER NOT NULL DEFAULT 0,
    "contestAcceptedCount" INTEGER NOT NULL DEFAULT 0,
    "difficulty" "Difficulty" NOT NULL,
    "score" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,
    "author" INTEGER NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "codeUrl" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "verdict" "Verdict" NOT NULL DEFAULT 'Pending',
    "problemId" INTEGER NOT NULL,
    "official" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,
    "failedAttempts" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "lastAttempted" TIMESTAMP(3) NOT NULL,
    "finalTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemStat" (
    "id" SERIAL NOT NULL,
    "rankingId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "solved" BOOLEAN NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "ProblemStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContestToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ContestToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_title_key" ON "Problem"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_s3Url_key" ON "Problem"("s3Url");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_codeUrl_key" ON "Submission"("codeUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_userId_contestId_key" ON "Ranking"("userId", "contestId");

-- CreateIndex
CREATE INDEX "_ContestToUser_B_index" ON "_ContestToUser"("B");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemStat" ADD CONSTRAINT "ProblemStat_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "Ranking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemStat" ADD CONSTRAINT "ProblemStat_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestToUser" ADD CONSTRAINT "_ContestToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestToUser" ADD CONSTRAINT "_ContestToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
