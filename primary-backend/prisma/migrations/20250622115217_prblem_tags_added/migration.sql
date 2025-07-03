-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY['general']::TEXT[];
