/*
  Warnings:

  - You are about to drop the column `csrfSecret` on the `refresh_tokens` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "refresh_tokens_csrfSecret_key";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "csrfSecret";
