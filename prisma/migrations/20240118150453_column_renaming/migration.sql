/*
  Warnings:

  - You are about to drop the column `isLocaAuth` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" RENAME COLUMN "isLocaAuth" TO "isLocalAuth";

