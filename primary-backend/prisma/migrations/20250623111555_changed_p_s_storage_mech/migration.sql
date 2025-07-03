/*
  Warnings:

  - You are about to drop the column `s3Url` on the `Problem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Problem_s3Url_key";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "s3Url",
ADD COLUMN     "constraints" TEXT,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'no description provided',
ADD COLUMN     "inputDescription" TEXT,
ADD COLUMN     "outputDescription" TEXT;
