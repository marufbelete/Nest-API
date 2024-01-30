/*
  Warnings:

  - You are about to drop the column `csrfToken` on the `refresh_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[csrfSecret]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "refresh_tokens_csrfToken_key";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "csrfToken",
ADD COLUMN     "csrfSecret" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_csrfSecret_key" ON "refresh_tokens"("csrfSecret");
