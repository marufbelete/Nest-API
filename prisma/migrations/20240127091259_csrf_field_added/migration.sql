/*
  Warnings:

  - A unique constraint covering the columns `[csrfToken]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "csrfToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_csrfToken_key" ON "refresh_tokens"("csrfToken");
