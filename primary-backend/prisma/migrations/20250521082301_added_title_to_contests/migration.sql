/*
  Warnings:

  - You are about to drop the `_ContestToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `time` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ContestToUser" DROP CONSTRAINT "_ContestToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContestToUser" DROP CONSTRAINT "_ContestToUser_B_fkey";

-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "authorIds" INTEGER[],
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'new contest';

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "codeUrl" DROP NOT NULL;

-- DropTable
DROP TABLE "_ContestToUser";

-- CreateTable
CREATE TABLE "_participated in" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_participated in_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_participated in_B_index" ON "_participated in"("B");

-- AddForeignKey
ALTER TABLE "_participated in" ADD CONSTRAINT "_participated in_A_fkey" FOREIGN KEY ("A") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participated in" ADD CONSTRAINT "_participated in_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
