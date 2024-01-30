/*
  Warnings:

  - Made the column `hashedRt` on table `refresh_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "blacklist" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "hashedRt" SET NOT NULL;
