/*
  Warnings:

  - You are about to drop the column `user_conversationId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `conversations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_conversations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_roomId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('GROUP', 'PRIVATE');

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "user_conversations" DROP CONSTRAINT "user_conversations_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "user_conversations" DROP CONSTRAINT "user_conversations_userId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "user_conversationId",
ADD COLUMN     "user_roomId" TEXT NOT NULL;

-- DropTable
DROP TABLE "conversations";

-- DropTable
DROP TABLE "user_conversations";

-- DropEnum
DROP TYPE "ConversationType";

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RoomType" NOT NULL DEFAULT 'PRIVATE',

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_rooms" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_name_key" ON "rooms"("name");

-- AddForeignKey
ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_roomId_fkey" FOREIGN KEY ("user_roomId") REFERENCES "user_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
