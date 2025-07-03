-- CreateEnum
CREATE TYPE "Language" AS ENUM ('java', 'javascript', 'cpp');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'java';
